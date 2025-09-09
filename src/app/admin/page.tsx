
import {
  Activity,
  ArrowUpRight,
  Banknote,
  Briefcase,
  FileText,
  Users,
} from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { prisma } from '@/lib/prisma'

async function getDashboardData() {
    const totalUsers = await prisma.user.count();
    const totalEnquiries = await prisma.enquiry.count();
    const totalLoans = await prisma.loanApplication.count();
    const totalRevenue = await prisma.paymentTransaction.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            status: 'Success',
        }
    });

    const recentLoans = await prisma.loanApplication.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
    });

    const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
    });

    return {
        totalUsers,
        totalEnquiries,
        totalLoans,
        totalRevenue: totalRevenue._sum.amount ?? 0,
        recentLoans,
        recentUsers
    }
}

export default async function AdminDashboard() {
    const data = await getDashboardData();
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loan Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.totalLoans}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enquiries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.totalEnquiries}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Loan Applications</CardTitle>
              <CardDescription>
                Recent loan applications from your users.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/admin/loans">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentLoans.map(loan => (
                    <TableRow key={loan.id}>
                        <TableCell>
                            <div className="font-medium">{loan.user.name}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                            {loan.user.email}
                            </div>
                        </TableCell>
                        <TableCell>₹{loan.loanAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant={loan.status === 'Approved' ? 'default' : loan.status === 'Rejected' ? 'destructive' : 'secondary'}>
                            {loan.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{new Date(loan.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Sign Ups</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {data.recentUsers.map(user => (
                <div key={user.id} className="flex items-center gap-4">
                    <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                        {user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {user.email}
                    </p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
