
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/sign-in",
    "/enquiry",
    "/api/auth/login",
    "/api/auth/register",
    "/api/enquiry",
    "/api/auth/google",
    "/api/payment/create-order",
    "/api/payment/verify",
    "/payments/success",
    "/payments/failure"
  ];
  
  const isPublicPath = publicPaths.some(path => pathname === path) || pathname.startsWith('/api/auth/google/callback');
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/sign-in";
  const isAdminPath = pathname.startsWith('/admin');

  // If user is logged in
  if (session) {
    const isAdmin = session.user?.isAdmin;

    // Redirect from auth pages
    if (isAuthPage) {
      return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/dashboard", request.url));
    }

    // Redirect from landing page
    if (pathname === '/') {
        return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/dashboard", request.url));
    }

    // Handle admin route protection
    if (isAdminPath && !isAdmin) {
      // If a non-admin tries to access an admin path, redirect to user dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    return NextResponse.next();
  }

  // If user is not logged in
  if (!isPublicPath) {
    // Allow access to notifications API for webhooks/backend processes
    if (pathname.startsWith('/api/notifications')) {
      return NextResponse.next();
    }
    // Redirect all other protected routes to login
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
