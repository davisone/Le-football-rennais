import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

// Type pour un article avec les infos auteur
export type ArticleWithAuthor = Tables<"articles"> & {
  author: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

// Récupère tous les articles publiés, triés par date de publication
export const getPublishedArticles = async (): Promise<ArticleWithAuthor[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, author:user_profiles(username, display_name, avatar_url)")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return (data as ArticleWithAuthor[]) ?? [];
};

// Récupère un article par son slug
export const getArticleBySlug = async (
  slug: string
): Promise<ArticleWithAuthor | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, author:user_profiles(username, display_name, avatar_url)")
    .eq("slug", slug)
    .single();
  return data as ArticleWithAuthor | null;
};
