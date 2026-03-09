const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID!;

export interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      high: { url: string; width: number; height: number };
    };
  };
}

export const getLatestVideos = async (maxResults = 12): Promise<YouTubeVideo[]> => {
  if (!YOUTUBE_API_KEY || !CHANNEL_ID) return [];

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${maxResults}&order=date&type=video&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items as YouTubeVideo[]) ?? [];
  } catch {
    return [];
  }
};
