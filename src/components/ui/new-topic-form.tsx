"use client";

import { useActionState } from "react";
import { createTopic } from "@/lib/actions/forum";

interface NewTopicFormProps {
  categorySlug: string;
}

interface FormState {
  error: string | null;
}

const initialState: FormState = { error: null };

export const NewTopicForm = ({ categorySlug }: NewTopicFormProps) => {
  const handleAction = async (
    _prevState: FormState,
    formData: FormData
  ): Promise<FormState> => {
    const result = await createTopic(categorySlug, formData);
    if (result && "error" in result) return { error: result.error };
    return { error: null };
  };

  const [state, formAction, isPending] = useActionState(
    handleAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      {/* Titre */}
      <div>
        <label
          htmlFor="topic-title"
          className="mb-1.5 block text-sm font-medium text-gray-300"
        >
          Titre du sujet <span className="text-red-400">*</span>
        </label>
        <input
          id="topic-title"
          type="text"
          name="title"
          required
          maxLength={200}
          placeholder="Quel est le sujet de votre discussion ?"
          className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
        />
      </div>

      {/* Contenu du premier post */}
      <div>
        <label
          htmlFor="topic-content"
          className="mb-1.5 block text-sm font-medium text-gray-300"
        >
          Votre message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="topic-content"
          name="content"
          required
          rows={8}
          maxLength={10000}
          placeholder="Développez votre sujet..."
          className="w-full resize-y rounded-lg border border-white/10 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
        />
      </div>

      {/* Boutons */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-[#E30613] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c00510] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Publication..." : "Publier le sujet"}
        </button>
        <a
          href={`/forum/${categorySlug}`}
          className="text-sm text-gray-500 hover:text-gray-300"
        >
          Annuler
        </a>
      </div>
    </form>
  );
};
