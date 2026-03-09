import Link from "next/link";
import Image from "next/image";
import { getLatestVideos } from "@/lib/youtube";

export const LatestVideos = async () => {
  const videos = await getLatestVideos(4);

  return (
    <section className="bg-gray-950 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Dernières vidéos
            </h2>
            <p className="mt-2 text-gray-400">
              Vlogs, débriefs et analyses en vidéo
            </p>
          </div>
          <Link
            href="/videos"
            className="hidden items-center gap-1 text-sm font-medium text-[#E30613] transition-colors hover:text-[#ff2a36] sm:inline-flex"
          >
            Voir toutes les vidéos
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        {/* Grille de vidéos */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {videos.length === 0 ? (
            <p className="col-span-4 py-12 text-center text-gray-500">
              Aucune vidéo disponible pour le moment.
            </p>
          ) : (
            videos.map((video) => {
              const videoId = video.id.videoId;
              const thumbnail = video.snippet.thumbnails.high.url;
              const publishedAt = new Date(
                video.snippet.publishedAt
              ).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              return (
                <a
                  key={videoId}
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-xl border border-white/5 bg-gray-900 transition-all hover:border-[#E30613]/30"
                >
                  {/* Miniature */}
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={thumbnail}
                      alt={video.snippet.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E30613]/90 text-white transition-transform group-hover:scale-110">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="ml-0.5 h-5 w-5"
                        >
                          <path d="M8 5.14v14l11-7-11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-[#E30613]">
                      {video.snippet.title}
                    </h3>
                    <time className="mt-2 block text-xs text-gray-500">
                      {publishedAt}
                    </time>
                  </div>
                </a>
              );
            })
          )}
        </div>

        {/* Lien mobile */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/videos"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#E30613] transition-colors hover:text-[#ff2a36]"
          >
            Voir toutes les vidéos
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
