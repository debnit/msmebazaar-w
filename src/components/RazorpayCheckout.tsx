
"use client";

import { useEffect, useState } from "react";
import useScript from "@/hooks/use-script";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
        try {
            // 1. Create Order
            const orderRes = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });

            if (!orderRes.ok) {
                const errorData = await orderRes.json();
                if (orderRes.status === 401) {
                    toast({
                        title: "Authentication Error",
                        description: "Please log in to make a payment.",
                        variant: "destructive",
                    });
                    router.push(`/login`);
                } else {
                    throw new Error(errorData.error || "Failed to create payment order.");
                }
                return;
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
                        if(serviceName === "Pro-Membership") {
                            router.push(`/payments/pro-onboarding`);
                        } else if (serviceName === "Valuation Service") {
                            router.push(`/payments/valuation-onboarding?paymentId=${verificationData.paymentId}`);
                        } else {
                            router.push(`/payments/success`);
                        }
                    } else {
                        router.push(`/payments/failure`);
                    }
                },
                prefill: {
                    name: "John Doe",
                    email: "john.doe@example.com",
                    contact: "9999999999",
                },
                notes: {
                    service: serviceName,
                },
                theme: {
                    color: "#3399cc",
                },
                modal: {
                    ondismiss: function() {
                        // Redirect to failure if user closes the modal
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
