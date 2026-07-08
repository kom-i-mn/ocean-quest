import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ocean-quest.jp";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "robotics",
    "videos",
    "ebooks",
    "notes",
    "events",
    "map",
    "diagnosis",
    "companies",
    "contact",
    "privacy",
  ].map((path) => ({
    url: path ? `${baseUrl}/${path}` : baseUrl,
    lastModified: new Date(),
  }));
}
