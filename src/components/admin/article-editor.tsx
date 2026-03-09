"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useEffect, useRef, useTransition } from "react";
import { uploadCoverImage } from "@/lib/actions/articles";
import type { Tables } from "@/types/database";

type Article = Tables<"articles">;

interface ArticleEditorProps {
  initialData?: Partial<Article>;
  action: (formData: FormData) => Promise<{ error: string | null } | void>;
}

const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

const CATEGORIES = [
  "Actualités",
  "Analyse",
  "Interview",
  "Avant-match",
  "Après-match",
  "Transferts",
  "Formation",
  "Histoire",
];

export const ArticleEditor = ({ initialData, action }: ArticleEditorProps) => {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initialData?.slug);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.cover_image_url ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const pendingStatusRef = useRef<"draft" | "published">("draft");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Rédigez votre article ici..." }),
    ],
    content: initialData?.content ?? "",
    editorProps: {
      attributes: { class: "tiptap-editor" },
    },
    immediatelyRender: false,
  });

  // Auto-génération du slug depuis le titre
  useEffect(() => {
    if (!slugTouched) {
      setSlug(toSlug(title));
    }
  }, [title, slugTouched]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("slug", slug);
    formData.set("content", editor?.getHTML() ?? "");
    formData.set("excerpt", excerpt);
    formData.set("category", category);
    formData.set("tags", tags);
    formData.set("cover_image_url", coverImageUrl);
    formData.set("status", pendingStatusRef.current);

    startTransition(async () => {
      const result = await action(formData);
      if (result && "error" in result) {
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadCoverImage(fd);
    setIsUploading(false);
    if (result.url) setCoverImageUrl(result.url);
    if (result.error) setError(result.error);
  };

  const addLink = () => {
    const url = window.prompt("URL du lien :");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("URL de l'image :");
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  const toolbarBtn = (
    active: boolean,
    onClick: () => void,
    title: string,
    label: React.ReactNode
  ) => (
    <button
      key={title}
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
        active
          ? "bg-[#E30613] text-white"
          : "text-gray-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  const divider = (
    <div key="div" className="mx-0.5 h-5 w-px bg-white/10" />
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Retour */}
      <a
        href="/admin/articles"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300"
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
        Retour aux articles
      </a>

      {/* Feedback */}
      {error && (
        <div className="rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Article enregistré avec succès.
        </div>
      )}

      {/* Titre */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Titre <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Titre de l'article"
          className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Slug
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          placeholder="slug-de-larticle"
          className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 font-mono text-sm text-gray-300 placeholder-gray-500 outline-none transition-colors focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
        />
        <p className="mt-1 text-xs text-gray-500">
          Auto-généré depuis le titre. Modifiable manuellement.
        </p>
      </div>

      {/* Image de couverture */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Image de couverture
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://..."
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 outline-none transition-colors focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-gray-700 disabled:opacity-50"
          >
            {isUploading ? "Upload..." : "Uploader"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        {coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageUrl}
            alt="Aperçu couverture"
            className="mt-3 h-32 w-auto rounded-lg object-cover"
          />
        )}
      </div>

      {/* Extrait */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Extrait
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          maxLength={300}
          placeholder="Résumé court affiché dans les listes d'articles..."
          className="w-full resize-y rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 outline-none transition-colors focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
        />
      </div>

      {/* Catégorie + Tags */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Catégorie
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-gray-300 outline-none transition-colors focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
          >
            <option value="">— Aucune —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Tags{" "}
            <span className="font-normal text-gray-500">
              (séparés par des virgules)
            </span>
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="SRFC, Ligue 1, Transfert..."
            className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 outline-none transition-colors focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
          />
        </div>
      </div>

      {/* Éditeur TipTap */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Contenu <span className="text-red-400">*</span>
        </label>
        <div className="overflow-hidden rounded-lg border border-white/10 bg-gray-800">
          {/* Barre d'outils */}
          <div className="flex flex-wrap items-center gap-0.5 border-b border-white/10 bg-gray-900 p-2">
            {toolbarBtn(
              !!editor?.isActive("bold"),
              () => editor?.chain().focus().toggleBold().run(),
              "Gras",
              <strong>B</strong>
            )}
            {toolbarBtn(
              !!editor?.isActive("italic"),
              () => editor?.chain().focus().toggleItalic().run(),
              "Italique",
              <em>I</em>
            )}
            {divider}
            {toolbarBtn(
              !!editor?.isActive("heading", { level: 2 }),
              () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
              "Titre 2",
              "H2"
            )}
            {toolbarBtn(
              !!editor?.isActive("heading", { level: 3 }),
              () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
              "Titre 3",
              "H3"
            )}
            {divider}
            {toolbarBtn(
              !!editor?.isActive("bulletList"),
              () => editor?.chain().focus().toggleBulletList().run(),
              "Liste à puces",
              "•—"
            )}
            {toolbarBtn(
              !!editor?.isActive("orderedList"),
              () => editor?.chain().focus().toggleOrderedList().run(),
              "Liste numérotée",
              "1."
            )}
            {divider}
            {toolbarBtn(
              !!editor?.isActive("codeBlock"),
              () => editor?.chain().focus().toggleCodeBlock().run(),
              "Bloc de code",
              "</>"
            )}
            {toolbarBtn(
              !!editor?.isActive("blockquote"),
              () => editor?.chain().focus().toggleBlockquote().run(),
              "Citation",
              "❝"
            )}
            {toolbarBtn(false, addLink, "Insérer un lien", "Lien")}
            {toolbarBtn(false, addImage, "Insérer une image", "Img")}
            {divider}
            {toolbarBtn(
              false,
              () => editor?.chain().focus().undo().run(),
              "Annuler",
              "↩"
            )}
            {toolbarBtn(
              false,
              () => editor?.chain().focus().redo().run(),
              "Rétablir",
              "↪"
            )}
          </div>
          {/* Zone de rédaction */}
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Boutons de soumission */}
      <div className="flex items-center gap-3 border-t border-white/10 pt-4">
        <button
          type="submit"
          disabled={isPending}
          onClick={() => {
            pendingStatusRef.current = "draft";
          }}
          className="rounded-md border border-white/20 bg-gray-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
        >
          {isPending ? "Enregistrement..." : "Enregistrer brouillon"}
        </button>
        <button
          type="submit"
          disabled={isPending}
          onClick={() => {
            pendingStatusRef.current = "published";
          }}
          className="rounded-md bg-[#E30613] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#c00510] disabled:opacity-50"
        >
          {isPending ? "Publication..." : "Publier"}
        </button>
      </div>
    </form>
  );
};
