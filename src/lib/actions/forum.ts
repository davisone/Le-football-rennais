"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { InsertTables } from "@/types/database";

const generateSlug = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

// Crée un nouveau topic avec son premier post
export const createTopic = async (
  categorySlug: string,
  formData: FormData
): Promise<{ error: string } | void> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Vous devez être connecté." };

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();

  if (!title) return { error: "Le titre est requis." };
  if (!content) return { error: "Le contenu est requis." };
  if (title.length > 200) return { error: "Le titre est trop long (200 car. max)." };
  if (content.length > 10000) return { error: "Le message est trop long." };

  // Récupérer la catégorie
  const { data: category } = await supabase
    .from("forum_categories")
    .select("id, slug")
    .eq("slug", categorySlug)
    .single();

  if (!category) return { error: "Catégorie introuvable." };

  // Générer un slug unique
  let slug = generateSlug(title);
  const { data: existing } = await supabase
    .from("forum_topics")
    .select("id")
    .eq("slug", slug)
    .single();
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  // Créer le topic
  const { data: topic, error: topicError } = await supabase
    .from("forum_topics")
    .insert({
      category_id: category.id,
      author_id: user.id,
      title,
      slug,
    } as InsertTables<"forum_topics">)
    .select("id, slug")
    .single();

  if (topicError) return { error: "Impossible de créer le sujet." };

  // Créer le premier post
  const { error: postError } = await supabase
    .from("forum_posts")
    .insert({
      topic_id: topic.id,
      author_id: user.id,
      content,
    } as InsertTables<"forum_posts">);

  if (postError) return { error: "Impossible de publier le message." };

  revalidatePath(`/forum/${categorySlug}`);
  redirect(`/forum/${categorySlug}/${topic.slug}`);
};

// Ajouter un post dans un topic existant
export const createPost = async (
  topicId: string,
  topicSlug: string,
  categorySlug: string,
  formData: FormData
): Promise<{ error: string | null }> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Vous devez être connecté." };

  const content = (formData.get("content") as string)?.trim();
  if (!content) return { error: "Le message ne peut pas être vide." };
  if (content.length > 10000) return { error: "Le message est trop long." };

  // Vérifier que le topic n'est pas verrouillé
  const { data: topic } = await supabase
    .from("forum_topics")
    .select("is_locked")
    .eq("id", topicId)
    .single();

  if (topic?.is_locked) return { error: "Ce sujet est verrouillé." };

  const { error } = await supabase
    .from("forum_posts")
    .insert({
      topic_id: topicId,
      author_id: user.id,
      content,
    } as InsertTables<"forum_posts">);

  if (error) return { error: "Impossible d'envoyer le message." };

  revalidatePath(`/forum/${categorySlug}/${topicSlug}`);
  return { error: null };
};

// Supprimer un post (auteur, modérateur ou admin)
export const deletePost = async (
  postId: string,
  topicSlug: string,
  categorySlug: string
): Promise<{ error: string | null }> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("forum_posts")
    .delete()
    .eq("id", postId);

  if (error) return { error: "Impossible de supprimer le message." };

  revalidatePath(`/forum/${categorySlug}/${topicSlug}`);
  return { error: null };
};

// Incrémenter le view_count d'un topic
export const incrementViewCount = async (topicId: string): Promise<void> => {
  const supabase = await createClient();
  await supabase.rpc("increment_view_count" as never, {
    topic_id: topicId,
  } as never);
};

// Épingler / désépingler un topic (modérateur ou admin)
export const togglePinTopic = async (
  topicId: string,
  isPinned: boolean,
  topicSlug: string,
  categorySlug: string
): Promise<{ error: string | null }> => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("forum_topics")
    .update({ is_pinned: !isPinned })
    .eq("id", topicId);

  if (error) return { error: "Impossible de modifier l'épinglage." };

  revalidatePath(`/forum/${categorySlug}`);
  revalidatePath(`/forum/${categorySlug}/${topicSlug}`);
  return { error: null };
};

// Supprimer un topic (modérateur ou admin)
export const deleteTopic = async (
  topicId: string,
  categorySlug: string
): Promise<{ error: string } | void> => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("forum_topics")
    .delete()
    .eq("id", topicId);
  if (error) return { error: "Impossible de supprimer le sujet." };
  revalidatePath(`/forum/${categorySlug}`);
  revalidatePath("/admin/forum");
  redirect(`/forum/${categorySlug}`);
};

// Verrouiller / déverrouiller un topic (modérateur ou admin)
export const toggleLockTopic = async (
  topicId: string,
  isLocked: boolean,
  topicSlug: string,
  categorySlug: string
): Promise<{ error: string | null }> => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("forum_topics")
    .update({ is_locked: !isLocked })
    .eq("id", topicId);

  if (error) return { error: "Impossible de modifier le verrouillage." };

  revalidatePath(`/forum/${categorySlug}`);
  revalidatePath(`/forum/${categorySlug}/${topicSlug}`);
  return { error: null };
};
