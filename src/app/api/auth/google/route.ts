import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { writeSession } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { authService } from "@/server/services/auth.service";
import { REFERRAL_CODE, REFERRAL_COOKIE } from "@/shared/lib/referral";

const bodySchema = z.object({ idToken: z.string().min(10).max(4096) });

export const POST = bffRoute(async (request) => {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return errorResponse(400, {
      code: "VALIDATION_FAILED",
      message: "Credencial do Google ausente.",
    });
  }

  // Set when the visitor arrived through someone's referral link; the
  // backend only uses it if this sign-in creates the account.
  const store = await cookies();
  const referralCode = store.get(REFERRAL_COOKIE)?.value;
  const session = await authService.loginWithGoogle(
    parsed.data.idToken,
    referralCode && REFERRAL_CODE.test(referralCode) ? referralCode : undefined,
  );
  await writeSession(session.accessToken, new Date(session.expiresAt));
  store.delete(REFERRAL_COOKIE);
  return NextResponse.json({ user: session.user });
});
