"use client";

import { useActionState, useState } from "react";
import { updateProfile } from "@/lib/actions/profiles";

interface ProfileEditFormProps {
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

interface FormState {
  error: string | null;
  success: boolean;
}

const initialState: FormState = { error: null, success: false };

export const ProfileEditForm = ({
  displayName,
  bio,
  avatarUrl,
}: ProfileEditFormProps) => {
  const [open, setOpen] = useState(false);

  const handleAction = async (
    _prev: FormState,
    formData: FormData
  ): Promise<FormState> => {
    const result = await updateProfile(formData);
    if (result.error) return { error: result.error, success: false };
    setOpen(false);
    return { error: null, success: true };
  };

  const [state, formAction, isPending] = useActionState(handleAction, initialState);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border border-white/10 px-4 py-2 text-sm text-gray-400 transition-colors hover:border-white/20 hover:text-white"
      >
        Modifier le profil
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-white/10 bg-gray-900 p-5">
      <h3 className="font-semibold text-white">Modifier le profil</h3>

      {state.error && (
        <p className="rounded bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm text-gray-400" htmlFor="display_name">
          Nom affiché
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          defaultValue={displayName ?? ""}
          maxLength={50}
          className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#E30613]"
          placeholder="Votre nom affiché"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-400" htmlFor="avatar_url">
          URL de l&apos;avatar
        </label>
        <input
          id="avatar_url"
          name="avatar_url"
          type="url"
          defaultValue={avatarUrl ?? ""}
          className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#E30613]"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-400" htmlFor="bio">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          maxLength={300}
          defaultValue={bio ?? ""}
          className="w-full resize-none rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#E30613]"
          placeholder="Une courte présentation..."
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-[#E30613] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c00510] disabled:opacity-50"
        >
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-gray-500 hover:text-gray-300"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};
