import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

const BASE_URL = "https://lefootballrennais.fr";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const supabase = await createClient();

  const [{ data: articles }, { data: topics }, { data: categories }] =
    await Promise.all([
      supabase
        .from("articles")
        .select("slug, published_at")
        .eq("status", "published"),
      supabase
        .from("forum_topics")
        .select("slug, last_post_at, category:forum_categories(slug)"),
      supabase.from("forum_categories").select("slug"),
    ]);

  const articleUrls: MetadataRoute.Sitemap = (articles ?? []).map(
    (article) => ({
      url: `${BASE_URL}/blog/${article.slug}`,
      lastModified: article.published_at ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  const categoryUrls: MetadataRoute.Sitemap = (categories ?? []).map(
    (category) => ({
      url: `${BASE_URL}/forum/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    })
  );

  const topicUrls: MetadataRoute.Sitemap = (topics ?? []).map((topic) => {
    const cat = topic.category as { slug: string } | null;
    return {
      url: `${BASE_URL}/forum/${cat?.slug ?? ""}/${topic.slug}`,
      lastModified: topic.last_post_at ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.4,
    };
  });

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/videos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/forum`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
    ...articleUrls,
    ...categoryUrls,
    ...topicUrls,
  ];
};

export default sitemap;
