"use client";

import { useTransition } from "react";
import { togglePinTopic, toggleLockTopic } from "@/lib/actions/forum";

interface TopicModerationButtonsProps {
  topicId: string;
  topicSlug: string;
  categorySlug: string;
  isPinned: boolean;
  isLocked: boolean;
}

export const TopicModerationButtons = ({
  topicId,
  topicSlug,
  categorySlug,
  isPinned,
  isLocked,
}: TopicModerationButtonsProps) => {
  const [isPendingPin, startPin] = useTransition();
  const [isPendingLock, startLock] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() =>
          startPin(async () => {
            await togglePinTopic(topicId, isPinned, topicSlug, categorySlug);
          })
        }
        disabled={isPendingPin}
        className={`rounded px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
          isPinned
            ? "bg-[#E30613]/20 text-[#E30613] hover:bg-[#E30613]/10"
            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
        }`}
      >
        {isPinned ? "Désépingler" : "Épingler"}
      </button>
      <button
        onClick={() =>
          startLock(async () => {
            await toggleLockTopic(topicId, isLocked, topicSlug, categorySlug);
          })
        }
        disabled={isPendingLock}
        className={`rounded px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
          isLocked
            ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
        }`}
      >
        {isLocked ? "Déverrouiller" : "Verrouiller"}
      </button>
    </div>
  );
};
