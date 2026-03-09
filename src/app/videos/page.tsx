import type { Metadata } from "next";
import { getLatestVideos } from "@/lib/youtube";
import { VideoCard } from "@/components/ui/video-card";
import { TikTokSection } from "@/components/ui/tiktok-embed";

export const metadata: Metadata = {
  title: "Vidéos | Le Football Rennais",
  description:
    "Vlogs, réactions et débriefs du Stade Rennais sur YouTube et TikTok.",
  openGraph: {
    title: "Vidéos | Le Football Rennais",
    description:
      "Vlogs, réactions et débriefs du Stade Rennais sur YouTube et TikTok.",
  },
};

const VideosPage = async () => {
  const videos = await getLatestVideos(12);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Vidéos</h1>
        <p className="mt-2 text-gray-400">
          Vlogs, réactions et débriefs sur le Stade Rennais.
        </p>
      </div>

      {/* Section YouTube */}
      <section className="mb-16">
        <div className="mb-6 flex items-center gap-3">
          <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 00.5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 002.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 002.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
          </svg>
          <h2 className="text-xl font-semibold text-white">YouTube</h2>
        </div>

        {videos.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-gray-900 px-6 py-12 text-center">
            <p className="text-gray-400">
              Aucune vidéo disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.id.videoId} video={video} />
            ))}
          </div>
        )}
      </section>

      {/* Section TikTok */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
          </svg>
          <h2 className="text-xl font-semibold text-white">TikTok</h2>
        </div>
        <TikTokSection />
      </section>
    </div>
  );
};

export default VideosPage;
