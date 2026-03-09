import Link from "next/link";

/* Données de démonstration — seront remplacées par l'API YouTube */
const mockVideos = [
  {
    id: 1,
    title: "SRFC 2-1 OL | Le débrief complet",
    date: "7 mars 2026",
    duration: "12:34",
    slug: "srfc-2-1-ol-debrief",
  },
  {
    id: 2,
    title: "VLOG | Dans les coulisses du Roazhon Park",
    date: "4 mars 2026",
    duration: "18:22",
    slug: "vlog-coulisses-roazhon-park",
  },
  {
    id: 3,
    title: "Analyse : pourquoi Rennes va s'en sortir",
    date: "1 mars 2026",
    duration: "15:47",
    slug: "analyse-rennes-va-sen-sortir",
  },
  {
    id: 4,
    title: "Top 10 des buts SRFC cette saison",
    date: "26 février 2026",
    duration: "8:55",
    slug: "top-10-buts-srfc-saison",
  },
];

export const LatestVideos = () => {
  return (
    <section className="bg-gray-950 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Derni&egrave;res vid&eacute;os
            </h2>
            <p className="mt-2 text-gray-400">
              Vlogs, d&eacute;briefs et analyses en vid&eacute;o
            </p>
          </div>
          <Link
            href="/videos"
            className="hidden items-center gap-1 text-sm font-medium text-[#E30613] transition-colors hover:text-[#ff2a36] sm:inline-flex"
          >
            Voir toutes les vid&eacute;os
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        {/* Grille de vidéos */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockVideos.map((video) => (
            <article
              key={video.id}
              className="group overflow-hidden rounded-xl border border-white/5 bg-gray-900 transition-all hover:border-[#E30613]/30"
            >
              {/* Miniature placeholder */}
              <div className="relative aspect-video w-full bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="flex h-full items-center justify-center text-gray-600">
                  {/* Icône play */}
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#E30613]/80 text-white transition-transform group-hover:scale-110">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="ml-0.5 size-5"
                    >
                      <path d="M8 5.14v14l11-7-11-7z" />
                    </svg>
                  </div>
                </div>
                {/* Durée */}
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                  {video.duration}
                </span>
              </div>

              {/* Contenu */}
              <div className="p-4">
                <h3 className="line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-[#E30613]">
                  <Link href={`/videos/${video.slug}`}>
                    {video.title}
                  </Link>
                </h3>
                <time className="mt-2 block text-xs text-gray-500">
                  {video.date}
                </time>
              </div>
            </article>
          ))}
        </div>

        {/* Lien mobile */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/videos"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#E30613] transition-colors hover:text-[#ff2a36]"
          >
            Voir toutes les vid&eacute;os
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
