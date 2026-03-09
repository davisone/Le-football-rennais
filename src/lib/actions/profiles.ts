"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const updateProfile = async (
  formData: FormData
): Promise<{ error: string | null }> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const display_name = (formData.get("display_name") as string)?.trim() || null;
  const bio = (formData.get("bio") as string)?.trim() || null;
  const avatar_url = (formData.get("avatar_url") as string)?.trim() || null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  const { error } = await supabase
    .from("user_profiles")
    .update({ display_name, bio, avatar_url })
    .eq("id", user.id);

  if (error) return { error: "Impossible de modifier le profil." };

  if (profile) revalidatePath(`/profil/${profile.username}`);
  return { error: null };
};
