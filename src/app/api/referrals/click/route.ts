import { NextResponse } from "next/server";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { referralsService } from "@/server/services/referrals.service";
import { REFERRAL_CODE } from "@/shared/lib/referral";

// Counts one opening of a referral link. Public on purpose (the visitor has
// no account yet); the same-origin check of bffRoute still applies.
export const POST = bffRoute(async (request) => {
  const body = (await request.json().catch(() => ({}))) as { code?: unknown };
  if (typeof body.code !== "string" || !REFERRAL_CODE.test(body.code)) {
    return errorResponse(400, {
      code: "VALIDATION_FAILED",
      message: "Código de indicação inválido.",
    });
  }
  await referralsService.recordClick(body.code);
  return NextResponse.json({ ok: true });
});
