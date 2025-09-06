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
import { Download } from "lucide-react";

// Mock data
const enquiries = [
  { id: "ENQ001", subject: "Loan Interest Rates", date: "2023-10-26", status: "Answered" },
  { id: "ENQ002", subject: "Payment Gateway", date: "2023-10-24", status: "Pending" },
];

const loanApplications = [
  { id: "LOAN001", amount: "₹5,00,000", date: "2023-10-20", status: "Approved" },
  { id: "LOAN002", amount: "₹2,50,000", date: "2023-09-15", status: "Rejected" },
  { id: "LOAN003", amount: "₹10,00,000", date: "2023-10-25", status: "Processing" },
];

const payments = [
  { id: "PAY001", service: "Business Registration", amount: "₹1,499", date: "2023-10-18", status: "Success" },
  { id: "PAY002", service: "GST Filing", amount: "₹499", date: "2023-09-30", status: "Success" },
  { id: "PAY003", service: "Custom Service", amount: "₹2,000", date: "2023-10-22", status: "Failed" },
];

export default function DashboardPage() {
  return (
    <div className="container py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, John! Here's an overview of your account.</p>
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
                <div><span className="font-semibold">Name:</span> John Doe</div>
                <div><span className="font-semibold">Email:</span> john.doe@example.com</div>
                <div><span className="font-semibold">Phone:</span> +91 98765 43210</div>
                <div><span className="font-semibold">Member Since:</span> January 1, 2023</div>
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
                  {enquiries.map((enquiry) => (
                    <TableRow key={enquiry.id}>
                      <TableCell>{enquiry.id}</TableCell>
                      <TableCell>{enquiry.subject}</TableCell>
                      <TableCell>{enquiry.date}</TableCell>
                      <TableCell>
                        <Badge variant={enquiry.status === 'Answered' ? 'default' : 'secondary'}>{enquiry.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  {loanApplications.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell>{loan.id}</TableCell>
                      <TableCell>{loan.amount}</TableCell>
                      <TableCell>{loan.date}</TableCell>
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
                  ))}
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
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>{payment.service}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.date}</TableCell>
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
