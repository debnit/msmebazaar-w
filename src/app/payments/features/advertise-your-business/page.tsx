
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function AdvertiseFeaturePage() {
    const router = useRouter();
    
    const handlePayment = () => {
        router.push("/payments?service=Advertise+Your+Business");
    }

    const features = [
        "Reach a Wider Audience",
        "Targeted Local Advertising",
        "Professional Online Profile",
        "Boost Sales & Enquiries",
        "Dedicated Support"
    ];

    return (
        <div className="bg-background">
            <div className="container py-12 md:py-24">
                {/* Hero section for the feature */}
                <section className="text-center">
                    <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
                        Get Your Business Noticed
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Supercharge your sales and expand your digital footprint with MSMEConnect's powerful advertising solutions.
                    </p>
                </section>
                
                {/* Demo/Visual section */}
                <section className="mt-16">
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                                <div className="p-8 md:p-12 order-2 md:order-1">
                                    <h2 className="font-headline text-3xl font-bold text-primary">From Local to Vocal</h2>
                                    <p className="mt-4 text-muted-foreground">
                                        Imagine your products and services in front of thousands of potential customers. We create a professional online profile for your business, optimized for search engines and social media, driving real-world results.
                                    </p>
                                    <ul className="mt-6 space-y-3">
                                        {features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-3">
                                                <Check className="h-5 w-5 text-green-500" />
                                                <span className="text-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="order-1 md:order-2">
                                     <Image
                                        src="https://picsum.photos/seed/digital-growth/800/600"
                                        alt="Digital growth and sales chart"
                                        width={800}
                                        height={600}
                                        className="object-cover w-full h-full"
                                        data-ai-hint="digital growth"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Pricing and CTA */}
                <section className="mt-16 max-w-lg mx-auto">
                    <Card>
                        <CardHeader className="text-center">
                             <CardTitle className="font-headline text-2xl">Limited Time Offer</CardTitle>
                             <CardDescription>Get started today and put your business on the map.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-5xl font-bold text-primary">₹99</p>
                            <p className="text-muted-foreground">One-time setup fee</p>
                        </CardContent>
                        <CardFooter>
                            <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handlePayment}>
                                Proceed to Payment
                            </Button>
                        </CardFooter>
                    </Card>
                </section>
            </div>
        </div>
    );
}
