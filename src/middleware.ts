
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { i18n } from "./i18n-config";
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
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
       return NextResponse.next();
    }
    
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }


  const session = await getSession();
  
  // Removing locale from pathname
  const pathnameWithoutLocale = pathname.startsWith(`/${i18n.defaultLocale}`) 
      ? pathname.slice(`/${i18n.defaultLocale}`.length) 
      : pathname.slice(pathname.indexOf('/', 1));

  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/sign-in",
    "/enquiry",
    "/payments/success",
    "/payments/failure",
    "/credit-score",
    "/loan-application",
    "/payments",
  ];
  
  const isPublicPath = publicPaths.some(path => pathnameWithoutLocale === path || (pathnameWithoutLocale === '' && path === '/'));
  const isAuthPage = pathnameWithoutLocale === "/login" || pathnameWithoutLocale === "/register" || pathnameWithoutLocale === "/forgot-password" || pathnameWithoutLocale === "/sign-in";
  const isAdminPath = pathnameWithoutLocale.startsWith('/admin');

  // If user is logged in
  if (session) {
    const isAdmin = session.user?.isAdmin;

    // Redirect from auth pages
    if (isAuthPage) {
      return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/dashboard", request.url));
    }

    // Redirect from landing page
    if (pathnameWithoutLocale === '' || pathnameWithoutLocale === '/') {
        return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/dashboard", request.url));
    }

    // Handle admin route protection
    if (isAdminPath && !isAdmin) {
      // If a non-admin tries to access an admin path, redirect to user dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    return NextResponse.next();
  }

  // If user is not logged in and path is not public, redirect to login
  if (!isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
