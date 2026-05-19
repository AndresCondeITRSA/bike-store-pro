"use client";

import { deleteBikeAction } from "./actions";
import { useRouter } from "next/navigation";

export default function DeleteBikeButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const result = await deleteBikeAction(id);
    if (result?.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-700 text-sm font-medium"
    >
      Delete
    </button>
  );
}
