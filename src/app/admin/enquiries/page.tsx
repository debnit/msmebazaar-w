
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
import { EnquiryStatusUpdater } from '@/components/admin/EnquiryStatusUpdater'
import { useEffect, useState } from 'react';
import { getEnquiries, Enquiry } from '@/lib/admin-api';
import { Skeleton } from '@/components/ui/skeleton';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    const result = await getEnquiries();
    if (result) {
        setEnquiries(result);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEnquiries();
  }, []);

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
            {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))
            ) : enquiries.map((enquiry) => (
              <TableRow key={enquiry.id}>
                <TableCell>
                  <div className="font-medium">{enquiry.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {enquiry.email}
                  </div>
                </TableCell>
                <TableCell>{enquiry.subject}</TableCell>
                <TableCell>
                   <Badge variant={enquiry.status === 'Closed' ? 'default' : enquiry.status === 'Pending' ? 'secondary': 'outline'}>
                    {enquiry.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(enquiry.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <EnquiryStatusUpdater enquiryId={enquiry.id} currentStatus={enquiry.status} onUpdate={fetchEnquiries}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
