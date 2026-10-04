import type { MetadataRoute } from "next";
import { siteUrl } from "@/shared/lib/site";

// Only the pages that can be opened without signing in.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: `${base}/entrar`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/termos`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacidade`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
