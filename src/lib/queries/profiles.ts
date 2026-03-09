import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type UserProfile = Tables<"user_profiles">;

export type UserBadgeWithBadge = Tables<"user_badges"> & {
  badge: Tables<"badges">;
};

export type RecentPostWithTopic = Tables<"forum_posts"> & {
  topic: { title: string; slug: string; category: { slug: string } | null } | null;
};

export const getProfileByUsername = async (
  username: string
): Promise<UserProfile | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("username", username)
    .single();
  return data;
};

export const getUserBadges = async (
  userId: string
): Promise<UserBadgeWithBadge[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_badges")
    .select("*, badge:badges(*)")
    .eq("user_id", userId)
    .order("awarded_at", { ascending: false });
  return (data as UserBadgeWithBadge[]) ?? [];
};

export const getRecentPostsByUser = async (
  userId: string,
  limit = 5
): Promise<RecentPostWithTopic[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_posts")
    .select(
      "*, topic:forum_topics(title, slug, category:forum_categories(slug))"
    )
    .eq("author_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as RecentPostWithTopic[]) ?? [];
};

export const getAllMembers = async (): Promise<UserProfile[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
};

export const getAllBadges = async (): Promise<Tables<"badges">[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("badges")
    .select("*")
    .order("created_at", { ascending: true });
  return data ?? [];
};
