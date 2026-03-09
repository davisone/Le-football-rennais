"use client";

import { useState } from "react";
import type { YouTubeVideo } from "@/lib/youtube";

interface VideoCardProps {
  video: YouTubeVideo;
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const [playing, setPlaying] = useState(false);
  const videoId = video.id.videoId;
  const thumbnail = video.snippet.thumbnails.high.url;
  const publishedAt = new Date(video.snippet.publishedAt).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  if (playing) {
    return (
      <div className="overflow-hidden rounded-xl border border-white/10 bg-gray-900">
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={video.snippet.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
        <div className="p-3">
          <p className="text-sm font-medium text-white">{video.snippet.title}</p>
          <p className="mt-0.5 text-xs text-gray-500">{publishedAt}</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="group w-full overflow-hidden rounded-xl border border-white/10 bg-gray-900 text-left transition-colors hover:border-white/20"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={video.snippet.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Bouton play */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/50">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E30613] shadow-lg transition-transform group-hover:scale-110">
            <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-medium text-white">
          {video.snippet.title}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">{publishedAt}</p>
      </div>
    </button>
  );
};
