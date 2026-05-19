import { getSupabaseServer } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*, bikes(name, image_url))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = data as unknown as Array<{
    id: string;
    user_id: string;
    status: string;
    total: number;
    created_at: string;
    order_items: Array<{
      id: string;
      order_id: string;
      bike_id: string;
      quantity: number;
      price: number;
      bikes: { name: string; image_url: string } | null;
    }>;
  }> | null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Orders</h1>

      {(!orders || orders.length === 0) ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-slate-600 text-lg">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-500">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  order.status === "delivered" ? "bg-green-100 text-green-700" :
                  order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                  order.status === "confirmed" ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="border-t pt-4">
                <p className="font-bold text-slate-900">Total: ${order.total}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
