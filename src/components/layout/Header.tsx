
"use server"

import Link from "next/link";
import { UserCircle, LogOut, LayoutDashboard, Bell, Shield, FileText } from "lucide-react";
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
import type { Session } from "@/types/auth";
import { headers } from "next/headers";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navLinks = [
  { href: "/loan-application", label: "Loans" },
  { href: "/payments", label: "Payments" },
  { href: "/business-plan", label: "AI Business Plan" },
  { href: "/agents", label: "Become an Agent" },
  { href: "/enquiry", label: "Enquiry" },
];

const NavLink = ({ href, label, pathname }: { href: string; label: string; pathname: string }) => (
  <Link
    href={href}
    className={cn(
      "text-sm font-medium transition-colors hover:text-primary",
      pathname === href ? "text-primary" : "text-muted-foreground"
    )}
  >
    {label}
  </Link>
);

export default async function Header({ session }: { session: Session | null }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || "";

  const handleLogout = async () => {
    "use server"
    await logout();
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="hidden items-center space-x-6 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} pathname={pathname} />
            ))}
             {session?.user && (
                <NavLink href="/dashboard" label="Dashboard" pathname={pathname} />
            )}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.profilePictureUrl || undefined} alt={session.user.name || "User"} />
                    <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
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
                    <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/notifications">
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
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/register">Register</Link>
              </Button>
            </nav>
          )}
          <MobileNav session={session} navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}
