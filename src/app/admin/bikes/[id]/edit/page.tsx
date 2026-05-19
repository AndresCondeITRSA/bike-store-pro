import { getSupabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BikeForm from "../../BikeForm";
import { updateBikeAction } from "../../actions";

interface Bike {
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
}

export default async function EditBikePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("bikes")
    .select("*")
    .eq("id", id)
    .single();

  const bike = data as Bike | null;
  if (!bike) notFound();

  const boundAction = async (formData: FormData) => {
    "use server";
    return updateBikeAction(id, formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Edit: {bike.name}</h1>
      <BikeForm initialData={bike} action={boundAction} submitLabel="Update Bike" />
    </div>
  );
}
