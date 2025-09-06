import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-headline mt-4">Payment Successful!</CardTitle>
          <CardDescription>Thank you for your payment.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your transaction has been completed successfully. A confirmation email and receipt have been sent to your registered email address.
          </p>
          <Button asChild className="mt-8 w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
