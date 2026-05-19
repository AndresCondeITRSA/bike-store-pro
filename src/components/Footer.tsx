import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">BikeStore</h3>
            <p className="text-sm">
              Your premier destination for quality bicycles. From mountain trails to city streets.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=mountain" className="hover:text-emerald-400">Mountain Bikes</Link></li>
              <li><Link href="/products?category=road" className="hover:text-emerald-400">Road Bikes</Link></li>
              <li><Link href="/products?category=urban" className="hover:text-emerald-400">Urban Bikes</Link></li>
              <li><Link href="/products?category=electric" className="hover:text-emerald-400">Electric Bikes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/orders" className="hover:text-emerald-400">My Orders</Link></li>
              <li><Link href="/favorites" className="hover:text-emerald-400">Favorites</Link></li>
              <li><Link href="/cart" className="hover:text-emerald-400">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-pointer hover:text-emerald-400">Shipping Info</span></li>
              <li><span className="cursor-pointer hover:text-emerald-400">Returns</span></li>
              <li><span className="cursor-pointer hover:text-emerald-400">Warranty</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2026 BikeStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
