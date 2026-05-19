import { getSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteBikeButton from "./DeleteBikeButton";

export default async function AdminBikesPage() {
  const supabase = await getSupabaseServer();
  const { data: bikes } = await supabase
    .from("bikes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Manage Bikes</h1>
        <Link
          href="/admin/bikes/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Add New Bike
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Price</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Stock</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bikes?.map((bike) => (
              <tr key={bike.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{bike.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs capitalize">
                    {bike.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-700">${bike.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${bike.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {bike.in_stock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/bikes/${bike.id}/edit`}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <DeleteBikeButton id={bike.id} name={bike.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!bikes || bikes.length === 0) && (
          <p className="text-center py-12 text-slate-500">No bikes yet. Add your first bike!</p>
        )}
      </div>
    </div>
  );
}
