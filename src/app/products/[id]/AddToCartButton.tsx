"use client";

import { useCart } from "@/context/CartContext";
import type { Database } from "@/types/database";

type Bike = Database["public"]["Tables"]["bikes"]["Row"];

export default function AddToCartButton({ bike }: { bike: Bike }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(bike)}
      disabled={!bike.in_stock}
      className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
    >
      {bike.in_stock ? "Add to Cart" : "Out of Stock"}
    </button>
  );
}
