"use client";

import { useActionState, useRef } from "react";
import { createComment } from "@/lib/actions/comments";

interface CommentFormProps {
  articleId: string;
}

interface CommentFormState {
  error: string | null;
}

const initialState: CommentFormState = { error: null };

export const CommentForm = ({ articleId }: CommentFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (
    _prevState: CommentFormState,
    formData: FormData
  ): Promise<CommentFormState> => {
    const result = await createComment(formData);

    if (result?.error) {
      return { error: result.error };
    }

    // Réinitialiser le formulaire après succès
    formRef.current?.reset();
    return { error: null };
  };

  const [state, formAction, isPending] = useActionState(
    handleAction,
    initialState
  );

  return (
    <form ref={formRef} action={formAction} className="mb-8">
      <input type="hidden" name="article_id" value={articleId} />

      <label htmlFor="comment-content" className="mb-2 block text-sm font-medium text-gray-300">
        Votre commentaire
      </label>

      <textarea
        id="comment-content"
        name="content"
        required
        rows={4}
        maxLength={2000}
        placeholder="Partagez votre avis..."
        className="mb-3 w-full resize-y rounded-lg border border-white/10 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
      />

      {/* Message d'erreur */}
      {state.error && (
        <div className="mb-3 rounded-md bg-red-500/10 p-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-[#E30613] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c00510] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Publication..." : "Publier le commentaire"}
      </button>
    </form>
  );
};
