import Link from "next/link";
import type { ForumCategory } from "@/lib/queries/forum";

interface CategoryCardProps {
  category: ForumCategory;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link
      href={`/forum/${category.slug}`}
      className="group flex items-start gap-4 rounded-xl border border-white/10 bg-gray-900 p-5 transition-colors hover:border-[#E30613]/30 hover:bg-gray-800/80"
    >
      {/* Icône */}
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#E30613]/10 text-2xl">
        {category.icon ?? "💬"}
      </div>

      {/* Contenu */}
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold text-white transition-colors group-hover:text-[#E30613]">
          {category.name}
        </h2>
        {category.description && (
          <p className="mt-0.5 text-sm text-gray-400">{category.description}</p>
        )}

        {/* Compteurs */}
        <div className="mt-3 flex gap-4 text-xs text-gray-500">
          <span>
            <span className="font-medium text-gray-300">{category.topic_count}</span>{" "}
            sujet{category.topic_count !== 1 ? "s" : ""}
          </span>
          <span>
            <span className="font-medium text-gray-300">{category.post_count}</span>{" "}
            message{category.post_count !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Flèche */}
      <svg
        className="mt-1 h-5 w-5 flex-shrink-0 text-gray-600 transition-colors group-hover:text-[#E30613]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
};
