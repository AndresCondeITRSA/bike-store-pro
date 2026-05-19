"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BikeFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    in_stock: boolean;
    frame: string;
    wheels: string;
    gears: string;
    brakes: string;
  };
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  submitLabel: string;
}

export default function BikeForm({ initialData, action, submitLabel }: BikeFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/bikes");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Bike Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={initialData?.name}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="Trail Pro 3000"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={initialData?.category || "mountain"}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="mountain">Mountain</option>
            <option value="road">Road</option>
            <option value="urban">Urban</option>
            <option value="electric">Electric</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={initialData?.description}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          placeholder="Describe the bike..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
            Price ($) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={initialData?.price}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="1899.99"
          />
        </div>
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-slate-700 mb-1">
            Image URL *
          </label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            required
            defaultValue={initialData?.image_url}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="in_stock"
          name="in_stock"
          type="checkbox"
          value="true"
          defaultChecked={initialData?.in_stock ?? true}
          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        />
        <label htmlFor="in_stock" className="text-sm font-medium text-slate-700">
          In Stock
        </label>
      </div>

      <h3 className="text-lg font-semibold text-slate-900 pt-4 border-t">Specifications</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="frame" className="block text-sm font-medium text-slate-700 mb-1">
            Frame *
          </label>
          <input
            id="frame"
            name="frame"
            type="text"
            required
            defaultValue={initialData?.frame}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="Aluminum Full Suspension"
          />
        </div>
        <div>
          <label htmlFor="wheels" className="block text-sm font-medium text-slate-700 mb-1">
            Wheels *
          </label>
          <input
            id="wheels"
            name="wheels"
            type="text"
            required
            defaultValue={initialData?.wheels}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="29&quot; Tubeless Ready"
          />
        </div>
        <div>
          <label htmlFor="gears" className="block text-sm font-medium text-slate-700 mb-1">
            Gears *
          </label>
          <input
            id="gears"
            name="gears"
            type="text"
            required
            defaultValue={initialData?.gears}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="Shimano Deore 12-speed"
          />
        </div>
        <div>
          <label htmlFor="brakes" className="block text-sm font-medium text-slate-700 mb-1">
            Brakes *
          </label>
          <input
            id="brakes"
            name="brakes"
            type="text"
            required
            defaultValue={initialData?.brakes}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="Hydraulic Disc Brakes"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
