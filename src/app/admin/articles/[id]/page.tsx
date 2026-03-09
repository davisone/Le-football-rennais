import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/queries/admin";
import { updateArticle } from "@/lib/actions/articles";
import { ArticleEditor } from "@/components/admin/article-editor";

type EditArticlePageProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({
  params,
}: EditArticlePageProps): Promise<Metadata> => {
  const { id } = await params;
  const article = await getArticleById(id);
  return {
    title: article
      ? `Éditer : ${article.title} | Admin`
      : "Article introuvable | Admin",
  };
};

const EditArticlePage = async ({ params }: EditArticlePageProps) => {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  const action = updateArticle.bind(null, id);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Éditer l&apos;article</h1>
      <ArticleEditor initialData={article} action={action} />
    </div>
  );
};

export default EditArticlePage;
