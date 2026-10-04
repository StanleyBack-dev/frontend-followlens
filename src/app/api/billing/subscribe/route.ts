import { NextResponse } from "next/server";
import { readSessionToken } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { billingService } from "@/server/services/billing.service";

// The gateway needs a few round-trips to create the checkout.
export const maxDuration = 60;

// Pure pass-through: the backend validates the document, cycle and method.
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
    await billingService.subscribe(token, {
      cpfCnpj: body.cpfCnpj as never,
      billingCycle: body.billingCycle as never,
      paymentMethod: body.paymentMethod as never,
    }),
  );
});
