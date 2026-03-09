"use client";

import { useRealtimePosts } from "@/hooks/use-realtime-posts";
import { ForumPost } from "@/components/ui/forum-post";
import { PostForm } from "@/components/ui/post-form";
import type { ForumPostWithAuthor } from "@/lib/queries/forum";

interface TopicDiscussionProps {
  topicId: string;
  topicSlug: string;
  categorySlug: string;
  isLocked: boolean;
  initialPosts: ForumPostWithAuthor[];
  currentUserId: string | null;
  currentUserRole: string | null;
}

export const TopicDiscussion = ({
  topicId,
  topicSlug,
  categorySlug,
  isLocked,
  initialPosts,
  currentUserId,
  currentUserRole,
}: TopicDiscussionProps) => {
  const { posts } = useRealtimePosts(topicId, initialPosts);

  return (
    <div>
      {/* Liste des posts */}
      <div className="mb-8 divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-gray-950">
        {posts.map((post, index) => (
          <ForumPost
            key={post.id}
            post={post}
            index={index}
            topicSlug={topicSlug}
            categorySlug={categorySlug}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
          />
        ))}
      </div>

      {/* Formulaire de réponse */}
      <PostForm
        topicId={topicId}
        topicSlug={topicSlug}
        categorySlug={categorySlug}
        isLocked={isLocked}
        currentUserId={currentUserId}
      />
    </div>
  );
};
