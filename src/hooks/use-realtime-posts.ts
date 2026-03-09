"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { ForumPostWithAuthor } from "@/lib/queries/forum";

export const useRealtimePosts = (
  topicId: string,
  initialPosts: ForumPostWithAuthor[]
) => {
  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`topic-${topicId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "forum_posts",
          filter: `topic_id=eq.${topicId}`,
        },
        async (payload) => {
          // Récupérer le post complet avec l'auteur
          const { data } = await supabase
            .from("forum_posts")
            .select(
              "*, author:user_profiles(username, display_name, avatar_url, role)"
            )
            .eq("id", (payload.new as { id: string }).id)
            .single();

          if (data) {
            setPosts((prev) => {
              // Éviter les doublons
              const exists = prev.some((p) => p.id === data.id);
              if (exists) return prev;
              return [...prev, data as ForumPostWithAuthor];
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "forum_posts",
          filter: `topic_id=eq.${topicId}`,
        },
        (payload) => {
          setPosts((prev) =>
            prev.filter((p) => p.id !== (payload.old as { id: string }).id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [topicId]);

  return { posts, setPosts };
};
