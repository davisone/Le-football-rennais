import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/queries/admin";
import { DeleteArticleButton } from "@/components/admin/delete-article-button";

export const metadata: Metadata = {
  title: "Articles | Admin — Le Football Rennais",
};

const AdminArticlesPage = async () => {
  const articles = await getAllArticles();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Articles{" "}
          <span className="text-lg font-normal text-gray-500">
            ({articles.length})
          </span>
        </h1>
        <Link
          href="/admin/articles/nouveau"
          className="rounded-md bg-[#E30613] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c00510]"
        >
          + Nouvel article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-gray-900 py-16 text-center">
          <p className="text-gray-400">Aucun article pour le moment.</p>
          <Link
            href="/admin/articles/nouveau"
            className="mt-4 inline-block text-sm text-[#E30613] hover:underline"
          >
            Écrire le premier article
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-400">
                  Titre
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-gray-400 sm:table-cell">
                  Statut
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-gray-400 md:table-cell">
                  Catégorie
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-gray-400 lg:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-gray-950">
              {articles.map((article) => (
                <tr key={article.id} className="transition-colors hover:bg-gray-900/50">
                  <td className="px-4 py-4">
                    <p className="font-medium text-white">{article.title}</p>
                    <p className="mt-0.5 font-mono text-xs text-gray-500">
                      /{article.slug}
                    </p>
                  </td>
                  <td className="hidden px-4 py-4 sm:table-cell">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        article.status === "published"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {article.status === "published" ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="hidden px-4 py-4 text-gray-400 md:table-cell">
                    {article.category ?? "—"}
                  </td>
                  <td className="hidden px-4 py-4 text-gray-500 lg:table-cell">
                    {new Date(article.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-4">
                      {article.status === "published" && (
                        <Link
                          href={`/blog/${article.slug}`}
                          target="_blank"
                          className="text-gray-500 transition-colors hover:text-gray-300"
                        >
                          Voir
                        </Link>
                      )}
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="font-medium text-[#E30613] transition-colors hover:text-[#c00510]"
                      >
                        Éditer
                      </Link>
                      <DeleteArticleButton id={article.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminArticlesPage;
