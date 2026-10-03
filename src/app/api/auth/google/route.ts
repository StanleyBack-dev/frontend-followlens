import { NextResponse } from "next/server";
import { z } from "zod";
import { writeSession } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { authService } from "@/server/services/auth.service";

const bodySchema = z.object({ idToken: z.string().min(10).max(4096) });

export const POST = bffRoute(async (request) => {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return errorResponse(400, {
      code: "VALIDATION_FAILED",
      message: "Credencial do Google ausente.",
    });
  }

  const session = await authService.loginWithGoogle(parsed.data.idToken);
  await writeSession(session.accessToken, new Date(session.expiresAt));
  return NextResponse.json({ user: session.user });
});
