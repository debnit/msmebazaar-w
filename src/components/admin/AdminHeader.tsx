
"use client";

import Link from "next/link";
import {
    Briefcase,
    Home,
    FileText,
    Banknote,
    Users,
    PanelLeft,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { logout } from "@/lib/auth-actions";
import { useParams, useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";


export default function AdminHeader() {
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as Locale;

    const handleLogout = async () => {
        await logout();
        router.push(`/${lang}/login`);
    };

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                    <nav className="grid gap-2 text-lg font-medium">
                        <Link
                            href={`/${lang}/admin`}
                            className="flex items-center gap-2 text-lg font-semibold mb-4"
                        >
                            <Briefcase className="h-6 w-6" />
                            <span className="sr-only">Admin Panel</span>
                        </Link>
                        <Link
                            href={`/${lang}/admin`}
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                            <Home className="h-5 w-5" />
                            Dashboard
                        </Link>
                        <Link
                            href={`/${lang}/admin/enquiries`}
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                            <FileText className="h-5 w-5" />
                            Enquiries
                        </Link>
                        <Link
                            href={`/${lang}/admin/loans`}
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                            <Briefcase className="h-5 w-5" />
                            Loan Applications
                        </Link>
                        <Link
                            href={`/${lang}/admin/payments`}
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                            <Banknote className="h-5 w-5" />
                            Payments
                        </Link>
                        <Link
                            href={`/${lang}/admin/users`}
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                            <Users className="h-5 w-5" />
                            Users
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>

            <div className="w-full flex-1">
                {/* Can add a search bar here if needed */}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <Users className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
