
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "@/i18n-config";
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { getSession } from "./lib/auth";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()

  try {
    return matchLocale(languages, locales, i18n.defaultLocale)
  } catch (e) {
    return i18n.defaultLocale
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await getSession();

  // Skip middleware for API routes and public assets
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png')
  ) {
    return NextResponse.next();
  }
  
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    // Check if the user is authenticated and trying to access a protected route without locale
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
    if (session && isProtectedRoute) {
        return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
    }
    
    return NextResponse.rewrite(new URL(`/${locale}${pathname}`, request.url));
  }
  
  // Protect routes
  const currentLocale = pathname.split('/')[1] || i18n.defaultLocale;

  if (!session && (pathname.startsWith(`/${currentLocale}/admin`) || pathname.startsWith(`/${currentLocale}/dashboard`))) {
    const callbackUrl = request.nextUrl.pathname;
    const loginUrl = new URL(`/${currentLocale}/login`, request.url);
    if (!loginUrl.searchParams.has('callbackUrl')) {
        loginUrl.searchParams.set('callbackUrl', callbackUrl);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (session && (pathname.startsWith(`/${currentLocale}/login`) || pathname.startsWith(`/${currentLocale}/register`))) {
    return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|.*\\..*|api).*)',
  ],
}
