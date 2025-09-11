
"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Session } from "jose";
import { Locale } from "@/i18n-config";


interface NavLink {
    href: string;
    label: string;
}

interface MobileNavProps {
    session: Session | null;
    navLinks: NavLink[];
    lang: Locale;
}

export function MobileNav({ session, navLinks, lang }: MobileNavProps) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const pathname = usePathname();

    const NavLinkItem = ({ href, label }: { href: string; label: string }) => (
        <Link
          href={`/${lang}${href}`}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname.startsWith(`/${lang}${href}`) ? "text-primary" : "text-muted-foreground"
          )}
          onClick={() => setIsMenuOpen(false)}
        >
          {label}
        </Link>
    );

    return (
        <>
            <Button
                variant="ghost"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <X /> : <Menu />}
            </Button>
            {isMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-card shadow-lg md:hidden animate-in fade-in-20">
                    <div className="container py-4">
                        <nav className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <NavLinkItem key={link.href} {...link} />
                            ))}
                            {!session?.user && (
                                <div className="flex flex-col space-y-2 pt-4 border-t">
                                    <Button asChild variant="outline">
                                        <Link href={`/${lang}/login`} onClick={() => setIsMenuOpen(false)}>Login</Link>
                                    </Button>
                                    <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                        <Link href={`/${lang}/register`} onClick={() => setIsMenuOpen(false)}>Register</Link>
                                    </Button>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
