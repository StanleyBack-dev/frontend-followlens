import "server-only";
import { z } from "zod";

// Validated once per server instance. Nothing here is NEXT_PUBLIC_: secrets
// never reach the browser bundle (enforced by "server-only").
const schema = z.object({
  BACKEND_URL: z.url(),
  INTERNAL_API_KEY: z.string().min(32),
  SESSION_COOKIE_NAME: z.string().min(1).default("fl_session"),
  APP_TIMEZONE: z.string().default("America/Sao_Paulo"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type ServerEnv = z.infer<typeof schema>;

let cached: ServerEnv | null = null;

export function serverEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const fields = parsed.error.issues
      .map((issue) => issue.path.join("."))
      .join(", ");
    throw new Error(`Variáveis de ambiente inválidas no frontend: ${fields}`);
  }
  cached = parsed.data;
  return cached;
}
