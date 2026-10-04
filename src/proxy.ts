import { NextResponse, type NextRequest } from "next/server";

// Optimistic gate only: checks that a session cookie exists. The real
// authorization happens in the backend on every request.
const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "fl_session";

export function proxy(request: NextRequest) {
  if (!request.cookies.has(SESSION_COOKIE)) {
    const login = new URL("/login", request.url);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/accept-terms",
    "/unfollows/:path*",
    "/followers/:path*",
    "/imports/:path*",
    "/account/:path*",
    "/admin/:path*",
  ],
};
