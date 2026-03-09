"use client";

import { useActionState } from "react";
import { sendNewsletter } from "@/lib/actions/newsletter";

interface FormState {
  error: string | null;
  sent: number;
}

const initialState: FormState = { error: null, sent: 0 };

export const SendNewsletterForm = () => {
  const handleAction = async (
    _prev: FormState,
    formData: FormData
  ): Promise<FormState> => {
    return sendNewsletter(formData);
  };

  const [state, formAction, isPending] = useActionState(handleAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}
      {state.sent > 0 && (
        <div className="rounded-md bg-green-500/10 px-4 py-3 text-sm text-green-400">
          ✓ Email envoyé à {state.sent} abonné{state.sent !== 1 ? "s" : ""}.
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm text-gray-400" htmlFor="subject">
          Sujet
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#E30613]"
          placeholder="Objet de l'email"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-400" htmlFor="content">
          Contenu (HTML)
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={10}
          className="w-full resize-y rounded-lg border border-white/10 bg-gray-800 px-4 py-3 font-mono text-sm text-white placeholder-gray-500 outline-none focus:border-[#E30613]"
          placeholder="<p>Votre message...</p>"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-[#E30613] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c00510] disabled:opacity-50"
      >
        {isPending ? "Envoi en cours..." : "Envoyer à tous les abonnés"}
      </button>
    </form>
  );
};
