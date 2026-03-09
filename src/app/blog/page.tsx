import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/queries/articles";
import { ArticleCard } from "@/components/ui/article-card";

export const metadata: Metadata = {
  title: "Blog | Le Football Rennais",
  description:
    "Retrouvez toutes les analyses, actualités et articles sur le Stade Rennais FC.",
};

const BlogPage = async () => {
  const articles = await getPublishedArticles();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Titre de la page */}
      <h1 className="mb-10 text-3xl font-extrabold text-white sm:text-4xl">
        Blog
      </h1>

      {articles.length === 0 ? (
        // État vide
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-white/10 bg-gray-900 py-20 text-center">
          <svg
            className="h-16 w-16 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <p className="text-lg text-gray-400">
            Aucun article pour le moment.
          </p>
          <p className="text-sm text-gray-500">
            Revenez bientôt pour découvrir nos analyses et actualités !
          </p>
        </div>
      ) : (
        // Grille d'articles
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt}
              coverImageUrl={article.cover_image_url}
              author={article.author}
              publishedAt={article.published_at}
              category={article.category}
              tags={article.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
