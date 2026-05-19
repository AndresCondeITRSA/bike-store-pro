import { getSupabaseServer } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function FavoritesPage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("favorites")
    .select("*, bikes(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const favorites = data as unknown as Array<{
    id: string;
    user_id: string;
    bike_id: string;
    created_at: string;
    bikes: {
      id: string; name: string; image_url: string; price: number; category: string; description: string;
    } | null;
  }> | null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Favorites</h1>

      {(!favorites || favorites.length === 0) ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">❤️</div>
          <p className="text-slate-600 text-lg">No favorites yet.</p>
          <Link href="/products" className="text-emerald-600 hover:underline mt-4 inline-block font-medium">
            Browse bikes →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((fav) => {
            const bike = fav.bikes;
            if (!bike) return null;
            return (
              <Link
                key={fav.id}
                href={`/products/${bike.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image src={bike.image_url} alt={bike.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900">{bike.name}</h3>
                  <p className="text-emerald-600 font-bold mt-2">${bike.price}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
