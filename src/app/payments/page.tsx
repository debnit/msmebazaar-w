
"use client";

import { useEffect, useState } from "react";
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
import { CreditCard, Star, BarChart, Route, Wallet, Loader2 } from "lucide-react";
import RazorpayCheckout from "@/components/RazorpayCheckout";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const serviceIcons: { [key: string]: React.ReactNode } = {
  "Pro-Membership": <Star className="h-8 w-8 text-primary" />,
  "Valuation Service": <BarChart className="h-8 w-8 text-primary" />,
  "Exit Strategy (NavArambh)": <Route className="h-8 w-8 text-primary" />,
};

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type PaymentDetails = {
  amount: number;
  serviceName: string;
} | null;

export default function PaymentsPage() {
  const [fixedServices, setFixedServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [customAmount, setCustomAmount] = useState("");
  const [customServiceName, setCustomServiceName] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isProcessingWallet, setIsProcessingWallet] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchServicesAndBalance = async () => {
      setLoadingServices(true);
      try {
        // Fetch services
        await new Promise(res => setTimeout(res, 500));
        setFixedServices([
          { id: '1', name: "Pro-Membership", description: "Unlock exclusive features and support.", price: 99 },
          { id: '2', name: "Valuation Service", description: "Get a professional valuation for your business.", price: 199 },
          { id: '3', name: "Exit Strategy (NavArambh)", description: "Plan your business exit with expert guidance.", price: 299 },
        ]);
        
        // Fetch wallet balance
        const response = await fetch('/api/user/dashboard');
        if (response.ok) {
          const data = await response.json();
          setWalletBalance(data.user.walletBalance);
        }

      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServicesAndBalance();
  }, []);

  const handlePay = (amount: number, serviceName: string) => {
    setPaymentDetails({ amount, serviceName });
  };
  
  const handlePayWithWallet = async (amount: number, serviceName: string, serviceId: string) => {
    setIsProcessingWallet(serviceId);
    try {
      const response = await fetch('/api/payment/wallet-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, serviceName }),
      });
      const data = await response.json();
      if(response.ok) {
        toast({
          title: "Payment Successful",
          description: `Paid for ${serviceName} using wallet balance.`,
        });
        router.push('/payments/success');
      } else {
         toast({
          title: "Payment Failed",
          description: data.error || "Could not process payment with wallet.",
          variant: "destructive"
        });
      }
    } catch (error) {
       toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingWallet(null);
    }
  };

  const handleCustomPay = () => {
    const amount = parseFloat(customAmount);
    if (amount > 0 && customServiceName) {
      if (walletBalance !== null && amount <= walletBalance) {
         handlePayWithWallet(amount, customServiceName, 'custom');
      } else {
         handlePay(amount, customServiceName);
      }
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
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {loadingServices ? (
            <>
              <Card><CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent><CardFooter><Skeleton className="h-10 w-full" /></CardFooter></Card>
              <Card><CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent><CardFooter><Skeleton className="h-10 w-full" /></CardFooter></Card>
            </>
          ) : (
            fixedServices.map((service) => {
              const canPayWithWallet = walletBalance !== null && walletBalance >= service.price;
              const isProcessing = isProcessingWallet === service.id;
              
              return (
              <Card key={service.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  {serviceIcons[service.name] || <CreditCard className="h-8 w-8 text-primary" />}
                  <div>
                    <CardTitle className="font-headline">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(service.price)}</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  {canPayWithWallet ? (
                     <Button className="w-full" onClick={() => handlePayWithWallet(service.price, service.name, service.id)} disabled={isProcessing}>
                       {isProcessing ? <Loader2 className="animate-spin" /> : <Wallet className="mr-2" />}
                       Pay with Wallet (Balance: ₹{walletBalance.toFixed(2)})
                     </Button>
                  ) : (
                    <Button className="w-full" onClick={() => handlePay(service.price, service.name)}>
                      Pay Now
                    </Button>
                  )}
                  {!canPayWithWallet && walletBalance !== null && walletBalance > 0 && (
                    <p className="text-xs text-muted-foreground">Insufficient wallet balance (₹{walletBalance.toFixed(2)})</p>
                  )}
                </CardFooter>
              </Card>
            )})
          )}
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
               {walletBalance !== null && (
                 <div className="text-sm text-muted-foreground flex items-center gap-2">
                   <Wallet size={16} /> 
                   <span>Available Balance: ₹{walletBalance.toFixed(2)}</span>
                 </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
                onClick={handleCustomPay}
                disabled={isProcessingWallet === 'custom' || !customAmount || !customServiceName}
              >
                 {isProcessingWallet === 'custom' ? <Loader2 className="animate-spin" /> : null}
                Proceed to Pay
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
