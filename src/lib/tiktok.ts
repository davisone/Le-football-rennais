export const getTikTokEmbed = async (url: string) => {
  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
    );
    if (!res.ok) return null;
    return res.json() as Promise<{
      title: string;
      author_name: string;
      thumbnail_url: string;
      html: string;
    }>;
  } catch {
    return null;
  }
};
