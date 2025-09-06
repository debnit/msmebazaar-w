import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailurePage() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-headline mt-4">Payment Failed</CardTitle>
          <CardDescription>Unfortunately, your payment could not be processed.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please check your payment details and try again. If the problem persists, please contact our support team.
          </p>
          <Button asChild className="mt-8 w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/payments">Try Again</Link>
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
