
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

async function getPayments() {
  const payments = await prisma.paymentTransaction.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  })
  return payments
}

export default async function PaymentsPage() {
  const payments = await getPayments()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Transactions</CardTitle>
        <CardDescription>
          A list of all payment transactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Payment ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <div className="font-medium">{payment.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {payment.user.email}
                  </div>
                </TableCell>
                <TableCell>{payment.serviceName}</TableCell>
                <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge 
                    variant={payment.status === 'Success' ? 'default' : 'destructive'}
                    className={payment.status === 'Success' ? 'bg-green-500' : ''}
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">{payment.razorpayPaymentId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
