import Link from "next/link";
import type { ForumTopicWithMeta } from "@/lib/queries/forum";

interface TopicRowProps {
  topic: ForumTopicWithMeta;
  categorySlug: string;
}

export const TopicRow = ({ topic, categorySlug }: TopicRowProps) => {
  const authorName =
    topic.author?.display_name ?? topic.author?.username ?? "Membre";
  const replies = Math.max(0, topic.post_count - 1);
  const lastActivity = new Date(topic.last_post_at).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "short", year: "numeric" }
  );

  return (
    <div className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-gray-900/40">
      {/* Icônes statut */}
      <div className="flex flex-shrink-0 flex-col items-center gap-1">
        {topic.is_pinned && (
          <svg
            className="h-4 w-4 text-[#E30613]"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-label="Épinglé"
          >
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
          </svg>
        )}
        {topic.is_locked && (
          <svg
            className="h-4 w-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-label="Verrouillé"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        )}
        {!topic.is_pinned && !topic.is_locked && (
          <svg
            className="h-4 w-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </div>

      {/* Titre + auteur */}
      <div className="min-w-0 flex-1">
        <Link
          href={`/forum/${categorySlug}/${topic.slug}`}
          className="block font-medium text-white transition-colors hover:text-[#E30613]"
        >
          {topic.title}
        </Link>
        <p className="mt-0.5 text-xs text-gray-500">
          par{" "}
          <span className="text-gray-400">{authorName}</span>
          {" · "}
          {new Date(topic.created_at).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="hidden flex-shrink-0 text-right sm:block">
        <p className="text-sm font-medium text-white">{replies}</p>
        <p className="text-xs text-gray-500">
          réponse{replies !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Dernière activité */}
      <div className="hidden flex-shrink-0 text-right lg:block">
        <p className="text-xs text-gray-400">{lastActivity}</p>
        <p className="text-xs text-gray-600">dernière activité</p>
      </div>
    </div>
  );
};
