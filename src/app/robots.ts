import type { MetadataRoute } from "next";
import { siteUrl } from "@/shared/lib/site";

// Search engines may read the public pages; the panel and the BFF are not
// for them (they only answer with a redirect to the login anyway).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/entrar", "/termos", "/privacidade"],
      disallow: [
        "/api/",
        "/dashboard",
        "/historico",
        "/seguidores",
        "/importacoes",
        "/conta",
        "/suporte",
        "/admin",
        "/aceitar-termos",
      ],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
