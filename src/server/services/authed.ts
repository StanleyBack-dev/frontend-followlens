import "server-only";
import { redirect } from "next/navigation";
import { requireSessionToken } from "@/server/auth/session";
import { BackendError } from "@/server/http/backend-error";

// Runs a backend call with the current session from a Server Component.
// Cookies can't be cleared during render, so an expired session is sent to
// the logout route, which clears it and lands on /login.
export async function authed<T>(
  call: (token: string) => Promise<T>,
): Promise<T> {
  const token = await requireSessionToken();
  try {
    return await call(token);
  } catch (error) {
    if (error instanceof BackendError && error.isUnauthorized) {
      redirect("/api/auth/logout?reason=expired");
    }
    throw error;
  }
}
