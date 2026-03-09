import Image from "next/image";
import Link from "next/link";
import { getCommentsByArticleId } from "@/lib/queries/comments";
import { CommentForm } from "@/components/ui/comment-form";
import { DeleteCommentButton } from "@/components/ui/delete-comment-button";

interface CommentSectionProps {
  articleId: string;
  currentUserId: string | null;
  currentUserRole: string | null;
}

export const CommentSection = async ({
  articleId,
  currentUserId,
  currentUserRole,
}: CommentSectionProps) => {
  const comments = await getCommentsByArticleId(articleId);

  // Vérifie si l'utilisateur peut supprimer un commentaire donné
  const canDelete = (commentAuthorId: string) => {
    if (!currentUserId) return false;
    if (commentAuthorId === currentUserId) return true;
    if (currentUserRole === "admin" || currentUserRole === "moderator") return true;
    return false;
  };

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-white">
        Commentaires{" "}
        {comments.length > 0 && (
          <span className="text-lg font-normal text-gray-500">
            ({comments.length})
          </span>
        )}
      </h2>

      {/* Formulaire ou invitation à se connecter */}
      {currentUserId ? (
        <CommentForm articleId={articleId} />
      ) : (
        <div className="mb-8 rounded-lg border border-white/10 bg-gray-900 p-6 text-center">
          <p className="text-gray-400">
            <Link
              href="/auth/connexion"
              className="font-medium text-[#E30613] hover:underline"
            >
              Connectez-vous
            </Link>{" "}
            pour laisser un commentaire.
          </p>
        </div>
      )}

      {/* Liste des commentaires */}
      {comments.length === 0 ? (
        <p className="text-gray-500">
          Aucun commentaire pour le moment. Soyez le premier à réagir !
        </p>
      ) : (
        <div className="space-y-0 divide-y divide-white/10">
          {comments.map((comment) => {
            const authorName =
              comment.author?.display_name ??
              comment.author?.username ??
              "Utilisateur";
            const initial = authorName.charAt(0).toUpperCase();
            const formattedDate = new Date(comment.created_at).toLocaleDateString(
              "fr-FR",
              { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }
            );

            return (
              <div key={comment.id} className="py-5 first:pt-0">
                <div className="flex gap-3">
                  {/* Avatar */}
                  {comment.author?.avatar_url ? (
                    <Image
                      src={comment.author.avatar_url}
                      alt={authorName}
                      width={36}
                      height={36}
                      className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#E30613]/20 text-sm font-bold text-[#E30613]">
                      {initial}
                    </div>
                  )}

                  {/* Contenu du commentaire */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {authorName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formattedDate}
                      </span>
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
                      {comment.content}
                    </p>

                    {/* Bouton supprimer */}
                    {canDelete(comment.author_id) && (
                      <DeleteCommentButton commentId={comment.id} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
