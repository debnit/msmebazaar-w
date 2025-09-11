
"use server"

import Link from "next/link";
import { Menu, X, UserCircle, LogOut, LayoutDashboard, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth-actions";
import { MobileNav } from "./MobileNav";
import { Session } from "jose";
import LanguageSwitcher from "../LanguageSwitcher";
import { i18n, Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/dictionary";

const navLinks = [
  { href: "/loan-application", label: "loans" },
  { href: "/payments", label: "payments" },
  { href: "/enquiry", label: "enquiry" },
  { href: "/dashboard", label: "dashboard" },
];

const NavLink = ({ href, label, pathname, lang }: { href: string; label: string; pathname: string, lang: string }) => (
  <Link
    href={`/${lang}${href}`}
    className={cn(
      "text-sm font-medium transition-colors hover:text-primary",
      pathname.startsWith(`/${lang}${href}`) ? "text-primary" : "text-muted-foreground"
    )}
  >
    {label}
  </Link>
);

export default async function Header({ session, lang }: { session: Session | null, lang: Locale }) {
  const pathname = ""; // Placeholder for current path
  const dict = await getDictionary(lang);

  const handleLogout = async () => {
    "use server"
    await logout();
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href={`/${lang}`} className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="hidden items-center space-x-6 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={dict.header[link.label as keyof typeof dict.header]} pathname={pathname} lang={lang} />
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <LanguageSwitcher />
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <UserCircle className="h-8 w-8" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {session.user.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href={`/${lang}/admin`}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href={`/${lang}/dashboard`}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${lang}/notifications`}>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action={handleLogout}>
                    <button type="submit" className="w-full">
                        <DropdownMenuItem>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                    </button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="hidden items-center space-x-2 md:flex">
              <Button asChild variant="ghost">
                <Link href={`/${lang}/login`}>{dict.header.login}</Link>
              </Button>
              <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href={`/${lang}/register`}>{dict.header.register}</Link>
              </Button>
            </nav>
          )}
          <MobileNav session={session} navLinks={navLinks.map(link => ({...link, label: dict.header[link.label as keyof typeof dict.header]}))} lang={lang} />
        </div>
      </div>
    </header>
  );
}
