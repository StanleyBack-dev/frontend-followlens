import { NextResponse } from "next/server";
import { readSessionToken } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { syncService } from "@/server/services/sync.service";

// The backend can take up to its time budget to paginate the follower list.
export const maxDuration = 300;

export const POST = bffRoute(async () => {
  const token = await readSessionToken();
  if (!token) {
    return errorResponse(401, {
      code: "AUTH_ACCESS_TOKEN_MISSING",
      message: "Sessão expirada.",
    });
  }
  return NextResponse.json(await syncService.runManual(token));
});
