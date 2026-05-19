"use server";

import { getSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  pipe,
  validateRequired,
  validatePositive,
  sanitizeStrings,
  parseNumbers,
  parseBooleans,
} from "@/lib/pipeline";

const bikeStringFields = ["name", "description", "image_url", "category", "frame", "wheels", "gears", "brakes"];
const bikeRequiredFields = [...bikeStringFields, "price"];

export async function createBikeAction(formData: FormData) {
  const raw: Record<string, unknown> = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    image_url: formData.get("image_url"),
    category: formData.get("category"),
    in_stock: formData.get("in_stock") ?? "true",
    frame: formData.get("frame"),
    wheels: formData.get("wheels"),
    gears: formData.get("gears"),
    brakes: formData.get("brakes"),
  };

  const result = await pipe(raw)
    .through(validateRequired(bikeRequiredFields))
    .through(sanitizeStrings(bikeStringFields))
    .through(validatePositive(["price"]))
    .through(parseNumbers(["price"]))
    .through(parseBooleans(["in_stock"]))
    .execute();

  if (!result.success) {
    return { error: result.error };
  }

  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("bikes").insert(result.data as never);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/bikes");
  revalidatePath("/products");
  return { success: true };
}

export async function updateBikeAction(id: string, formData: FormData) {
  const raw: Record<string, unknown> = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    image_url: formData.get("image_url"),
    category: formData.get("category"),
    in_stock: formData.get("in_stock") ?? "false",
    frame: formData.get("frame"),
    wheels: formData.get("wheels"),
    gears: formData.get("gears"),
    brakes: formData.get("brakes"),
  };

  const result = await pipe(raw)
    .through(validateRequired(bikeRequiredFields))
    .through(sanitizeStrings(bikeStringFields))
    .through(validatePositive(["price"]))
    .through(parseNumbers(["price"]))
    .through(parseBooleans(["in_stock"]))
    .execute();

  if (!result.success) {
    return { error: result.error };
  }

  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("bikes")
    .update(result.data as never)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/bikes");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteBikeAction(id: string) {
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("bikes").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/bikes");
  revalidatePath("/products");
  return { success: true };
}
