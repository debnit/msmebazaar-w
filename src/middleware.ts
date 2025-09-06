import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  
  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/login", "/register", "/enquiry", "/api/auth/login", "/api/auth/register", "/api/enquiry", "/payments/success", "/payments/failure", "/sign-in"];
  
  const isPublicPath = publicPaths.some(path => pathname === path || (path.endsWith('/') && pathname.startsWith(path))) || pathname.startsWith('/api/auth/google') || pathname.startsWith('/api/payment');

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
