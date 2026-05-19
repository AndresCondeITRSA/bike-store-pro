"use server";

import { getSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { pipe, validateRequired, sanitizeStrings } from "@/lib/pipeline";

export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = await pipe(raw)
    .through(validateRequired(["email", "password"]))
    .through(sanitizeStrings(["email"]))
    .execute();

  if (!result.success) {
    return { error: result.error };
  }

  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email as string,
    password: result.data.password as string,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function registerAction(formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    fullName: formData.get("fullName") as string,
  };

  const result = await pipe(raw)
    .through(validateRequired(["email", "password", "fullName"]))
    .through(sanitizeStrings(["email", "fullName"]))
    .execute();

  if (!result.success) {
    return { error: result.error };
  }

  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.signUp({
    email: result.data.email as string,
    password: result.data.password as string,
    options: {
      data: { full_name: result.data.fullName as string },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/login?registered=true");
}

export async function signOutAction() {
  const supabase = await getSupabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}
