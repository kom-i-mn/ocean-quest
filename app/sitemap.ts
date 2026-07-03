import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ocean-quest.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "videos",
    "ebooks",
    "notes",
    "events",
    "diagnosis",
    "companies",
  ].map((path) => ({
    url: path ? `${baseUrl}/${path}` : baseUrl,
    lastModified: new Date(),
  }));
}
