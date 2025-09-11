
import {
    Home,
    Briefcase,
    FileText,
    Banknote,
    Users,
    Gift,
    BarChart,
} from 'lucide-react'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/admin" className="flex items-center gap-2 font-semibold">
                            <Briefcase className="h-6 w-6" />
                            <span className="">Admin Panel</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Home className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/enquiries"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <FileText className="h-4 w-4" />
                                Enquiries
                            </Link>
                            <Link
                                href="/admin/loans"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Briefcase className="h-4 w-4" />
                                Loan Applications
                            </Link>
                            <Link
                                href="/admin/valuations"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <BarChart className="h-4 w-4" />
                                Valuations
                            </Link>
                            <Link
                                href="/admin/payments"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Banknote className="h-4 w-4" />
                                Payments
                            </Link>
                             <Link
                                href="/admin/redemptions"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Gift className="h-4 w-4" />
                                Redemptions
                            </Link>
                            <Link
                                href="/admin/users"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Users className="h-4 w-4" />
                                Users
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <AdminHeader />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
