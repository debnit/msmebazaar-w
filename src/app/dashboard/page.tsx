"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2 } from "lucide-react";
import { getSession } from "@/lib/auth-actions";

interface Enquiry {
  id: string;
  subject: string;
  date: string;
  status: string;
}

interface LoanApplication {
  id: string;
  amount: string;
  date: string;
  status: string;
}

interface Payment {
  id: string;
  service: string;
  amount: string;
  date: string;
  status: string;
}

interface DashboardData {
  user: {
    name: string;
    email: string;
  };
  enquiries: Enquiry[];
  loanApplications: LoanApplication[];
  paymentTransactions: Payment[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/user/dashboard');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container py-12 flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return <div className="container py-12">Failed to load dashboard.</div>;
  }
  
  return (
    <div className="container py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {data.user.name}! Here's an overview of your account.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="enquiries">My Enquiries</TabsTrigger>
          <TabsTrigger value="loans">Loan Applications</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold">Name:</span> {data.user.name}</div>
                <div><span className="font-semibold">Email:</span> {data.user.email}</div>
              </div>
              <Button>Edit Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enquiries" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Enquiries</CardTitle>
              <CardDescription>A list of your recent enquiries.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enquiry ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.enquiries.length > 0 ? data.enquiries.map((enquiry) => (
                    <TableRow key={enquiry.id}>
                      <TableCell>{enquiry.id.substring(0, 8)}</TableCell>
                      <TableCell>{enquiry.subject}</TableCell>
                      <TableCell>{new Date(enquiry.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={enquiry.status === 'Answered' ? 'default' : 'secondary'}>{enquiry.status}</Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={4} className="text-center">No enquiries found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Applications</CardTitle>
              <CardDescription>Track the status of your loan applications.</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.loanApplications.length > 0 ? data.loanApplications.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell>{loan.id.substring(0, 8)}</TableCell>
                      <TableCell>₹{loan.amount}</TableCell>
                      <TableCell>{new Date(loan.date).toLocaleDateString()}</TableCell>
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
                    </TableRow>
                  )) : (
                     <TableRow><TableCell colSpan={4} className="text-center">No loan applications found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your history of transactions.</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.paymentTransactions.length > 0 ? data.paymentTransactions.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.id.substring(0, 8)}</TableCell>
                      <TableCell>{payment.service}</TableCell>
                      <TableCell>₹{payment.amount}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                      <Badge
                          variant={
                            payment.status === 'Success' ? 'default' : 'destructive'
                          }
                          className={payment.status === 'Success' ? 'bg-green-500' : ''}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.status === 'Success' && (
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Receipt
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={6} className="text-center">No payments found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
