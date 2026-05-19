import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/bikes"
          className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">🚲</div>
          <h2 className="text-xl font-bold text-slate-900">Manage Bikes</h2>
          <p className="text-slate-500 text-sm mt-2">
            Create, edit, and delete bicycle listings
          </p>
        </Link>

        <div className="bg-white rounded-xl shadow-md p-8 opacity-60">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-slate-900">Orders</h2>
          <p className="text-slate-500 text-sm mt-2">
            View and manage customer orders
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 opacity-60">
          <div className="text-4xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-slate-900">Users</h2>
          <p className="text-slate-500 text-sm mt-2">
            Manage user accounts and roles
          </p>
        </div>
      </div>
    </div>
  );
}
