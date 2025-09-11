
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const pathname = request.nextUrl.pathname;
  
  // Pass pathname in headers to be accessible in server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // Protect admin routes
  if (pathname.startsWith('/admin') && !session?.user?.isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Protect user dashboard, notifications and other user-specific pages
  const protectedUserRoutes = ['/dashboard', '/notifications', '/loan-application', '/credit-score', '/payments'];
  if (protectedUserRoutes.some(route => pathname.startsWith(route)) && !session?.user) {
     const url = request.nextUrl.clone()
     url.pathname = '/login'
     if (!url.searchParams.has('callbackUrl')) {
        url.searchParams.set('callbackUrl', pathname);
     }
     return NextResponse.redirect(url)
  }

  // Redirect authenticated users from login/register
  if (session?.user && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = ''; // clear any callbackUrl
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
