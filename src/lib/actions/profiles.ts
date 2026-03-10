"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  // Upload de l'avatar si un fichier est fourni
  let avatar_url: string | null = (formData.get("avatar_url_current") as string) || null;
  const avatarFile = formData.get("avatar_file") as File | null;

  if (avatarFile && avatarFile.size > 0) {
    const ext = avatarFile.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type });

    if (uploadError) return { error: "Erreur lors de l'upload de l'avatar." };

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    // Ajouter un timestamp pour forcer le rechargement du cache
    avatar_url = `${urlData.publicUrl}?t=${Date.now()}`;
  }

  const { error } = await supabase
    .from("user_profiles")
    .update({ display_name, bio, avatar_url })
    .eq("id", user.id);

  if (error) return { error: "Impossible de modifier le profil." };

  if (profile) revalidatePath(`/profil/${profile.username}`);
  return { error: null };
};

export const deleteAccount = async (): Promise<{ error: string | null }> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Supprimer l'avatar du storage
  await supabase.storage.from("avatars").remove([`${user.id}/avatar.jpg`, `${user.id}/avatar.png`, `${user.id}/avatar.webp`]);

  const { error } = await adminClient.auth.admin.deleteUser(user.id);
  if (error) return { error: "Impossible de supprimer le compte." };

  redirect("/");
};
