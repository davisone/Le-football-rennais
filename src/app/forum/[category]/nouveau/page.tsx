import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategoryBySlug } from "@/lib/queries/forum";
import { NewTopicForm } from "@/components/ui/new-topic-form";

type NewTopicPageProps = {
  params: Promise<{ category: string }>;
};

export const generateMetadata = async ({
  params,
}: NewTopicPageProps): Promise<Metadata> => {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  return {
    title: category
      ? `Nouveau sujet — ${category.name} | Le Football Rennais`
      : "Nouveau sujet | Forum",
  };
};

const NewTopicPage = async ({ params }: NewTopicPageProps) => {
  const { category: slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/connexion");
  }

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Fil d'Ariane */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/forum" className="transition-colors hover:text-gray-300">
          Forum
        </Link>
        <span>/</span>
        <Link
          href={`/forum/${category.slug}`}
          className="transition-colors hover:text-gray-300"
        >
          {category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-300">Nouveau sujet</span>
      </nav>

      <h1 className="mb-8 text-2xl font-bold text-white">
        Créer un nouveau sujet
      </h1>

      <NewTopicForm categorySlug={category.slug} />
    </div>
  );
};

export default NewTopicPage;
