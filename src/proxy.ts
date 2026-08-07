import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value;

  const isAuthenticated = !!(accessToken || isLoggedIn === "true");

  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password");

  const hasForceClear = request.nextUrl.searchParams.has("clear") || request.nextUrl.searchParams.has("expired");

  if (isAuthPage && isAuthenticated && !hasForceClear) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
  ],
};
