import type { Metadata } from "next";
import { createArticle } from "@/lib/actions/articles";
import { ArticleEditor } from "@/components/admin/article-editor";

export const metadata: Metadata = {
  title: "Nouvel article | Admin — Le Football Rennais",
};

const NouvelArticlePage = () => {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Nouvel article</h1>
      <ArticleEditor action={createArticle} />
    </div>
  );
};

export default NouvelArticlePage;
