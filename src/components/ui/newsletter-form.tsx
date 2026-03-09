"use client";

import { useActionState } from "react";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

interface FormState {
  error: string | null;
  success: boolean;
}

const initialState: FormState = { error: null, success: false };

export const NewsletterForm = () => {
  const handleAction = async (
    _prev: FormState,
    formData: FormData
  ): Promise<FormState> => {
    return subscribeToNewsletter(formData);
  };

  const [state, formAction, isPending] = useActionState(handleAction, initialState);

  if (state.success) {
    return (
      <p className="text-sm text-green-400">
        ✓ Vérifie ta boîte mail pour confirmer ton inscription !
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        name="email"
        required
        placeholder="ton@email.fr"
        className="flex-1 rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#E30613]"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-[#E30613] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c00510] disabled:opacity-50"
      >
        {isPending ? "..." : "S'inscrire"}
      </button>
      {state.error && (
        <p className="w-full text-xs text-red-400">{state.error}</p>
      )}
    </form>
  );
};
