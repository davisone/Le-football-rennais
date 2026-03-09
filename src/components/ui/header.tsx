import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HeaderClient } from "@/components/ui/header-client";

export const Header = async () => {
  /* Récupération de l'utilisateur connecté */
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userData = user
    ? {
        email: user.email ?? "",
        displayName: (user.user_metadata?.display_name as string) ?? (user.user_metadata?.username as string) ?? "",
      }
    : null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            <span className="text-[#E30613]">LFR</span>
            <span className="hidden sm:inline"> — Le Football Rennais</span>
          </span>
        </Link>

        {/* Partie interactive (client component) */}
        <HeaderClient user={userData} />
      </div>
    </header>
  );
};
