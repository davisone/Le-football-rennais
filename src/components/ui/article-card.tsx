import Link from "next/link";
import Image from "next/image";

type ArticleCardProps = {
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  author: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  publishedAt: string | null;
  category: string | null;
  tags: string[];
};

// Carte d'aperçu d'un article pour la grille du blog
export const ArticleCard = ({
  title,
  slug,
  excerpt,
  coverImageUrl,
  author,
  publishedAt,
  category,
  tags,
}: ArticleCardProps) => {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const authorName = author?.display_name ?? author?.username ?? "Rédaction";

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:border-[#E30613]/40 hover:shadow-lg hover:shadow-[#E30613]/5"
    >
      {/* Image de couverture */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-800">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-12 w-12 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Contenu de la carte */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Catégorie */}
        {category && (
          <span className="w-fit rounded-full bg-[#E30613]/10 px-3 py-1 text-xs font-semibold text-[#E30613]">
            {category}
          </span>
        )}

        {/* Titre */}
        <h3 className="text-lg font-bold leading-tight text-white transition-colors group-hover:text-[#E30613]">
          {title}
        </h3>

        {/* Extrait */}
        {excerpt && (
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">
            {excerpt}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Métadonnées (auteur + date) */}
        <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-gray-500">
          {author?.avatar_url ? (
            <Image
              src={author.avatar_url}
              alt={authorName}
              width={20}
              height={20}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-[10px] font-bold text-gray-300">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <span>{authorName}</span>
          {formattedDate && (
            <>
              <span className="text-gray-600">·</span>
              <time dateTime={publishedAt ?? undefined}>{formattedDate}</time>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};
