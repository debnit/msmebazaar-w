
"use client";

import {
  ArrowUpRight,
  Banknote,
  Briefcase,
  FileText,
  Users,
} from 'lucide-react'
import Link from 'next/link'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react';
import { getAdminDashboardData, AdminDashboardData } from '@/lib/admin-api';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';
import { Locale } from '@/i18n-config';

const StatCard = ({ title, value, icon, loading }: { title: string, value: string, icon: React.ReactNode, loading: boolean }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{value}</div>}
        </CardContent>
    </Card>
);

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const lang = params.lang as Locale;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getAdminDashboardData();
      if (result) {
        setData(result);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={`₹${data?.totalRevenue?.toLocaleString() ?? '0'}`} icon={<Banknote className="h-4 w-4 text-muted-foreground" />} loading={loading} />
        <StatCard title="Total Users" value={data?.totalUsers?.toString() ?? '0'} icon={<Users className="h-4 w-4 text-muted-foreground" />} loading={loading} />
        <StatCard title="Loan Applications" value={`+${data?.totalLoans?.toString() ?? '0'}`} icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} loading={loading} />
        <StatCard title="Enquiries" value={`+${data?.totalEnquiries?.toString() ?? '0'}`} icon={<FileText className="h-4 w-4 text-muted-foreground" />} loading={loading} />
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
              <Link href={`/${lang}/admin/loans`}>
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
                 {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-5 w-20" /></TableCell>
                        </TableRow>
                    ))
                ) : data?.recentLoans?.map(loan => (
                    <TableRow key={loan.id}>
                        <TableCell>
                            <div className="font-medium">{loan.user.name}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                            {loan.user.email}
                            </div>
                        </TableCell>
                        <TableCell>₹{loan.loanAmount.toLocaleString()}</TableCell>
                        <TableCell>
                           <Badge
                             variant={
                                loan.status === 'Approved' ? 'default'
                                : loan.status === 'Rejected' ? 'destructive'
                                : 'secondary'
                              }
                              className={loan.status === 'Approved' ? 'bg-green-500' : ''}
                          >
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
             {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="grid gap-1 flex-1">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="h-5 w-1/4" />
                    </div>
                ))
            ) : data?.recentUsers?.map(user => (
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
