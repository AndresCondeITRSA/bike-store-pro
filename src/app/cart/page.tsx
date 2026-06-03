"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setPlacingOrder(true);
    const supabase = getSupabaseBrowser();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ user_id: user.id, total: totalPrice })
      .select()
      .single();

    if (orderError || !order) {
      alert("Failed to place order: " + (orderError?.message || "Unknown error"));
      setPlacingOrder(false);
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      bike_id: item.bike.id,
      quantity: item.quantity,
      price: item.bike.price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      alert("Failed to save order items: " + itemsError.message);
      setPlacingOrder(false);
      return;
    }

    // Confirm the order
    await supabase
      .from("orders")
      .update({ status: "confirmed" })
      .eq("id", order.id);

    // Send confirmation email via Edge Function (fire-and-forget)
    supabase.functions.invoke("send-order-confirmation", {
      body: { order_id: order.id, user_id: user.id },
    });

    clearCart();
    router.push("/orders");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Your Cart is Empty</h1>
        <p className="text-slate-600 mb-8">Looks like you haven&apos;t added any bikes yet.</p>
        <Link href="/products" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
          Browse Bikes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
        <button onClick={clearCart} className="text-red-600 hover:text-red-700 text-sm font-medium">
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.bike.id} className="bg-white rounded-xl shadow-md p-4 flex gap-4">
              <div className="relative w-28 h-28 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={item.bike.image_url} alt={item.bike.name} fill className="object-cover" sizes="112px" />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/products/${item.bike.id}`} className="font-bold text-slate-900 hover:text-emerald-600">
                      {item.bike.name}
                    </Link>
                    <p className="text-slate-500 text-sm capitalize">{item.bike.category} Bike</p>
                  </div>
                  <button onClick={() => removeFromCart(item.bike.id)} className="text-slate-400 hover:text-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.bike.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >−</button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.bike.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >+</button>
                  </div>
                  <span className="font-bold text-emerald-600 text-lg">
                    ${(item.bike.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">{totalPrice >= 500 ? "Free" : "$49.99"}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg text-slate-900">
                <span>Total</span>
                <span>${(totalPrice + (totalPrice >= 500 ? 0 : 49.99)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={placingOrder}
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-4 rounded-lg font-semibold transition-colors text-lg"
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
            {!user && (
              <p className="text-center text-xs text-slate-500 mt-4">
                You&apos;ll need to sign in to complete your purchase.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
