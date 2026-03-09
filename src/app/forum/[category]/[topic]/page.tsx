import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTopicBySlug, getPostsByTopic } from "@/lib/queries/forum";
import { TopicDiscussion } from "@/components/ui/topic-discussion";

type TopicPageProps = {
  params: Promise<{ category: string; topic: string }>;
};

export const generateMetadata = async ({
  params,
}: TopicPageProps): Promise<Metadata> => {
  const { topic: slug } = await params;
  const topic = await getTopicBySlug(slug);
  return {
    title: topic
      ? `${topic.title} | Forum — Le Football Rennais`
      : "Sujet introuvable | Forum",
  };
};

const TopicPage = async ({ params }: TopicPageProps) => {
  const { category: categorySlug, topic: topicSlug } = await params;

  const supabase = await createClient();
  const [topic, { data: { user } }] = await Promise.all([
    getTopicBySlug(topicSlug),
    supabase.auth.getUser(),
  ]);

  if (!topic) {
    notFound();
  }

  // Récupérer le rôle de l'utilisateur connecté
  let currentUserRole: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single<{ role: string }>();
    currentUserRole = profile?.role ?? null;
  }

  const posts = await getPostsByTopic(topic.id);

  const authorName =
    topic.author?.display_name ?? topic.author?.username ?? "Membre";
  const createdAt = new Date(topic.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Fil d'Ariane */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/forum" className="transition-colors hover:text-gray-300">
          Forum
        </Link>
        <span>/</span>
        <Link
          href={`/forum/${categorySlug}`}
          className="transition-colors hover:text-gray-300"
        >
          {topic.category?.name ?? categorySlug}
        </Link>
        <span>/</span>
        <span className="truncate text-gray-300">{topic.title}</span>
      </nav>

      {/* En-tête du topic */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {topic.is_pinned && (
            <span className="inline-flex items-center gap-1 rounded bg-[#E30613]/10 px-2 py-0.5 text-xs font-medium text-[#E30613]">
              <svg
                className="h-3 w-3"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
              Épinglé
            </span>
          )}
          {topic.is_locked && (
            <span className="inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-400">
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Verrouillé
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          {topic.title}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Par{" "}
          <span className="font-medium text-gray-400">{authorName}</span>
          {" · "}
          {createdAt}
          {" · "}
          <span>
            {Math.max(0, topic.post_count - 1)} réponse
            {topic.post_count - 1 !== 1 ? "s" : ""}
          </span>
          {" · "}
          <span>{topic.view_count} vue{topic.view_count !== 1 ? "s" : ""}</span>
        </p>
      </div>

      {/* Discussion (posts + formulaire réponse) avec Realtime */}
      <TopicDiscussion
        topicId={topic.id}
        topicSlug={topicSlug}
        categorySlug={categorySlug}
        isLocked={topic.is_locked}
        initialPosts={posts}
        currentUserId={user?.id ?? null}
        currentUserRole={currentUserRole}
      />
    </div>
  );
};

export default TopicPage;
