import type { MetadataRoute } from "next";

// Makes the panel installable (home screen / app launcher). No service worker:
// every page needs the server and a session, so there is nothing to serve
// offline — the installed app is the same site in its own window.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FollowLens",
    short_name: "FollowLens",
    description: "Monitore quem deixou de seguir você no Instagram.",
    lang: "pt-BR",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#0b0b12",
    theme_color: "#0b0b12",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
