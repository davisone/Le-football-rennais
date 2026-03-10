import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
