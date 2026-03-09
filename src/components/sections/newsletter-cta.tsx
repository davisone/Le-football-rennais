"use client";

import { useActionState } from "react";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

interface FormState {
  error: string | null;
  success: boolean;
}

const initialState: FormState = { error: null, success: false };

const NewsletterCtaForm = () => {
  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> =>
      subscribeToNewsletter(formData),
    initialState
  );

  if (state.success) {
    return (
      <p className="text-base font-medium text-white">
        ✓ Vérifie ta boîte mail pour confirmer !
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        name="email"
        required
        placeholder="ton@email.com"
        aria-label="Adresse email pour la newsletter"
        className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-gray-950 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-900 disabled:opacity-60"
      >
        {isPending ? "..." : "S'inscrire"}
      </button>
      {state.error && (
        <p className="w-full text-sm text-white/80">{state.error}</p>
      )}
    </form>
  );
};

export const NewsletterCta = () => {
  return (
    <section className="relative overflow-hidden bg-[#E30613] py-16">
      {/* Motif décoratif */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #000 0px, #000 1px, transparent 1px, transparent 30px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Rejoins la communaut&eacute; LFR
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
          Re&ccedil;ois les derni&egrave;res actus du SRFC directement dans ta
          bo&icirc;te mail
        </p>

        {/* Formulaire */}
        <div className="mx-auto mt-8 max-w-md">
          <NewsletterCtaForm />
        </div>

        <p className="mt-4 text-sm text-white/50">
          Pas de spam. D&eacute;sinscription en un clic.
        </p>
      </div>
    </section>
  );
};
