const TIKTOK_PROFILE_URL = process.env.NEXT_PUBLIC_TIKTOK_PROFILE_URL ?? "";

export const TikTokSection = () => {
  if (!TIKTOK_PROFILE_URL) {
    return (
      <div className="rounded-xl border border-white/10 bg-gray-900 px-6 py-12 text-center">
        <p className="text-gray-400">TikTok non configuré.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-white/10 bg-gray-900 px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black">
        <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">Retrouvez-nous sur TikTok</h3>
        <p className="mt-1 text-sm text-gray-400">
          Réactions, résumés et coulisses du Stade Rennais.
        </p>
      </div>
      <a
        href={TIKTOK_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
      >
        Voir le profil TikTok
      </a>
    </div>
  );
};
