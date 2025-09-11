
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { i18n } from "@/i18n-config";
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()

  const locale = matchLocale(languages, locales, i18n.defaultLocale)
  return locale
}


export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes and static assets
  const publicPaths = ['/api/', '/_next/static/', '/_next/image', '/favicon.ico', '/sw.js', '/manifest.json'];
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }
  
  // Locale is present in the path, so we can proceed with auth checks
  const locale = pathname.split('/')[1];
  const session = await getSession();
  
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
  
  const isAuthPage = pathnameWithoutLocale === "/login" || pathnameWithoutLocale === "/register" || pathnameWithoutLocale === "/forgot-password" || pathnameWithoutLocale === "/sign-in";
  const isAdminPath = pathnameWithoutLocale.startsWith('/admin');

  // If user is logged in
  if (session) {
    const isAdmin = session.user?.isAdmin;

    // Redirect from auth pages
    if (isAuthPage) {
      const url = isAdmin ? `/${locale}/admin` : `/${locale}/dashboard`;
      return NextResponse.redirect(new URL(url, request.url));
    }

    // Redirect non-admins from admin paths
    if (isAdminPath && !isAdmin) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
    
    return NextResponse.next();
  }

  // If user is not logged in and path is protected, redirect to login
  const protectedPaths = ['/dashboard', '/loan-application', '/notifications', '/admin'];
  if (protectedPaths.some(p => pathnameWithoutLocale.startsWith(p))) {
    return NextResponse.redirect(new URL(`/${locale}/login?callbackUrl=${request.url}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\..*|sw.js).*)',
  ],
}
