"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import { updateProfile, deleteAccount } from "@/lib/actions/profiles";

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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleDelete = async () => {
    setDeleteError(null);
    const result = await deleteAccount();
    if (result?.error) setDeleteError(result.error);
  };

  if (!open) {
    return (
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md border border-white/10 px-4 py-2 text-sm text-gray-400 transition-colors hover:border-white/20 hover:text-white"
        >
          Modifier le profil
        </button>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="rounded-md border border-red-500/40 px-4 py-2 text-sm text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
          >
            Supprimer le compte
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-md border border-red-500/30 bg-red-500/5 px-4 py-2">
            <span className="text-sm text-red-400">Confirmer la suppression ?</span>
            <button
              onClick={handleDelete}
              className="text-sm font-semibold text-red-400 hover:text-red-300"
            >
              Oui, supprimer
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-sm text-gray-500 hover:text-gray-300"
            >
              Annuler
            </button>
          </div>
        )}
        {deleteError && (
          <p className="w-full text-sm text-red-400">{deleteError}</p>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5 rounded-xl border border-white/10 bg-gray-900 p-5">
      <h3 className="font-semibold text-white">Modifier le profil</h3>

      {state.error && (
        <p className="rounded bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      {/* Photo de profil */}
      <div>
        <label className="mb-2 block text-sm text-gray-400">Photo de profil</label>
        <div className="flex items-center gap-4">
          <div
            className="relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#E30613]/20 ring-2 ring-white/10 transition-opacity hover:opacity-80"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <Image src={preview} alt="Avatar" fill className="object-cover" unoptimized />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-7 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-[#E30613] hover:text-[#ff2a36]"
            >
              Changer la photo
            </button>
            <p className="mt-0.5 text-xs text-gray-600">JPG, PNG, WebP — max 2 Mo</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          name="avatar_file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <input type="hidden" name="avatar_url_current" value={avatarUrl ?? ""} />
      </div>

      {/* Nom affiché */}
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

      {/* Bio */}
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
