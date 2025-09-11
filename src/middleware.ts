
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

  // Skip middleware for API routes, static assets, and images
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
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
  
  // Redirect authenticated users from auth pages to dashboard
  const currentLocale = pathname.split('/')[1];
  if (session && (pathname.endsWith('/login') || pathname.endsWith('/register'))) {
      return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\..*|sw.js).*)',
  ],
}
