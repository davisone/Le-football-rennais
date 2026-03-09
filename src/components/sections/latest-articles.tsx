import Link from "next/link";

/* Données de démonstration — seront remplacées par Supabase */
const mockArticles = [
  {
    id: 1,
    title: "Analyse tactique : le nouveau 4-3-3 de Rennes",
    excerpt:
      "Retour sur le changement de système mis en place par le coach lors des derniers matchs et son impact sur le jeu rennais.",
    date: "8 mars 2026",
    slug: "analyse-tactique-nouveau-433",
  },
  {
    id: 2,
    title: "Mercato : les pistes pour cet hiver",
    excerpt:
      "Le point sur les rumeurs et les pistes explorées par la direction sportive du SRFC pour le mercato hivernal.",
    date: "5 mars 2026",
    slug: "mercato-pistes-hiver",
  },
  {
    id: 3,
    title: "Retour sur SRFC - OL : une victoire qui fait du bien",
    excerpt:
      "Débrief complet du match face à Lyon avec les moments clés, les notes des joueurs et les perspectives.",
    date: "2 mars 2026",
    slug: "debrief-srfc-ol",
  },
];

export const LatestArticles = () => {
  return (
    <section className="bg-gray-900 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Derniers articles
            </h2>
            <p className="mt-2 text-gray-400">
              Analyses, d&eacute;briefs et actus du SRFC
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-1 text-sm font-medium text-[#E30613] transition-colors hover:text-[#ff2a36] sm:inline-flex"
          >
            Voir tous les articles
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

        {/* Grille d'articles */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockArticles.map((article) => (
            <article
              key={article.id}
              className="group overflow-hidden rounded-xl border border-white/5 bg-gray-950 transition-all hover:border-[#E30613]/30"
            >
              {/* Image placeholder */}
              <div className="aspect-video w-full bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="flex h-full items-center justify-center text-gray-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="size-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-5">
                <time className="text-xs font-medium text-gray-500">
                  {article.date}
                </time>
                <h3 className="mt-2 text-lg font-semibold text-white transition-colors group-hover:text-[#E30613]">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-400">
                  {article.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Lien mobile */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#E30613] transition-colors hover:text-[#ff2a36]"
          >
            Voir tous les articles
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
