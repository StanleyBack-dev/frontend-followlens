import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { clearSession } from "@/server/auth/session";
import { BackendError } from "@/server/http/backend-error";
import type { ApiError } from "@/shared/contracts/api";

type Handler = (request: NextRequest) => Promise<NextResponse>;

// CSRF defense for state-changing BFF routes: on top of SameSite=Lax cookies,
// mutations must come from this same origin.
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function errorResponse(status: number, error: ApiError): NextResponse {
  return NextResponse.json(error, { status });
}

/** Wraps a BFF route: origin check for mutations + uniform error mapping. */
export function bffRoute(handler: Handler): Handler {
  return async (request) => {
    if (request.method !== "GET" && !isSameOrigin(request)) {
      return errorResponse(403, {
        code: "BFF_FORBIDDEN_ORIGIN",
        message: "Origem não permitida.",
      });
    }

    try {
      return await handler(request);
    } catch (error) {
      if (error instanceof BackendError) {
        // Expired/invalid session: drop the cookie so the UI goes to login.
        if (error.isUnauthorized) await clearSession();
        return errorResponse(error.status, error.toApiError());
      }
      console.error("[bff] erro inesperado", error);
      return errorResponse(500, {
        code: "BFF_UNEXPECTED",
        message: "Erro inesperado.",
      });
    }
  };
}
