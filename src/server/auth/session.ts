import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverEnv } from "@/server/config/env";

// The backend token lives only in an httpOnly cookie on the frontend's own
// domain: JavaScript in the browser can never read it.

export async function readSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(serverEnv().SESSION_COOKIE_NAME)?.value ?? null;
}

/** For Server Components: the token, or a redirect to the login page. */
export async function requireSessionToken(): Promise<string> {
  const token = await readSessionToken();
  if (!token) redirect("/login");
  return token;
}

/** Only callable from Route Handlers / Server Actions. */
export async function writeSession(
  token: string,
  expiresAt: Date,
): Promise<void> {
  const env = serverEnv();
  const store = await cookies();
  store.set(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(serverEnv().SESSION_COOKIE_NAME);
}
