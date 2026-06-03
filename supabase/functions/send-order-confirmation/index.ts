import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestBody {
  order_id: string;
  user_id: string;
}

interface OrderItem {
  quantity: number;
  price: number;
  bikes: { name: string } | null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { order_id, user_id }: RequestBody = await req.json();

    if (!order_id || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing order_id or user_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch order with items
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, order_items(quantity, price, bikes(name))")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", user_id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build email content
    const orderItems = order.order_items as OrderItem[];
    const itemsList = orderItems
      .map(
        (item) =>
          `• ${item.bikes?.name ?? "Unknown bike"} x${item.quantity} — $${(item.price * item.quantity).toFixed(2)}`
      )
      .join("\n");

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #064e3b; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">🚲 BikeStore Pro</h1>
        </div>
        <div style="padding: 24px; background: #f8fafc;">
          <h2 style="color: #1e293b;">Order Confirmed!</h2>
          <p style="color: #475569;">
            Hi ${profile.full_name || "Customer"},
          </p>
          <p style="color: #475569;">
            Your order <strong>#${order_id.slice(0, 8)}</strong> has been confirmed and is being prepared.
          </p>
          
          <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Order Summary</h3>
            ${orderItems
              .map(
                (item) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #334155;">${item.bikes?.name ?? "Bike"} x${item.quantity}</span>
                <span style="color: #059669; font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `
              )
              .join("")}
            <div style="display: flex; justify-content: space-between; padding: 12px 0 0; margin-top: 8px;">
              <strong style="color: #1e293b;">Total</strong>
              <strong style="color: #059669; font-size: 1.2em;">$${order.total.toFixed(2)}</strong>
            </div>
          </div>

          <p style="color: #475569;">
            We'll notify you when your order ships. Thank you for choosing BikeStore Pro!
          </p>
        </div>
        <div style="background: #1e293b; padding: 16px; text-align: center;">
          <p style="color: #94a3b8; margin: 0; font-size: 12px;">
            © BikeStore Pro. All rights reserved.
          </p>
        </div>
      </div>
    `;

    // Send email via Supabase Auth (or integrate with Resend/SendGrid)
    // Using Resend as the email provider
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (RESEND_API_KEY) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "BikeStore Pro <orders@bikestore.pro>",
          to: [profile.email],
          subject: `Order #${order_id.slice(0, 8)} Confirmed — BikeStore Pro`,
          html: emailHtml,
        }),
      });

      if (!emailResponse.ok) {
        const errorBody = await emailResponse.text();
        console.error("Email send failed:", errorBody);
        return new Response(
          JSON.stringify({ error: "Failed to send email", details: errorBody }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Confirmation email sent to ${profile.email} for order ${order_id}`);
    } else {
      // Fallback: log the email (for development without email provider)
      console.log("=== ORDER CONFIRMATION EMAIL ===");
      console.log(`To: ${profile.email}`);
      console.log(`Subject: Order #${order_id.slice(0, 8)} Confirmed`);
      console.log(`Items:\n${itemsList}`);
      console.log(`Total: $${order.total.toFixed(2)}`);
      console.log("================================");
      console.warn("RESEND_API_KEY not set — email logged but not sent");
    }

    return new Response(
      JSON.stringify({
        success: true,
        email_sent_to: profile.email,
        order_id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
