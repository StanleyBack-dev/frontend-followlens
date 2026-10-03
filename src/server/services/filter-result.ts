import "server-only";
import { BackendError } from "@/server/http/backend-error";

export type FilterResult<T> =
  { ok: true; data: T } | { ok: false; message: string };

// Filter validation lives in the backend. A rejected filter (HTTP 400: unknown
// follower, malformed id...) becomes a message for the page instead of the
// generic error screen.
export async function withFilterValidation<T>(
  call: () => Promise<T>,
): Promise<FilterResult<T>> {
  try {
    return { ok: true, data: await call() };
  } catch (error) {
    if (error instanceof BackendError && error.status === 400) {
      // Validation errors carry the specific reason in `details`.
      const detail = Array.isArray(error.details) ? error.details[0] : null;
      return {
        ok: false,
        message: typeof detail === "string" ? detail : error.message,
      };
    }
    throw error;
  }
}
