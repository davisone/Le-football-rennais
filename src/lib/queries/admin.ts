import { createClient } from "@/lib/supabase/server";
import type { ArticleWithAuthor } from "@/lib/queries/articles";

// Récupère tous les articles (brouillons + publiés) pour l'administration
export const getAllArticles = async (): Promise<ArticleWithAuthor[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, author:user_profiles(username, display_name, avatar_url)")
    .order("created_at", { ascending: false });
  return (data as ArticleWithAuthor[]) ?? [];
};

// Récupère un article par ID pour l'édition
export const getArticleById = async (
  id: string
): Promise<ArticleWithAuthor | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, author:user_profiles(username, display_name, avatar_url)")
    .eq("id", id)
    .single();
  return data as ArticleWithAuthor | null;
};

// Statistiques pour le dashboard admin
export const getDashboardStats = async () => {
  const supabase = await createClient();

  const [
    { count: articleCount },
    { count: publishedCount },
    { count: commentCount },
    { count: memberCount },
    { count: subscriberCount },
  ] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase
      .from("articles")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("comments").select("id", { count: "exact", head: true }),
    supabase
      .from("user_profiles")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .eq("is_confirmed", true),
  ]);

  return {
    articleCount: articleCount ?? 0,
    publishedCount: publishedCount ?? 0,
    commentCount: commentCount ?? 0,
    memberCount: memberCount ?? 0,
    subscriberCount: subscriberCount ?? 0,
  };
};
