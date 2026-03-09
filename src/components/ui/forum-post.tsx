"use client";

import Image from "next/image";
import { useTransition } from "react";
import { deletePost } from "@/lib/actions/forum";
import type { ForumPostWithAuthor } from "@/lib/queries/forum";

interface ForumPostProps {
  post: ForumPostWithAuthor;
  index: number;
  topicSlug: string;
  categorySlug: string;
  currentUserId: string | null;
  currentUserRole: string | null;
}

export const ForumPost = ({
  post,
  index,
  topicSlug,
  categorySlug,
  currentUserId,
  currentUserRole,
}: ForumPostProps) => {
  const [isPending, startTransition] = useTransition();

  const authorName =
    post.author?.display_name ?? post.author?.username ?? "Membre";
  const initial = authorName.charAt(0).toUpperCase();
  const canDelete =
    currentUserId === post.author_id ||
    currentUserRole === "admin" ||
    currentUserRole === "moderator";

  const formattedDate = new Date(post.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDelete = () => {
    if (!confirm("Supprimer ce message ?")) return;
    startTransition(async () => {
      await deletePost(post.id, topicSlug, categorySlug);
    });
  };

  return (
    <div
      id={`post-${post.id}`}
      className={`flex gap-4 p-5 ${index > 0 ? "border-t border-white/10" : ""} ${
        isPending ? "opacity-50" : ""
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {post.author?.avatar_url ? (
          <Image
            src={post.author.avatar_url}
            alt={authorName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E30613]/20 text-sm font-bold text-[#E30613]">
            {initial}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="min-w-0 flex-1">
        {/* En-tête */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="font-semibold text-white">{authorName}</span>
          {post.author?.role && post.author.role !== "member" && (
            <span
              className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                post.author.role === "admin"
                  ? "bg-[#E30613]/20 text-[#E30613]"
                  : "bg-blue-500/20 text-blue-400"
              }`}
            >
              {post.author.role === "admin" ? "Admin" : "Modérateur"}
            </span>
          )}
          <span className="text-xs text-gray-500">{formattedDate}</span>
          {index === 0 && (
            <span className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-gray-500">
              #OP
            </span>
          )}
        </div>

        {/* Message */}
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
          {post.content}
        </div>

        {/* Actions */}
        {canDelete && (
          <div className="mt-3">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="text-xs text-gray-600 transition-colors hover:text-red-400 disabled:opacity-50"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
