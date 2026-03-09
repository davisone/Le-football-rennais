"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { InsertTables, UpdateTables } from "@/types/database";

const generateSlug = (title: string): string =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

export const createArticle = async (
  formData: FormData
): Promise<{ error: string } | void> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Le titre est requis." };

  const slug = (formData.get("slug") as string)?.trim() || generateSlug(title);
  const content = formData.get("content") as string;
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const category = (formData.get("category") as string)?.trim() || null;
  const tagsRaw = (formData.get("tags") as string)?.trim();
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const status =
    (formData.get("status") as "draft" | "published") || "draft";
  const cover_image_url =
    (formData.get("cover_image_url") as string)?.trim() || null;

  const { data, error } = await supabase
    .from("articles")
    .insert({
      title,
      slug,
      content,
      excerpt,
      cover_image_url,
      author_id: user.id,
      category,
      tags,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    } as InsertTables<"articles">)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { error: "Ce slug est déjà utilisé." };
    return { error: "Impossible de créer l'article." };
  }

  revalidatePath("/blog");
  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${data.id}`);
};

export const updateArticle = async (
  id: string,
  formData: FormData
): Promise<{ error: string | null }> => {
  const supabase = await createClient();

  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Le titre est requis." };

  const slug = (formData.get("slug") as string)?.trim() || generateSlug(title);
  const content = formData.get("content") as string;
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const category = (formData.get("category") as string)?.trim() || null;
  const tagsRaw = (formData.get("tags") as string)?.trim();
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const status =
    (formData.get("status") as "draft" | "published") || "draft";
  const cover_image_url =
    (formData.get("cover_image_url") as string)?.trim() || null;

  const { data: current } = await supabase
    .from("articles")
    .select("published_at")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("articles")
    .update({
      title,
      slug,
      content,
      excerpt,
      cover_image_url,
      category,
      tags,
      status,
      published_at:
        status === "published" && !current?.published_at
          ? new Date().toISOString()
          : current?.published_at ?? null,
    } as UpdateTables<"articles">)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "Ce slug est déjà utilisé." };
    return { error: "Impossible de mettre à jour l'article." };
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/articles");
  return { error: null };
};

export const deleteArticle = async (
  id: string
): Promise<{ error: string } | void> => {
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return { error: "Impossible de supprimer l'article." };

  revalidatePath("/blog");
  if (article?.slug) revalidatePath(`/blog/${article.slug}`);
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
};

export const uploadCoverImage = async (
  formData: FormData
): Promise<{ error: string | null; url: string | null }> => {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  if (!file || file.size === 0)
    return { error: "Aucun fichier fourni.", url: null };

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("articles")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) return { error: "Impossible d'uploader l'image.", url: null };

  const { data } = supabase.storage.from("articles").getPublicUrl(fileName);
  return { error: null, url: data.publicUrl };
};