import type { MetadataRoute } from "next";
import { loadPapers } from "@/lib/papers";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticPaths = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.55 },
    { path: "/research", priority: 0.8 },
    { path: "/visualizer", priority: 0.85 },
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map(({ path, priority }) => ({
    url: path ? `${base}${path}` : `${base}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority,
  }));

  for (const p of loadPapers()) {
    entries.push({
      url: `${base}/research/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
