"use client";

import { useActionState, useRef } from "react";
import { createPost } from "@/lib/actions/forum";

interface PostFormProps {
  topicId: string;
  topicSlug: string;
  categorySlug: string;
  isLocked: boolean;
  currentUserId: string | null;
}

interface PostFormState {
  error: string | null;
}

const initialState: PostFormState = { error: null };

export const PostForm = ({
  topicId,
  topicSlug,
  categorySlug,
  isLocked,
  currentUserId,
}: PostFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (
    _prevState: PostFormState,
    formData: FormData
  ): Promise<PostFormState> => {
    const result = await createPost(
      topicId,
      topicSlug,
      categorySlug,
      formData
    );
    if (result.error) return { error: result.error };
    formRef.current?.reset();
    return { error: null };
  };

  const [state, formAction, isPending] = useActionState(
    handleAction,
    initialState
  );

  if (!currentUserId) {
    return (
      <div className="rounded-lg border border-white/10 bg-gray-900 p-6 text-center">
        <p className="text-gray-400">
          <a
            href="/auth/connexion"
            className="font-medium text-[#E30613] hover:underline"
          >
            Connectez-vous
          </a>{" "}
          pour répondre à ce sujet.
        </p>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="rounded-lg border border-white/10 bg-gray-900 p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="text-sm">Ce sujet est verrouillé.</span>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction}>
      <label
        htmlFor="post-content"
        className="mb-2 block text-sm font-medium text-gray-300"
      >
        Votre réponse
      </label>
      <textarea
        id="post-content"
        name="content"
        required
        rows={5}
        maxLength={10000}
        placeholder="Rédigez votre réponse..."
        className="mb-3 w-full resize-y rounded-lg border border-white/10 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
      />

      {state.error && (
        <div className="mb-3 rounded-md bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-[#E30613] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c00510] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Envoi..." : "Répondre"}
      </button>
    </form>
  );
};
