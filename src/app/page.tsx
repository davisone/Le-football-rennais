import { Hero } from "@/components/sections/hero";
import { LatestArticles } from "@/components/sections/latest-articles";
import { LatestVideos } from "@/components/sections/latest-videos";
import { NewsletterCta } from "@/components/sections/newsletter-cta";
import { SocialFeed } from "@/components/sections/social-feed";

export default function Home() {
  return (
    <>
      <Hero />
      <LatestArticles />
      <LatestVideos />
      <NewsletterCta />
      <SocialFeed />
    </>
  );
}
