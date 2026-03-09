"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { InsertTables } from "@/types/database";

// Crée un nouveau commentaire sur un article
export const createComment = async (formData: FormData) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté pour commenter." };
  }

  const articleId = formData.get("article_id") as string;
  const content = (formData.get("content") as string)?.trim();

  if (!articleId) {
    return { error: "Article introuvable." };
  }

  if (!content || content.length === 0) {
    return { error: "Le commentaire ne peut pas être vide." };
  }

  if (content.length > 2000) {
    return { error: "Le commentaire ne doit pas dépasser 2000 caractères." };
  }

  const { error } = await supabase.from("comments").insert({
    article_id: articleId,
    author_id: user.id,
    content,
  } as InsertTables<"comments">);

  if (error) {
    return { error: "Impossible de publier le commentaire. Réessayez." };
  }

  // Récupérer le slug de l'article pour revalider le bon chemin
  const { data: article } = await supabase
    .from("articles")
    .select("slug")
    .eq("id", articleId)
    .single();

  if (article?.slug) {
    revalidatePath(`/blog/${article.slug}`);
  }

  return { error: null };
};

// Supprime un commentaire (les RLS gèrent l'autorisation)
export const deleteComment = async (commentId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  // Récupérer l'article_id avant suppression pour pouvoir revalider
  const { data: comment } = await supabase
    .from("comments")
    .select("article_id")
    .eq("id", commentId)
    .single();

  if (!comment) {
    return { error: "Commentaire introuvable." };
  }

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    return { error: "Impossible de supprimer le commentaire." };
  }

  // Revalider la page article
  const { data: article } = await supabase
    .from("articles")
    .select("slug")
    .eq("id", comment.article_id)
    .single();

  if (article?.slug) {
    revalidatePath(`/blog/${article.slug}`);
  }

  return { error: null };
};
