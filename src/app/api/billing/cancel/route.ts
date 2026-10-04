import { NextResponse } from "next/server";
import { readSessionToken } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { billingService } from "@/server/services/billing.service";

export const maxDuration = 60;

// Pure pass-through: the backend validates the reasons.
export const POST = bffRoute(async (request) => {
  const token = await readSessionToken();
  if (!token) {
    return errorResponse(401, {
      code: "AUTH_ACCESS_TOKEN_MISSING",
      message: "Sessão expirada.",
    });
  }
  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  return NextResponse.json(
    await billingService.cancel(token, {
      reasons: body.reasons as never,
      otherReason: body.otherReason as never,
    }),
  );
});
