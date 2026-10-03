import { NextResponse } from "next/server";
import { readSessionToken } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { followersService } from "@/server/services/followers.service";
import type { FollowerEventType, FollowerStatus } from "@/shared/contracts/api";

// Options for the "filter by follower" combobox while the user types.
// Params are forwarded as-is: the backend validates status/type/search.
export const GET = bffRoute(async (request) => {
  const token = await readSessionToken();
  if (!token) {
    return errorResponse(401, {
      code: "AUTH_ACCESS_TOKEN_MISSING",
      message: "Sessão expirada.",
    });
  }

  const params = request.nextUrl.searchParams;
  const scope = params.get("scope");
  const search = params.get("search") ?? undefined;

  if (scope === "followers") {
    const status = (params.get("status") ?? undefined) as
      FollowerStatus | undefined;
    return NextResponse.json(
      await followersService.filterOptions(token, { status, search }),
    );
  }
  if (scope === "events") {
    const type = (params.get("type") ?? undefined) as
      FollowerEventType | undefined;
    return NextResponse.json(
      await followersService.eventFilterOptions(token, { type, search }),
    );
  }

  return errorResponse(400, {
    code: "VALIDATION_FAILED",
    message: "scope deve ser 'followers' ou 'events'.",
  });
});
