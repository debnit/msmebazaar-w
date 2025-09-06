"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, UserCircle, LogOut, LayoutDashboard } from "lucide-react";
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
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getSession, logout } from "@/lib/auth-actions";

const navLinks = [
  { href: "/loan-application", label: "Loans" },
  { href: "/payments", label: "Payments" },
  { href: "/enquiry", label: "Enquiry" },
  { href: "/dashboard", label: "Dashboard" },
];

interface SessionUser {
  name: string;
  email: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [session, setSession] = React.useState<{ user: SessionUser } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    fetchSession();
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setSession(null);
    router.push('/login');
    router.refresh();
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname.startsWith(href) ? "text-primary" : "text-muted-foreground"
      )}
      onClick={() => setIsMenuOpen(false)}
    >
      {label}
    </Link>
  );
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="hidden items-center space-x-6 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
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
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="hidden items-center space-x-2 md:flex">
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/register">Register</Link>
              </Button>
            </nav>
          )}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="container md:hidden pb-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
             {!session?.user && (
              <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button asChild variant="outline">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
                  </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
