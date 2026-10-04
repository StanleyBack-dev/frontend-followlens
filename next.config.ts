import type { NextConfig } from "next";

// Security headers for every page. The app only talks to its own origin
// (the BFF), so connect-src can stay 'self'.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

// Page paths used to be in English. The old ones still arrive from
// bookmarks and from links in e-mails (the backend templates keep using
// them), so each is redirected to its Portuguese path.
const legacyPaths = [
  { source: "/accept-terms", destination: "/aceitar-termos", permanent: true },
  { source: "/account", destination: "/conta", permanent: true },
  {
    source: "/account/billing",
    destination: "/conta/assinatura",
    permanent: true,
  },
  {
    source: "/account/profiles",
    destination: "/conta/perfis",
    permanent: true,
  },
  {
    source: "/admin/overview",
    destination: "/admin/visao-geral",
    permanent: true,
  },
  {
    source: "/admin/subscriptions",
    destination: "/admin/assinaturas",
    permanent: true,
  },
  { source: "/admin/support", destination: "/admin/chamados", permanent: true },
  {
    source: "/admin/syncs",
    destination: "/admin/sincronizacoes",
    permanent: true,
  },
  { source: "/admin/users", destination: "/admin/usuarios", permanent: true },
  { source: "/followers", destination: "/seguidores", permanent: true },
  { source: "/imports", destination: "/importacoes", permanent: true },
  { source: "/login", destination: "/entrar", permanent: true },
  { source: "/privacy", destination: "/privacidade", permanent: true },
  { source: "/support", destination: "/suporte", permanent: true },
  { source: "/terms", destination: "/termos", permanent: true },
  { source: "/unfollows", destination: "/historico", permanent: true },
  {
    source: "/admin/support/:id",
    destination: "/admin/chamados/:id",
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return legacyPaths;
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
