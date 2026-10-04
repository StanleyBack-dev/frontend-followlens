import { NextResponse } from "next/server";
import { readSessionToken } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { accountService } from "@/server/services/account.service";

function sessionExpired() {
  return errorResponse(401, {
    code: "AUTH_ACCESS_TOKEN_MISSING",
    message: "Sessão expirada.",
  });
}

// Schedules the deletion; the backend checks the typed e-mail confirmation.
export const POST = bffRoute(async (request) => {
  const token = await readSessionToken();
  if (!token) return sessionExpired();
  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  return NextResponse.json(
    await accountService.requestDeletion(token, body.confirmEmail as never),
  );
});

// Cancels a scheduled deletion.
export const DELETE = bffRoute(async () => {
  const token = await readSessionToken();
  if (!token) return sessionExpired();
  return NextResponse.json(await accountService.cancelDeletion(token));
});
