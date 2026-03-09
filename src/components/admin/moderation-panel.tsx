"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  togglePinTopic,
  toggleLockTopic,
  deleteTopic,
} from "@/lib/actions/forum";

interface Topic {
  id: string;
  title: string;
  slug: string;
  is_pinned: boolean;
  is_locked: boolean;
  post_count: number;
  view_count: number;
  last_post_at: string;
  created_at: string;
  category: { name: string; slug: string } | null;
  author: { username: string; display_name: string | null } | null;
}

interface ModerationPanelProps {
  topics: Topic[];
}

const TopicActions = ({ topic }: { topic: Topic }) => {
  const [isPendingPin, startPin] = useTransition();
  const [isPendingLock, startLock] = useTransition();
  const [isPendingDelete, startDelete] = useTransition();

  const categorySlug = topic.category?.slug ?? "";

  const handleDelete = () => {
    if (!confirm(`Supprimer le sujet "${topic.title}" et tous ses posts ?`))
      return;
    startDelete(async () => { await deleteTopic(topic.id, categorySlug); });
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <Link
        href={`/forum/${categorySlug}/${topic.slug}`}
        className="text-xs text-gray-500 hover:text-gray-300"
        target="_blank"
      >
        Voir
      </Link>
      <button
        onClick={() =>
          startPin(async () => {
            await togglePinTopic(topic.id, topic.is_pinned, topic.slug, categorySlug);
          })
        }
        disabled={isPendingPin}
        className={`text-xs transition-colors disabled:opacity-50 ${
          topic.is_pinned
            ? "text-[#E30613] hover:text-[#E30613]/70"
            : "text-gray-500 hover:text-white"
        }`}
      >
        {topic.is_pinned ? "Désépingler" : "Épingler"}
      </button>
      <button
        onClick={() =>
          startLock(async () => {
            await toggleLockTopic(topic.id, topic.is_locked, topic.slug, categorySlug);
          })
        }
        disabled={isPendingLock}
        className={`text-xs transition-colors disabled:opacity-50 ${
          topic.is_locked
            ? "text-yellow-400 hover:text-yellow-300"
            : "text-gray-500 hover:text-white"
        }`}
      >
        {topic.is_locked ? "Déverrouiller" : "Verrouiller"}
      </button>
      <button
        onClick={handleDelete}
        disabled={isPendingDelete}
        className="text-xs text-red-400 transition-colors hover:text-red-300 disabled:opacity-50"
      >
        Supprimer
      </button>
    </div>
  );
};

export const ModerationPanel = ({ topics }: ModerationPanelProps) => {
  if (topics.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-gray-900 py-16 text-center">
        <p className="text-gray-400">Aucun sujet à modérer.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="border-b border-white/10 bg-gray-900">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-400">
              Sujet
            </th>
            <th className="hidden px-4 py-3 text-left font-medium text-gray-400 md:table-cell">
              Catégorie
            </th>
            <th className="hidden px-4 py-3 text-left font-medium text-gray-400 lg:table-cell">
              Statut
            </th>
            <th className="hidden px-4 py-3 text-left font-medium text-gray-400 sm:table-cell">
              Posts
            </th>
            <th className="px-4 py-3 text-right font-medium text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-gray-950">
          {topics.map((topic) => {
            const authorName =
              topic.author?.display_name ?? topic.author?.username ?? "Membre";
            return (
              <tr
                key={topic.id}
                className="transition-colors hover:bg-gray-900/50"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-white">{topic.title}</p>
                  <p className="text-xs text-gray-500">
                    par {authorName} ·{" "}
                    {new Date(topic.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </td>
                <td className="hidden px-4 py-3 text-gray-400 md:table-cell">
                  {topic.category?.name ?? "—"}
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {topic.is_pinned && (
                      <span className="rounded bg-[#E30613]/10 px-1.5 py-0.5 text-xs text-[#E30613]">
                        Épinglé
                      </span>
                    )}
                    {topic.is_locked && (
                      <span className="rounded bg-yellow-500/10 px-1.5 py-0.5 text-xs text-yellow-400">
                        Verrouillé
                      </span>
                    )}
                    {!topic.is_pinned && !topic.is_locked && (
                      <span className="text-xs text-gray-600">Normal</span>
                    )}
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-gray-400 sm:table-cell">
                  {topic.post_count}
                </td>
                <td className="px-4 py-3">
                  <TopicActions topic={topic} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
