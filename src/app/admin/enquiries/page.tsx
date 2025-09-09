
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

async function getEnquiries() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  })
  return enquiries
}

export default async function EnquiriesPage() {
  const enquiries = await getEnquiries()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enquiries</CardTitle>
        <CardDescription>
          A list of all enquiries submitted by users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.map((enquiry) => (
              <TableRow key={enquiry.id}>
                <TableCell>
                  <div className="font-medium">{enquiry.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {enquiry.email}
                  </div>
                </TableCell>
                <TableCell>{enquiry.subject}</TableCell>
                <TableCell>
                  <Badge variant={enquiry.status === 'Closed' ? 'default' : 'secondary'}>
                    {enquiry.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(enquiry.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {/* Action buttons (e.g., View, Change Status) go here */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
