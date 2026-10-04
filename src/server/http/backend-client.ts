import "server-only";
import { readActiveProfileId } from "@/server/auth/session";
import { serverEnv } from "@/server/config/env";
import { BackendError } from "@/server/http/backend-error";

const DEFAULT_TIMEOUT_MS = 15_000;

type BackendRequest = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Raw bytes sent as-is (used for the export file upload). */
  rawBody?: ArrayBuffer;
  /** Extra headers (e.g. x-filename on the upload). */
  headers?: Record<string, string>;
  /** Owner session token (omitted only for login). */
  token?: string | null;
  query?: Record<string, string | number | undefined>;
  timeoutMs?: number;
};

// Single gateway from the BFF to the NestJS API: attaches the internal key and
// the owner's token, and normalizes every failure into a BackendError.
export async function backendFetch<T>(
  path: string,
  request: BackendRequest = {},
): Promise<T> {
  const env = serverEnv();
  const url = new URL(path, env.BACKEND_URL);
  for (const [key, value] of Object.entries(request.query ?? {})) {
    if (value !== undefined && value !== "")
      url.searchParams.set(key, String(value));
  }

  const headers: Record<string, string> = {
    accept: "application/json",
    "x-internal-api-key": env.INTERNAL_API_KEY,
    ...request.headers,
  };
  if (request.token) {
    headers.authorization = `Bearer ${request.token}`;
    // The Instagram profile selected in the UI scopes every follower call.
    const profileId = await readActiveProfileId();
    if (profileId) headers["x-profile-id"] = profileId;
  }
  if (request.rawBody !== undefined) {
    headers["content-type"] = "application/octet-stream";
  } else if (request.body !== undefined) {
    headers["content-type"] = "application/json";
  }

  const body =
    request.rawBody !== undefined
      ? request.rawBody
      : request.body !== undefined
        ? JSON.stringify(request.body)
        : undefined;

  let response: Response;
  try {
    response = await fetch(url, {
      method: request.method ?? "GET",
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(request.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    });
  } catch {
    throw BackendError.unreachable();
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const body = (payload ?? {}) as {
      code?: string;
      message?: string;
      details?: unknown;
    };
    throw new BackendError(
      response.status,
      body.code ?? `HTTP_${response.status}`,
      body.message ?? "Erro inesperado no servidor.",
      body.details,
    );
  }
  return payload as T;
}
