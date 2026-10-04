import { NextResponse, type NextRequest } from "next/server";
import { readSessionToken } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { profilesService } from "@/server/services/profiles.service";

type Context = { params: Promise<{ id: string }> };

function sessionExpired() {
  return errorResponse(401, {
    code: "AUTH_ACCESS_TOKEN_MISSING",
    message: "Sessão expirada.",
  });
}

// Pure pass-through: ownership and the name rules are checked by the backend.
export async function PATCH(request: NextRequest, context: Context) {
  const { id } = await context.params;
  return bffRoute(async (req) => {
    const token = await readSessionToken();
    if (!token) return sessionExpired();
    const body = (await req.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    return NextResponse.json(
      await profilesService.rename(token, id, body.name as never),
    );
  })(request);
}

export async function DELETE(request: NextRequest, context: Context) {
  const { id } = await context.params;
  return bffRoute(async () => {
    const token = await readSessionToken();
    if (!token) return sessionExpired();
    return NextResponse.json(await profilesService.remove(token, id));
  })(request);
}
