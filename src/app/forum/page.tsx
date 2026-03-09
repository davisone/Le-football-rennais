import type { Metadata } from "next";
import { getForumCategories } from "@/lib/queries/forum";
import { CategoryCard } from "@/components/ui/category-card";

export const metadata: Metadata = {
  title: "Forum | Le Football Rennais",
  description:
    "Rejoignez la communauté Rouge et Noir. Discutez des matchs, transferts et de tout ce qui touche au Stade Rennais FC.",
};

const ForumPage = async () => {
  const categories = await getForumCategories();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* En-tête */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          Forum
        </h1>
        <p className="mt-2 text-gray-400">
          La communauté Rouge et Noir — échangez, débattez, réagissez.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-gray-900 py-16 text-center">
          <p className="text-gray-400">
            Le forum n&apos;est pas encore ouvert. Revenez bientôt !
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumPage;
