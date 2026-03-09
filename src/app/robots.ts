import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/auth/"],
    },
  ],
  sitemap: "https://lefootballrennais.fr/sitemap.xml",
});

export default robots;
