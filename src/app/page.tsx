import Link from "next/link";
import Image from "next/image";
import { getSupabaseServer } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await getSupabaseServer();
  const { data: featured } = await supabase
    .from("bikes")
    .select("*")
    .eq("in_stock", true)
    .limit(3);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1920&h=600&fit=crop"
            alt="Cycling background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Ride Your <span className="text-emerald-400">Adventure</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Premium bicycles for every terrain. Find your perfect ride today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Shop All Bikes
            </Link>
            <Link href="/products?category=electric" className="border-2 border-white hover:bg-white hover:text-slate-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Explore E-Bikes
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Mountain", slug: "mountain", emoji: "⛰️" },
            { name: "Road", slug: "road", emoji: "🏁" },
            { name: "Urban", slug: "urban", emoji: "🏙️" },
            { name: "Electric", slug: "electric", emoji: "⚡" },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-5xl block mb-4">{cat.emoji}</span>
              <h3 className="text-xl font-bold text-slate-900">{cat.name}</h3>
              <p className="text-emerald-600 text-sm mt-2 font-medium">Browse collection →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured && featured.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Featured Bikes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featured.map((bike) => (
                <Link key={bike.id} href={`/products/${bike.id}`} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <div className="relative h-56">
                    <Image src={bike.image_url} alt={bike.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900">{bike.name}</h3>
                    <p className="text-slate-600 text-sm mt-1 line-clamp-2">{bike.description}</p>
                    <p className="text-emerald-600 font-bold text-xl mt-3">${bike.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-lg font-bold text-slate-900">Free Shipping</h3>
            <p className="text-slate-600 text-sm mt-2">Free delivery on orders over $500</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-lg font-bold text-slate-900">Expert Assembly</h3>
            <p className="text-slate-600 text-sm mt-2">Professional assembly included</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-lg font-bold text-slate-900">Lifetime Warranty</h3>
            <p className="text-slate-600 text-sm mt-2">Frame warranty for life</p>
          </div>
        </div>
      </section>
    </div>
  );
}
