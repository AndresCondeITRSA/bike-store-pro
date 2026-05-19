import { getSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await getSupabaseServer();

  let query = supabase.from("bikes").select("*").order("created_at", { ascending: false });
  if (category) {
    query = query.eq("category", category as "mountain" | "road" | "urban" | "electric");
  }
  const { data: bikes } = await query;

  const categoryTitle = category
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} Bikes`
    : "All Bikes";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{categoryTitle}</h1>
        <p className="text-slate-600 mt-2 sm:mt-0">
          {bikes?.length ?? 0} bike{(bikes?.length ?? 0) !== 1 && "s"} available
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { label: "All", value: "" },
          { label: "Mountain", value: "mountain" },
          { label: "Road", value: "road" },
          { label: "Urban", value: "urban" },
          { label: "Electric", value: "electric" },
        ].map((filter) => (
          <Link
            key={filter.value}
            href={filter.value ? `/products?category=${filter.value}` : "/products"}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              (category || "") === filter.value
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-slate-700 hover:bg-gray-200"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {bikes?.map((bike) => (
          <Link
            key={bike.id}
            href={`/products/${bike.id}`}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-56">
              <Image
                src={bike.image_url}
                alt={bike.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs px-2 py-1 rounded capitalize">
                {bike.category}
              </span>
              {!bike.in_stock && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Out of Stock
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-900">{bike.name}</h3>
              <p className="text-slate-600 text-sm mt-2 line-clamp-2">{bike.description}</p>
              <p className="text-2xl font-bold text-emerald-600 mt-3">${bike.price}</p>
            </div>
          </Link>
        ))}
      </div>

      {(!bikes || bikes.length === 0) && (
        <div className="text-center py-20">
          <p className="text-slate-600 text-lg">No bikes found.</p>
        </div>
      )}
    </div>
  );
}
