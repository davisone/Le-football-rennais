"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const signUp = async (formData: FormData) => {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, display_name: username },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
};

export const signIn = async (formData: FormData) => {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
};
