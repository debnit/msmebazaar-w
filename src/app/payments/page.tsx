"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Landmark, Building } from "lucide-react";
import RazorpayCheckout from "@/components/RazorpayCheckout";

const fixedServices = [
  {
    icon: <Building className="h-8 w-8 text-primary" />,
    title: "Business Registration",
    description: "Complete package for registering your new business.",
    price: 4999,
  },
  {
    icon: <Landmark className="h-8 w-8 text-primary" />,
    title: "GST Filing (Quarterly)",
    description: "Hassle-free GST return filing by our experts.",
    price: 1499,
  },
];

type PaymentDetails = {
  amount: number;
  serviceName: string;
} | null;

export default function PaymentsPage() {
  const [customAmount, setCustomAmount] = useState("");
  const [customServiceName, setCustomServiceName] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(null);

  const handlePay = (amount: number, serviceName: string) => {
    setPaymentDetails({ amount, serviceName });
  };

  const handleCustomPay = () => {
    const amount = parseFloat(customAmount);
    if (amount > 0 && customServiceName) {
      handlePay(amount, customServiceName);
    }
  };
  
  if (paymentDetails) {
    return <RazorpayCheckout amount={paymentDetails.amount} serviceName={paymentDetails.serviceName} />;
  }

  return (
    <div className="container py-12 md:py-24">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-headline font-bold tracking-tight text-primary sm:text-4xl">
          Secure Payments
        </h1>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          Pay for our services or make a custom payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {fixedServices.map((service) => (
            <Card key={service.title}>
              <CardHeader className="flex flex-row items-center gap-4">
                {service.icon}
                <div>
                  <CardTitle className="font-headline">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">₹{service.price.toLocaleString('en-IN')}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handlePay(service.price, service.title)}>
                  Pay Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-primary" />
                Custom Payment
              </CardTitle>
              <CardDescription>
                Paying for a different service? Enter the details below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input 
                  id="service-name" 
                  placeholder="e.g., Consultation Fee" 
                  value={customServiceName}
                  onChange={(e) => setCustomServiceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="e.g., 500" 
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleCustomPay}>
                Proceed to Pay
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
