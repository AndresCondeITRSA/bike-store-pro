"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { signOutAction } from "@/app/(auth)/actions";


export default function Header() {
    const { user, loading } = useAuth();
    const { totalItems } = useCart();

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="5.5" cy="17.5" r="3.5" strokeWidth="2" />
              <circle cx="18.5" cy="17.5" r="3.5" strokeWidth="2" />
              <path strokeWidth="2" d="M5.5 17.5h4l3-8h5.5l2.5 8M9.5 9.5L12 4" />
            </svg>
            <span className="text-xl font-bold tracking-tight">BikeStore</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="hover:text-emerald-400 transition-colors">
              Bikes
            </Link>
            <Link href="/products?category=mountain" className="hover:text-emerald-400 transition-colors">
              Mountain
            </Link>
            <Link href="/products?category=road" className="hover:text-emerald-400 transition-colors">
              Road
            </Link>
            <Link href="/products?category=electric" className="hover:text-emerald-400 transition-colors">
              Electric
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium">
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link href="/favorites" className="hover:text-red-400 transition-colors" title="Favorites">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </Link>
                    <Link href="/orders" className="hover:text-emerald-400 transition-colors text-sm">
                      Orders
                    </Link>
                    <form action={signOutAction}>
                      <button type="submit" className="text-slate-300 hover:text-white text-sm transition-colors">
                        Sign Out
                      </button>
                    </form>
                  </div>
                ) : (
                  <Link href="/login" className="text-sm hover:text-emerald-400 transition-colors">
                    Sign In
                  </Link>
                )}
              </>
            )}

            <Link
              href="/cart"
              className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
