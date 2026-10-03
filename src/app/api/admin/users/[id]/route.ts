import { NextResponse, type NextRequest } from "next/server";
import { readSessionToken } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { adminService } from "@/server/services/admin.service";

type Context = { params: Promise<{ id: string }> };

// Pure pass-through: role/plan rules (admin-only, master protected) live in
// the backend.
export async function PATCH(request: NextRequest, context: Context) {
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
      await adminService.updateAccess(token, id, {
        role: body.role as never,
        plan: body.plan as never,
      }),
    );
  })(request);
}
