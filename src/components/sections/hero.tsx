import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gray-950">
      {/* Fond avec motif subtil et gradient */}
      <div className="absolute inset-0">
        {/* Gradient radial rouge subtil */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(227,6,19,0.15)_0%,_transparent_60%)]" />
        {/* Motif diagonal */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)",
          }}
        />
        {/* Gradient bas pour transition douce */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E30613]/30 bg-[#E30613]/10 px-4 py-1.5 text-sm font-medium text-[#E30613]">
          <span className="inline-block size-2 animate-pulse rounded-full bg-[#E30613]" />
          Stade Rennais FC
        </div>

        {/* Titre principal */}
        <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          LE FOOTBALL
          <br />
          <span className="text-[#E30613]">RENNAIS</span>
        </h1>

        {/* Sous-titre */}
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400 sm:text-xl">
          Vlogs, d&eacute;briefs et passion{" "}
          <span className="font-semibold text-[#E30613]">Rouge</span> &amp;{" "}
          <span className="font-semibold text-white">Noire</span>
        </p>

        {/* Statistiques */}
        <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500 sm:gap-12">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">4,2k</p>
            <p>abonn&eacute;s</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">333</p>
            <p>vid&eacute;os</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">775k</p>
            <p>vues</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="https://www.youtube.com/@LefootballRennais"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#E30613]/25 transition-all hover:bg-[#c00510] hover:shadow-[#E30613]/40"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
            </svg>
            Voir la cha&icirc;ne YouTube
          </a>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-base font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
          >
            D&eacute;couvrir le blog
          </Link>
        </div>
      </div>
    </section>
  );
};
