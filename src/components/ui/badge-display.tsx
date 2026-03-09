import type { Tables } from "@/types/database";

interface BadgeDisplayProps {
  badges: Array<{
    badge: Tables<"badges">;
    awarded_at: string;
  }>;
}

export const BadgeDisplay = ({ badges }: BadgeDisplayProps) => {
  if (badges.length === 0) {
    return (
      <p className="text-sm text-gray-600">Aucun badge pour l&apos;instant.</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map(({ badge, awarded_at }) => (
        <div
          key={badge.id}
          title={`${badge.description ?? ""} — Obtenu le ${new Date(awarded_at).toLocaleDateString("fr-FR")}`}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-gray-800 px-3 py-1"
        >
          {badge.icon_url ? (
            <img
              src={badge.icon_url}
              alt=""
              className="h-4 w-4 object-contain"
            />
          ) : (
            <span className="text-base">🏅</span>
          )}
          <span className="text-xs font-medium text-gray-300">{badge.name}</span>
        </div>
      ))}
    </div>
  );
};
