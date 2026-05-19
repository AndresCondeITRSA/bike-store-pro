import { getSupabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import FavoriteButton from "./FavoriteButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getSupabaseServer();
  const { data: bike } = await supabase.from("bikes").select("*").eq("id", id).single();

  if (!bike) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium mb-8 inline-block">
        ← Back to all bikes
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
          <Image
            src={bike.image_url}
            alt={bike.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col">
          <span className="text-emerald-600 font-medium capitalize text-sm">{bike.category} Bike</span>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">{bike.name}</h1>
          <p className="text-slate-600 text-lg mt-4">{bike.description}</p>

          <div className="mt-8">
            <span className="text-4xl font-bold text-emerald-600">${bike.price}</span>
            <span className="text-slate-500 text-sm ml-2">+ Free Shipping</span>
          </div>

          <div className="mt-6">
            {bike.in_stock ? (
              <span className="text-green-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                In Stock - Ready to Ship
              </span>
            ) : (
              <span className="text-red-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                Out of Stock
              </span>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <AddToCartButton bike={bike} />
            <FavoriteButton bikeId={bike.id} />
          </div>

          <div className="mt-10 border-t pt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Specifications</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <dt className="text-sm text-slate-500">Frame</dt>
                <dd className="font-medium text-slate-900 mt-1">{bike.frame}</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dt className="text-sm text-slate-500">Wheels</dt>
                <dd className="font-medium text-slate-900 mt-1">{bike.wheels}</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dt className="text-sm text-slate-500">Gears</dt>
                <dd className="font-medium text-slate-900 mt-1">{bike.gears}</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dt className="text-sm text-slate-500">Brakes</dt>
                <dd className="font-medium text-slate-900 mt-1">{bike.brakes}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
