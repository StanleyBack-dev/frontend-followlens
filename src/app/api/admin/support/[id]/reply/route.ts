import { NextResponse, type NextRequest } from "next/server";
import { readSessionToken } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { supportService } from "@/server/services/support.service";

type Context = { params: Promise<{ id: string }> };

// Pure pass-through: admin-only and the reply rules are enforced by the backend.
export async function POST(request: NextRequest, context: Context) {
  const { id } = await context.params;
  return bffRoute(async (req) => {
    const token = await readSessionToken();
    if (!token) {
      return errorResponse(401, {
        code: "AUTH_ACCESS_TOKEN_MISSING",
        message: "Sessão expirada.",
      });
    }
    const body = (await req.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    return NextResponse.json(
      await supportService.reply(token, id, body.reply as never),
    );
  })(request);
}
