import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const protectedPath =
    path.startsWith("/dashboard") ||
    path.startsWith("/checkout");

  if (!protectedPath) {
    return NextResponse.next();
  }

  const token = req.cookies.get("guard_token")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*"]
};
