import type { Metadata } from "next";
import Link from "next/link";
import { getAllMembers, getAllBadges } from "@/lib/queries/profiles";
import { MemberActions } from "@/components/admin/member-actions";

export const metadata: Metadata = {
  title: "Gestion des membres | Admin — Le Football Rennais",
};

const roleStyles: Record<string, string> = {
  admin: "bg-[#E30613]/10 text-[#E30613]",
  moderator: "bg-blue-500/10 text-blue-400",
  member: "bg-gray-700/50 text-gray-400",
};

const roleLabels: Record<string, string> = {
  admin: "Admin",
  moderator: "Modérateur",
  member: "Membre",
};

const AdminMembresPage = async () => {
  const [members, badges] = await Promise.all([getAllMembers(), getAllBadges()]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Membres</h1>
          <p className="mt-1 text-sm text-gray-400">
            {members.length} membre{members.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-gray-900 py-16 text-center">
          <p className="text-gray-400">Aucun membre.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-400">
                  Membre
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-gray-400 sm:table-cell">
                  Rôle
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-gray-400 md:table-cell">
                  Messages
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-gray-400 lg:table-cell">
                  Inscription
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-gray-950">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="transition-colors hover:bg-gray-900/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/profil/${member.username}`}
                      className="font-medium text-white transition-colors hover:text-[#E30613]"
                      target="_blank"
                    >
                      {member.display_name ?? member.username}
                    </Link>
                    <p className="text-xs text-gray-500">@{member.username}</p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${roleStyles[member.role] ?? roleStyles.member}`}
                    >
                      {roleLabels[member.role] ?? "Membre"}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-gray-400 md:table-cell">
                    {member.post_count}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-500 lg:table-cell">
                    {new Date(member.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <MemberActions member={member} badges={badges} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMembresPage;
