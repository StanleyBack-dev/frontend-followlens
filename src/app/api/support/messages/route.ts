import { NextResponse } from "next/server";
import { readSessionToken } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { supportService } from "@/server/services/support.service";

// Pure pass-through: the daily limit and the message rules live in the backend.
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
    await supportService.send(token, {
      category: body.category as never,
      message: body.message as never,
    }),
  );
});
