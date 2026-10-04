import { NextResponse } from "next/server";
import { readSessionToken, writeActiveProfileId } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Remembers which profile the UI is looking at. It is only a preference: the
// backend verifies on every call that the id belongs to the user.
export const POST = bffRoute(async (request) => {
  if (!(await readSessionToken())) {
    return errorResponse(401, {
      code: "AUTH_ACCESS_TOKEN_MISSING",
      message: "Sessão expirada.",
    });
  }
  const body = (await request.json().catch(() => ({}))) as { id?: unknown };
  if (typeof body.id !== "string" || !UUID.test(body.id)) {
    return errorResponse(400, {
      code: "BFF_INVALID_PROFILE",
      message: "Perfil inválido.",
    });
  }
  await writeActiveProfileId(body.id);
  return NextResponse.json({ ok: true });
});
