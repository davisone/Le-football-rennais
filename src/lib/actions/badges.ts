"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { InsertTables } from "@/types/database";

// Vérifie que l'utilisateur courant est admin
const requireAdmin = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single<{ role: string }>();

  return profile?.role === "admin" ? supabase : null;
};

export const updateUserRole = async (
  userId: string,
  role: "member" | "moderator" | "admin"
): Promise<{ error: string | null }> => {
  const supabase = await requireAdmin();
  if (!supabase) return { error: "Non autorisé." };

  const { error } = await supabase
    .from("user_profiles")
    .update({ role })
    .eq("id", userId);

  if (error) return { error: "Impossible de modifier le rôle." };

  revalidatePath("/admin/membres");
  return { error: null };
};

export const awardBadge = async (
  userId: string,
  badgeId: string
): Promise<{ error: string | null }> => {
  const supabase = await requireAdmin();
  if (!supabase) return { error: "Non autorisé." };

  const { error } = await supabase
    .from("user_badges")
    .insert({ user_id: userId, badge_id: badgeId } as InsertTables<"user_badges">);

  if (error) {
    if (error.code === "23505") return { error: "Badge déjà attribué." };
    return { error: "Impossible d'attribuer le badge." };
  }

  revalidatePath("/admin/membres");
  return { error: null };
};

export const removeBadge = async (
  userId: string,
  badgeId: string
): Promise<{ error: string | null }> => {
  const supabase = await requireAdmin();
  if (!supabase) return { error: "Non autorisé." };

  const { error } = await supabase
    .from("user_badges")
    .delete()
    .eq("user_id", userId)
    .eq("badge_id", badgeId);

  if (error) return { error: "Impossible de retirer le badge." };

  revalidatePath("/admin/membres");
  return { error: null };
};
