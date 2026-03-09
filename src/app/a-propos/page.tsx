import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez Le Football Rennais, créateur de contenu passionné par le Stade Rennais et le football français.",
};

/* Types de contenu produits sur la chaîne */
const contentTypes = [
  {
    title: "Vlogs jour de match",
    description:
      "Immersion totale au Roazhon Park : ambiance des tribunes, réactions à chaud et émotions du match.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="size-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
    ),
  },
  {
    title: "Avant-matchs & débriefs",
    description:
      "Analyses tactiques, pronostics et retours détaillés sur chaque rencontre du SRFC.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="size-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
        />
      </svg>
    ),
  },
  {
    title: "Contenus clubs amateurs",
    description:
      "Coups de projecteur sur le football amateur breton : reportages et rencontres avec ceux qui font vivre le foot local.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="size-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>
    ),
  },
  {
    title: "Émission live le lundi",
    description:
      "Tous les lundis de 20h à 22h : débrief complet de la journée de Ligue 1, en direct avec la communauté.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="size-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 7.5 12 3l8.25 4.5m-16.5 0v9l8.25 4.5m-8.25-13.5L12 12m0 0 8.25-4.5M12 12v9.75m0-9.75L3.75 7.5M12 12l8.25-4.5M12 21.75l8.25-4.5v-9"
        />
      </svg>
    ),
  },
] as const;

/* Chiffres clés */
const stats = [
  { value: "4,2k", label: "abonnés" },
  { value: "333", label: "vidéos" },
  { value: "775k", label: "vues" },
  { value: "2024", label: "depuis" },
] as const;

/* Liens réseaux sociaux */
const socialLinks = [
  {
    href: "https://www.youtube.com/@LefootballRennais",
    label: "YouTube",
    color: "bg-red-600 hover:bg-red-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@lefootballrennais",
    label: "TikTok",
    color: "bg-gray-800 hover:bg-gray-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/lfr.media",
    label: "Instagram",
    color: "bg-pink-600 hover:bg-pink-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/blo350",
    label: "X (Twitter)",
    color: "bg-gray-800 hover:bg-gray-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
      </svg>
    ),
  },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-gray-950">
        {/* Fond décoratif */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(227,6,19,0.15)_0%,_transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E30613]/30 bg-[#E30613]/10 px-4 py-1.5 text-sm font-medium text-[#E30613]">
            <span className="inline-block size-2 animate-pulse rounded-full bg-[#E30613]" />
            Qui sommes-nous ?
          </div>

          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
            &Agrave; <span className="text-[#E30613]">propos</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400 sm:text-xl">
            Galette-saucisse, passion et bonne ambiance &mdash; bienvenue dans
            l&apos;univers{" "}
            <span className="font-semibold text-[#E30613]">Rouge</span> &amp;{" "}
            <span className="font-semibold text-white">Noir</span>.
          </p>
        </div>
      </section>

      {/* Présentation du créateur */}
      <section className="bg-gray-950 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:p-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Le Football{" "}
              <span className="text-[#E30613]">Rennais</span>, c&apos;est
              quoi ?
            </h2>

            <div className="mt-8 space-y-6 text-lg leading-relaxed text-gray-400">
              <p>
                Le Football Rennais, c&apos;est avant tout une{" "}
                <span className="font-semibold text-white">passion</span> :
                celle du Stade Rennais FC, du Roazhon Park et de tout ce qui
                fait vibrer le football &agrave; Rennes et en Bretagne.
              </p>

              <p>
                N&eacute; de l&apos;envie de partager l&apos;exp&eacute;rience
                des jours de match comme si vous y &eacute;tiez, ce projet est
                devenu un v&eacute;ritable espace de{" "}
                <span className="font-semibold text-white">
                  cr&eacute;ation de contenu
                </span>{" "}
                autour du SRFC : vlogs immersifs, analyses tactiques,
                d&eacute;briefs passionn&eacute;s et coups de projecteur sur le
                football amateur breton.
              </p>

              <p>
                L&apos;objectif est simple : rassembler les supporters du Stade
                Rennais autour d&apos;une{" "}
                <span className="font-semibold text-white">
                  communaut&eacute; authentique
                </span>
                , o&ugrave; chaque match est v&eacute;cu intensément et
                o&ugrave; la bonne ambiance est toujours au rendez-vous.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Types de contenu */}
      <section className="border-t border-white/5 bg-gray-950 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ce qu&apos;on{" "}
              <span className="text-[#E30613]">produit</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              Du contenu varié pour vivre le Stade Rennais sous tous les
              angles.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {contentTypes.map((content) => (
              <div
                key={content.title}
                className="group rounded-xl border border-white/10 bg-white/[0.02] p-8 transition-all hover:border-[#E30613]/30 hover:bg-[#E30613]/5"
              >
                <div className="flex size-14 items-center justify-center rounded-lg bg-[#E30613]/10 text-[#E30613] transition-colors group-hover:bg-[#E30613]/20">
                  {content.icon}
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">
                  {content.title}
                </h3>
                <p className="mt-3 text-gray-400 leading-relaxed">
                  {content.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="relative overflow-hidden bg-[#E30613] py-20">
        {/* Motif décoratif */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, #000 0px, #000 1px, transparent 1px, transparent 30px)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            LFR en chiffres
          </h2>

          <div className="mt-14 grid grid-cols-2 gap-8 sm:gap-12 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-black text-white sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-lg font-medium text-white/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Réseaux sociaux */}
      <section className="bg-gray-950 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Rejoins la{" "}
            <span className="text-[#E30613]">communaut&eacute;</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            Retrouve-nous sur toutes les plateformes pour ne rien manquer de
            l&apos;actu Rouge et Noir.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2.5 rounded-lg px-6 py-3 text-base font-semibold text-white transition-colors ${social.color}`}
              >
                {social.icon}
                {social.label}
              </a>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Contact :{" "}
            <a
              href="mailto:footinfosstaderennais@gmail.com"
              className="text-gray-400 underline decoration-gray-600 underline-offset-4 transition-colors hover:text-[#E30613]"
            >
              footinfosstaderennais@gmail.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
