"use client";

import { useTransition } from "react";
import { updateUserRole, awardBadge } from "@/lib/actions/badges";
import type { Tables } from "@/types/database";

interface MemberActionsProps {
  member: Tables<"user_profiles">;
  badges: Tables<"badges">[];
}

export const MemberActions = ({ member, badges }: MemberActionsProps) => {
  const [isPendingRole, startRole] = useTransition();
  const [isPendingBadge, startBadge] = useTransition();

  const handleRoleChange = (role: "member" | "moderator" | "admin") => {
    startRole(async () => {
      await updateUserRole(member.id, role);
    });
  };

  const handleAwardBadge = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const badgeId = e.target.value;
    if (!badgeId) return;
    e.target.value = "";
    startBadge(async () => {
      await awardBadge(member.id, badgeId);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Changement de rôle */}
      <select
        defaultValue={member.role}
        onChange={(e) =>
          handleRoleChange(e.target.value as "member" | "moderator" | "admin")
        }
        disabled={isPendingRole}
        className="rounded border border-white/10 bg-gray-800 px-2 py-1 text-xs text-gray-300 outline-none focus:border-[#E30613] disabled:opacity-50"
      >
        <option value="member">Membre</option>
        <option value="moderator">Modérateur</option>
        <option value="admin">Admin</option>
      </select>

      {/* Attribution de badge */}
      {badges.length > 0 && (
        <select
          defaultValue=""
          onChange={handleAwardBadge}
          disabled={isPendingBadge}
          className="rounded border border-white/10 bg-gray-800 px-2 py-1 text-xs text-gray-500 outline-none focus:border-[#E30613] disabled:opacity-50"
        >
          <option value="" disabled>
            + Badge
          </option>
          {badges.map((badge) => (
            <option key={badge.id} value={badge.id}>
              {badge.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
