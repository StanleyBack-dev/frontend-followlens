import { NextResponse, type NextRequest } from "next/server";
import { readSessionToken } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { supportService } from "@/server/services/support.service";

type Context = { params: Promise<{ id: string }> };

// Pure pass-through: admin-only and the ticket state are checked by the backend.
export async function POST(request: NextRequest, context: Context) {
  const { id } = await context.params;
  return bffRoute(async () => {
    const token = await readSessionToken();
    if (!token) {
      return errorResponse(401, {
        code: "AUTH_ACCESS_TOKEN_MISSING",
        message: "Sessão expirada.",
      });
    }
    return NextResponse.json(await supportService.finalize(token, id));
  })(request);
}
