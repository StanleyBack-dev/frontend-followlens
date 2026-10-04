import { NextResponse } from "next/server";
import { readSessionToken } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { billingService } from "@/server/services/billing.service";

// Polled by the checkout while it waits for the payment to be confirmed.
export const GET = bffRoute(async () => {
  const token = await readSessionToken();
  if (!token) {
    return errorResponse(401, {
      code: "AUTH_ACCESS_TOKEN_MISSING",
      message: "Sessão expirada.",
    });
  }
  return NextResponse.json(await billingService.subscription(token));
});
