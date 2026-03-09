import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getProfileByUsername,
  getUserBadges,
  getRecentPostsByUser,
} from "@/lib/queries/profiles";
import { BadgeDisplay } from "@/components/ui/badge-display";
import { ProfileEditForm } from "@/components/ui/profile-edit-form";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export const generateMetadata = async ({
  params,
}: ProfilePageProps): Promise<Metadata> => {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  return {
    title: profile
      ? `${profile.display_name ?? profile.username} | Le Football Rennais`
      : "Profil introuvable | Le Football Rennais",
  };
};

const roleLabels: Record<string, { label: string; className: string }> = {
  admin: { label: "Admin", className: "bg-[#E30613]/20 text-[#E30613]" },
  moderator: { label: "Modérateur", className: "bg-blue-500/20 text-blue-400" },
  member: { label: "Membre", className: "bg-gray-700 text-gray-400" },
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { username } = await params;

  const supabase = await createClient();
  const [profile, { data: { user } }] = await Promise.all([
    getProfileByUsername(username),
    supabase.auth.getUser(),
  ]);

  if (!profile) notFound();

  const [badges, recentPosts] = await Promise.all([
    getUserBadges(profile.id),
    getRecentPostsByUser(profile.id),
  ]);

  const isOwnProfile = user?.id === profile.id;
  const displayName = profile.display_name ?? profile.username;
  const joinDate = new Date(profile.created_at).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
  const roleStyle = roleLabels[profile.role] ?? roleLabels.member;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* En-tête du profil */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={displayName}
              className="h-24 w-24 rounded-full object-cover ring-2 ring-white/10"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#E30613]/20 text-2xl font-bold text-[#E30613] ring-2 ring-white/10">
              {initials}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{displayName}</h1>
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${roleStyle.className}`}
            >
              {roleStyle.label}
            </span>
          </div>

          <p className="mt-0.5 text-sm text-gray-500">@{profile.username}</p>

          {profile.bio && (
            <p className="mt-3 text-sm text-gray-400">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-500">
            <span>
              <span className="font-semibold text-white">{profile.post_count}</span>{" "}
              message{profile.post_count !== 1 ? "s" : ""}
            </span>
            <span>
              <span className="font-semibold text-white">{profile.topic_count}</span>{" "}
              sujet{profile.topic_count !== 1 ? "s" : ""}
            </span>
            <span>Membre depuis {joinDate}</span>
          </div>
        </div>
      </div>

      {/* Formulaire d'édition (propre profil) */}
      {isOwnProfile && (
        <div className="mb-8">
          <ProfileEditForm
            displayName={profile.display_name}
            bio={profile.bio}
            avatarUrl={profile.avatar_url}
          />
        </div>
      )}

      {/* Badges */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Badges
        </h2>
        <BadgeDisplay badges={badges} />
      </section>

      {/* Activité récente */}
      {recentPosts.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Activité récente
          </h2>
          <div className="divide-y divide-white/5 rounded-xl border border-white/10">
            {recentPosts.map((post) => {
              const categorySlug = post.topic?.category?.slug ?? "";
              const topicSlug = post.topic?.slug ?? "";
              return (
                <div key={post.id} className="px-4 py-3">
                  <Link
                    href={`/forum/${categorySlug}/${topicSlug}`}
                    className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
                  >
                    {post.topic?.title ?? "Sujet supprimé"}
                  </Link>
                  <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">
                    {post.content}
                  </p>
                  <p className="mt-1 text-xs text-gray-700">
                    {new Date(post.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProfilePage;
