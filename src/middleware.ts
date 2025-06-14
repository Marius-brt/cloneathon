import { getSession } from "@/lib/server/auth-utils";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const pathname = request.nextUrl.pathname;

  if (!session && !pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (session && pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest).*)"
  ]
};
