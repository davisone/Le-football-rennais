import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardStats } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Dashboard Admin | Le Football Rennais",
};

const statCards = (
  stats: Awaited<ReturnType<typeof getDashboardStats>>
) => [
  {
    label: "Articles total",
    value: stats.articleCount,
    sub: `${stats.publishedCount} publiés`,
    href: "/admin/articles",
    color: "text-blue-400",
  },
  {
    label: "Commentaires",
    value: stats.commentCount,
    sub: "sur tous les articles",
    href: null,
    color: "text-green-400",
  },
  {
    label: "Membres inscrits",
    value: stats.memberCount,
    sub: "comptes actifs",
    href: "/admin/membres",
    color: "text-purple-400",
  },
  {
    label: "Abonnés newsletter",
    value: stats.subscriberCount,
    sub: "confirmés",
    href: "/admin/newsletter",
    color: "text-[#E30613]",
  },
];

const AdminPage = async () => {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <Link
          href="/admin/articles/nouveau"
          className="rounded-md bg-[#E30613] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c00510]"
        >
          + Nouvel article
        </Link>
      </div>

      {/* Statistiques */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards(stats).map((card) => {
          const inner = (
            <div className="rounded-xl border border-white/10 bg-gray-900 p-6 transition-colors hover:border-white/20">
              <p className="mb-1 text-sm text-gray-400">{card.label}</p>
              <p className={`text-4xl font-bold ${card.color}`}>
                {card.value}
              </p>
              <p className="mt-1 text-xs text-gray-500">{card.sub}</p>
            </div>
          );

          return card.href ? (
            <Link key={card.label} href={card.href}>
              {inner}
            </Link>
          ) : (
            <div key={card.label}>{inner}</div>
          );
        })}
      </div>

      {/* Liens rapides */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/admin/articles/nouveau"
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-gray-900 p-4 transition-colors hover:border-[#E30613]/40 hover:bg-gray-800"
          >
            <svg
              className="h-6 w-6 text-[#E30613]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <div>
              <p className="font-medium text-white">Écrire un article</p>
              <p className="text-sm text-gray-400">
                Créer un nouvel article de blog
              </p>
            </div>
          </Link>
          <Link
            href="/admin/articles"
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-gray-900 p-4 transition-colors hover:border-white/20 hover:bg-gray-800"
          >
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <div>
              <p className="font-medium text-white">Gérer les articles</p>
              <p className="text-sm text-gray-400">
                Voir, éditer, publier ou supprimer
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
