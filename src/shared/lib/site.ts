// Public address of the app, used for the link previews and the share links.
// SITE_URL wins; on Vercel the production domain is known at build time;
// everywhere else it is the local dev server.
export function siteUrl(): string {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_NAME = "FollowLens";
export const SITE_TAGLINE = "Descubra quem deixou de seguir você no Instagram";
export const SITE_DESCRIPTION =
  "Compare suas listas de seguidores e veja quem saiu, quem chegou e quem voltou — sem informar a senha do Instagram.";
