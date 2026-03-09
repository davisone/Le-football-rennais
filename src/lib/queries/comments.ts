import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

// Type pour un commentaire avec les infos auteur
export type CommentWithAuthor = Tables<"comments"> & {
  author: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    role: "member" | "moderator" | "admin";
  } | null;
};

// Récupère tous les commentaires d'un article, triés par date de création
export const getCommentsByArticleId = async (
  articleId: string
): Promise<CommentWithAuthor[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select("*, author:user_profiles(username, display_name, avatar_url, role)")
    .eq("article_id", articleId)
    .order("created_at", { ascending: true });
  return (data as CommentWithAuthor[]) ?? [];
};
