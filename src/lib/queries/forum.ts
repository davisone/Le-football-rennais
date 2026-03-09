import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type ForumCategory = Tables<"forum_categories">;

export type ForumTopicWithMeta = Tables<"forum_topics"> & {
  author: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

export type ForumTopicWithCategory = Tables<"forum_topics"> & {
  author: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  category: { name: string; slug: string } | null;
};

export type ForumPostWithAuthor = Tables<"forum_posts"> & {
  author: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    role: "member" | "moderator" | "admin";
  } | null;
};

// Toutes les catégories triées par position
export const getForumCategories = async (): Promise<ForumCategory[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_categories")
    .select("*")
    .order("position", { ascending: true });
  return data ?? [];
};

// Une catégorie par son slug
export const getCategoryBySlug = async (
  slug: string
): Promise<ForumCategory | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
};

// Topics d'une catégorie — épinglés en premier, puis par activité récente
export const getTopicsByCategory = async (
  categoryId: string
): Promise<ForumTopicWithMeta[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_topics")
    .select("*, author:user_profiles(username, display_name, avatar_url)")
    .eq("category_id", categoryId)
    .order("is_pinned", { ascending: false })
    .order("last_post_at", { ascending: false });
  return (data as ForumTopicWithMeta[]) ?? [];
};

// Un topic par son slug avec la catégorie parente
export const getTopicBySlug = async (
  slug: string
): Promise<ForumTopicWithCategory | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_topics")
    .select(
      "*, author:user_profiles(username, display_name, avatar_url), category:forum_categories(name, slug)"
    )
    .eq("slug", slug)
    .single();
  return data as ForumTopicWithCategory | null;
};

// Tous les topics pour la page de modération admin
export const getAllTopics = async (): Promise<ForumTopicWithCategory[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_topics")
    .select(
      "*, author:user_profiles(username, display_name, avatar_url), category:forum_categories(name, slug)"
    )
    .order("last_post_at", { ascending: false });
  return (data as ForumTopicWithCategory[]) ?? [];
};

// Posts d'un topic avec les infos auteur, triés par date
export const getPostsByTopic = async (
  topicId: string
): Promise<ForumPostWithAuthor[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_posts")
    .select(
      "*, author:user_profiles(username, display_name, avatar_url, role)"
    )
    .eq("topic_id", topicId)
    .order("created_at", { ascending: true });
  return (data as ForumPostWithAuthor[]) ?? [];
};
