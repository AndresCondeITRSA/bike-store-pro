"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ bikeId }: { bikeId: string }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFavorite = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    const supabase = getSupabaseBrowser();

    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("bike_id", bikeId)
      .single();

    if (existing) {
      await supabase.from("favorites").delete().eq("id", existing.id);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, bike_id: bikeId });
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleFavorite}
      disabled={loading}
      className="px-4 py-4 rounded-lg border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 transition-colors"
      title="Add to favorites"
    >
      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
