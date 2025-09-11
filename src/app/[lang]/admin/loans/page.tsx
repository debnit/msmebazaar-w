
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
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { LoanStatusUpdater } from '@/components/admin/LoanStatusUpdater'

async function getLoanApplications() {
  const loans = await prisma.loanApplication.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  })
  return loans
}

export default async function LoanApplicationsPage() {
  const loans = await getLoanApplications()

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
            {loans.map((loan) => (
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
                  <LoanStatusUpdater loanId={loan.id} currentStatus={loan.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
