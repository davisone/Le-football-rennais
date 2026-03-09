"use client";

import { useTransition } from "react";
import { deleteComment } from "@/lib/actions/comments";

interface DeleteCommentButtonProps {
  commentId: string;
}

export const DeleteCommentButton = ({ commentId }: DeleteCommentButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Supprimer ce commentaire ?")) return;

    startTransition(async () => {
      await deleteComment(commentId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="mt-2 text-xs text-gray-500 transition-colors hover:text-red-400 disabled:opacity-50"
      aria-label="Supprimer le commentaire"
    >
      {isPending ? "Suppression..." : "Supprimer"}
    </button>
  );
};
