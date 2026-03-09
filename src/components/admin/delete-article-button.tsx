"use client";

import { useTransition } from "react";
import { deleteArticle } from "@/lib/actions/articles";

interface DeleteArticleButtonProps {
  id: string;
}

export const DeleteArticleButton = ({ id }: DeleteArticleButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Supprimer cet article définitivement ? Cette action est irréversible."))
      return;

    startTransition(async () => {
      await deleteArticle(id);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm text-red-400 transition-colors hover:text-red-300 disabled:opacity-50"
    >
      {isPending ? "Suppression..." : "Supprimer"}
    </button>
  );
};
