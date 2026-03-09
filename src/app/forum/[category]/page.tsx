import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategoryBySlug, getTopicsByCategory } from "@/lib/queries/forum";
import { TopicRow } from "@/components/ui/topic-row";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export const generateMetadata = async ({
  params,
}: CategoryPageProps): Promise<Metadata> => {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  return {
    title: category
      ? `${category.name} | Forum — Le Football Rennais`
      : "Catégorie introuvable | Forum",
    description: category?.description ?? undefined,
  };
};

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { category: slug } = await params;

  const [category, supabase] = await Promise.all([
    getCategoryBySlug(slug),
    createClient(),
  ]);

  if (!category) {
    notFound();
  }

  const [topics, { data: { user } }] = await Promise.all([
    getTopicsByCategory(category.id),
    supabase.auth.getUser(),
  ]);

  const pinnedTopics = topics.filter((t) => t.is_pinned);
  const regularTopics = topics.filter((t) => !t.is_pinned);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Fil d'Ariane */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/forum" className="transition-colors hover:text-gray-300">
          Forum
        </Link>
        <span>/</span>
        <span className="text-gray-300">{category.name}</span>
      </nav>

      {/* En-tête de la catégorie */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E30613]/10 text-2xl">
            {category.icon ?? "💬"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{category.name}</h1>
            {category.description && (
              <p className="text-sm text-gray-400">{category.description}</p>
            )}
          </div>
        </div>

        {user && (
          <Link
            href={`/forum/${category.slug}/nouveau`}
            className="flex-shrink-0 rounded-md bg-[#E30613] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c00510]"
          >
            + Nouveau sujet
          </Link>
        )}
      </div>

      {/* Stats de la catégorie */}
      <div className="mb-6 flex gap-6 text-sm text-gray-500">
        <span>
          <span className="font-medium text-gray-300">{category.topic_count}</span>{" "}
          sujet{category.topic_count !== 1 ? "s" : ""}
        </span>
        <span>
          <span className="font-medium text-gray-300">{category.post_count}</span>{" "}
          message{category.post_count !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Liste des topics */}
      {topics.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-gray-900 py-16 text-center">
          <p className="text-gray-400">Aucun sujet pour le moment.</p>
          {user ? (
            <Link
              href={`/forum/${category.slug}/nouveau`}
              className="mt-4 inline-block text-sm text-[#E30613] hover:underline"
            >
              Créer le premier sujet
            </Link>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              <Link
                href="/auth/connexion"
                className="text-[#E30613] hover:underline"
              >
                Connectez-vous
              </Link>{" "}
              pour créer un sujet.
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          {/* En-tête du tableau */}
          <div className="hidden border-b border-white/10 bg-gray-900 px-4 py-2 sm:flex">
            <div className="flex-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              Sujet
            </div>
            <div className="w-24 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
              Réponses
            </div>
            <div className="hidden w-36 text-right text-xs font-medium uppercase tracking-wide text-gray-500 lg:block">
              Activité
            </div>
          </div>

          {/* Topics épinglés */}
          {pinnedTopics.length > 0 && (
            <div className="divide-y divide-white/5 border-b border-white/10 bg-[#E30613]/5">
              {pinnedTopics.map((topic) => (
                <TopicRow
                  key={topic.id}
                  topic={topic}
                  categorySlug={category.slug}
                />
              ))}
            </div>
          )}

          {/* Topics normaux */}
          <div className="divide-y divide-white/5 bg-gray-950">
            {regularTopics.map((topic) => (
              <TopicRow
                key={topic.id}
                topic={topic}
                categorySlug={category.slug}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
