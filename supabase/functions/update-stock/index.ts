import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface RequestBody {
  bike_id: string;
  quantity: number;
}

serve(async (req) => {
  try {
    // Verify authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { bike_id, quantity }: RequestBody = await req.json();

    if (!bike_id || !quantity || quantity <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid bike_id or quantity" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get current stock
    const { data: bike, error: fetchError } = await supabase
      .from("bikes")
      .select("id, name, stock")
      .eq("id", bike_id)
      .single();

    if (fetchError || !bike) {
      return new Response(
        JSON.stringify({ error: "Bike not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const newStock = Math.max(0, bike.stock - quantity);

    // Update stock (in_stock will be synced automatically by the DB trigger)
    const { error: updateError } = await supabase
      .from("bikes")
      .update({ stock: newStock })
      .eq("id", bike_id);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Failed to update stock", details: updateError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`Stock updated: ${bike.name} (${bike_id}) ${bike.stock} -> ${newStock}`);

    return new Response(
      JSON.stringify({
        success: true,
        bike_id,
        previous_stock: bike.stock,
        new_stock: newStock,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
