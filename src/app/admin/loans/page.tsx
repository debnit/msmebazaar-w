
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoanStatusUpdater } from '@/components/admin/LoanStatusUpdater'
import { getLoanApplications, LoanApplication } from '@/lib/admin-api'
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoanApplicationsPage() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    const result = await getLoanApplications();
    if(result) {
      setLoans(result);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Applications</CardTitle>
        <CardDescription>
          A list of all loan applications submitted by users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>
                  <div className="font-medium">{loan.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {loan.user.email}
                  </div>
                </TableCell>
                <TableCell>₹{loan.loanAmount.toLocaleString()}</TableCell>
                <TableCell>{loan.loanPurpose}</TableCell>
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
                <TableCell>{new Date(loan.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <LoanStatusUpdater loanId={loan.id} currentStatus={loan.status} onUpdate={fetchLoans} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
