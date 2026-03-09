import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/queries/articles";
import { CommentSection } from "@/components/ui/comment-section";
import { createClient } from "@/lib/supabase/server";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

// Génération dynamique des métadonnées
export const generateMetadata = async ({
  params,
}: ArticlePageProps): Promise<Metadata> => {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article introuvable | Le Football Rennais" };
  }

  return {
    title: `${article.title} | Le Football Rennais`,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.cover_image_url ? [article.cover_image_url] : undefined,
      type: "article",
      publishedTime: article.published_at ?? undefined,
    },
  };
};

const ArticlePage = async ({ params }: ArticlePageProps) => {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Récupérer l'utilisateur connecté pour les commentaires
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Récupérer le rôle de l'utilisateur si connecté
  let currentUserRole: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single<{ role: string }>();
    currentUserRole = profile?.role ?? null;
  }

  const author = article.author;
  const authorName = author?.display_name ?? author?.username ?? "Rédaction";

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Lien retour */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-[#E30613]"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Retour au blog
      </Link>

      {/* Image de couverture */}
      {article.cover_image_url && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={article.cover_image_url}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>
      )}

      {/* En-tête de l'article */}
      <header className="mb-10">
        {/* Catégorie */}
        {article.category && (
          <span className="mb-4 inline-block rounded-full bg-[#E30613]/10 px-3 py-1 text-sm font-semibold text-[#E30613]">
            {article.category}
          </span>
        )}

        {/* Titre */}
        <h1 className="mb-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        {/* Informations auteur et date */}
        <div className="flex items-center gap-3 text-sm text-gray-400">
          {author?.avatar_url ? (
            <Image
              src={author.avatar_url}
              alt={authorName}
              width={36}
              height={36}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-sm font-bold text-gray-300">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-white">{authorName}</p>
            {formattedDate && (
              <time
                dateTime={article.published_at ?? undefined}
                className="text-gray-500"
              >
                {formattedDate}
              </time>
            )}
          </div>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/5 px-3 py-1 text-xs text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Contenu de l'article — HTML sécurisé produit par TipTap (éditeur admin uniquement) */}
      <ArticleContent html={article.content} />

      {/* Séparateur */}
      <hr className="mb-10 border-white/10" />

      {/* Section commentaires */}
      <CommentSection
        articleId={article.id}
        currentUserId={user?.id ?? null}
        currentUserRole={currentUserRole}
      />
    </article>
  );
};

// Composant dédié au rendu du contenu HTML de l'article
// Le contenu provient exclusivement de l'éditeur TipTap côté admin (contenu de confiance)
const ArticleContent = ({ html }: { html: string }) => {
  return (
    <div
      className="prose-article mb-16 max-w-none text-gray-300 [&_a]:text-[#E30613] [&_a]:underline [&_a]:transition-colors hover:[&_a]:text-[#E30613]/80 [&_blockquote]:border-l-4 [&_blockquote]:border-[#E30613]/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-400 [&_code]:rounded [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_hr]:my-8 [&_hr]:border-white/10 [&_img]:mx-auto [&_img]:rounded-lg [&_li]:mb-1 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-6 [&_p]:text-lg [&_p]:leading-relaxed [&_pre]:mb-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-800 [&_pre]:p-4 [&_strong]:font-semibold [&_strong]:text-white [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default ArticlePage;
