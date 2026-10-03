import { NextResponse, type NextRequest } from "next/server";
import { clearSession } from "@/server/auth/session";
import { bffRoute } from "@/server/http/route-handler";

export const POST = bffRoute(async () => {
  await clearSession();
  return NextResponse.json({ ok: true });
});

// Used by Server Components when the backend reports an expired session
// (cookies can't be modified during render).
export async function GET(request: NextRequest) {
  await clearSession();
  const target = new URL("/login", request.url);
  if (request.nextUrl.searchParams.get("reason") === "expired") {
    target.searchParams.set("expired", "1");
  }
  return NextResponse.redirect(target);
}
