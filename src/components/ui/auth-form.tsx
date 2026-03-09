"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, signUp } from "@/lib/actions/auth";

interface AuthFormProps {
  mode: "connexion" | "inscription";
}

interface AuthState {
  error: string | null;
}

const initialState: AuthState = { error: null };

export const AuthForm = ({ mode }: AuthFormProps) => {
  const isSignUp = mode === "inscription";

  /* Wrapper pour adapter le retour des server actions au format useActionState */
  const handleAction = async (_prevState: AuthState, formData: FormData): Promise<AuthState> => {
    const action = isSignUp ? signUp : signIn;
    const result = await action(formData);

    if (result?.error) {
      return { error: result.error };
    }

    return { error: null };
  };

  const [state, formAction, isPending] = useActionState(handleAction, initialState);

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-white/10 bg-gray-900 p-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-white">
        {isSignUp ? "Créer un compte" : "Se connecter"}
      </h1>

      {/* Message d'erreur */}
      {state.error && (
        <div className="mb-4 rounded-md bg-red-500/10 p-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        {/* Champ nom d'utilisateur (inscription uniquement) */}
        {isSignUp && (
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-300">
              Nom d&apos;utilisateur
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-md border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
              placeholder="MonPseudo"
            />
          </div>
        )}

        {/* Champ email */}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-300">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-md border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
            placeholder="email@exemple.com"
          />
        </div>

        {/* Champ mot de passe */}
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-300">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete={isSignUp ? "new-password" : "current-password"}
            minLength={6}
            className="w-full rounded-md border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
            placeholder="••••••••"
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full rounded-md bg-[#E30613] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c00510] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Chargement..."
            : isSignUp
              ? "Créer mon compte"
              : "Se connecter"}
        </button>
      </form>

      {/* Lien vers l'autre mode */}
      <p className="mt-6 text-center text-sm text-gray-400">
        {isSignUp ? (
          <>
            Déjà un compte ?{" "}
            <Link href="/auth/connexion" className="font-medium text-[#E30613] hover:underline">
              Se connecter
            </Link>
          </>
        ) : (
          <>
            Pas encore de compte ?{" "}
            <Link href="/auth/inscription" className="font-medium text-[#E30613] hover:underline">
              Créer un compte
            </Link>
          </>
        )}
      </p>
    </div>
  );
};
