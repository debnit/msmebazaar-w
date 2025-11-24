
"use client";

import { useEffect, useState } from "react";
import useScript from "@/hooks/use-script";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { getSession } from "@/lib/auth-actions";
import { Session } from "@/types/auth";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayCheckoutProps {
    amount: number;
    serviceName: string;
}

const RazorpayCheckout = ({ amount, serviceName }: RazorpayCheckoutProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);

    const [isScriptLoaded, isScriptLoadError] = useScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );

    useEffect(() => {
        if (isScriptLoadError) {
            toast({
                title: "Error",
                description: "Razorpay SDK could not be loaded. Please try again later.",
                variant: "destructive",
            });
            router.push(`/payments/failure`);
            return;
        }

        if (isScriptLoaded) {
            initiatePayment();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isScriptLoaded, isScriptLoadError]);

    const initiatePayment = async () => {
        setLoading(true);

        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
            toast({
                title: "Configuration Error",
                description: "Razorpay Key ID is not configured. Payment cannot be processed.",
                variant: "destructive",
            });
            router.push('/payments');
            return;
        }


        try {
            const session = await getSession();

            // 1. Create Order
            const orderRes = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });

            if (!orderRes.ok) {
                const errorData = await orderRes.json();
                throw new Error(errorData.error || "Failed to create payment order.");
            }

            const orderData = await orderRes.json();
            
            // 2. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "MSMEConnect",
                description: `Payment for ${serviceName}`,
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    const verificationRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            serviceName,
                            amount: orderData.amount,
                        }),
                    });
                    
                    const verificationData = await verificationRes.json();

                    if (verificationRes.ok) {
                        if (serviceName === "Quick Business Loan File Processing") {
                            // After successful payment for a loan, submit the stored application data
                            const storedData = localStorage.getItem('loanApplicationData');
                            if (storedData) {
                                const loanData = JSON.parse(storedData);
                                await fetch('/api/loan-application', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ ...loanData, paymentId: verificationData.paymentId }),
                                });
                                localStorage.removeItem('loanApplicationData');
                                router.push(`/payments/success`);
                            } else {
                                // If no data, something went wrong, but payment was made.
                                toast({ title: "Payment successful, but loan data was lost."});
                                router.push('/dashboard');
                            }
                        } else if (serviceName === "Valuation Service") {
                            router.push(`/payments/valuation-onboarding?paymentId=${verificationData.paymentId}`);
                        } else if (serviceName === "Exit Strategy (NavArambh)") {
                            router.push(`/payments/navarambh-onboarding?paymentId=${verificationData.paymentId}`);
                        } else if (serviceName === "Plant and Machinery") {
                             router.push(`/payments/plant-machinery-onboarding?paymentId=${verificationData.paymentId}`);
                        } else if (serviceName === "Advertise Your Business") {
                             router.push(`/payments/advertisement-onboarding?paymentId=${verificationData.paymentId}`);
                        } else {
                            router.push(`/payments/success`);
                        }
                    } else {
                        router.push(`/payments/failure`);
                    }
                },
                prefill: {
                    name: session?.user?.name || "Valued Customer",
                    email: session?.user?.email || "",
                    contact: "",
                },
                notes: {
                    service: serviceName,
                },
                theme: {
                    color: "#3399cc",
                },
                modal: {
                    ondismiss: function() {
                        // Redirect if user closes the modal
                        router.replace(`/payments`);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Payment initiation failed:", error);
            const errorMessage = error instanceof Error ? error.message : "An error occurred while initiating payment.";
            toast({
                title: "Payment Failed",
                description: errorMessage,
                variant: "destructive",
            });
            router.push(`/payments/failure`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Initializing secure payment...</p>
            </div>
        </div>
    );
};

export default RazorpayCheckout;
