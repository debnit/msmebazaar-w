
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, Shield, Handshake } from "lucide-react";
import Link from "next/link";

const agentBenefits = [
    {
        icon: <Zap className="h-10 w-10 text-primary" />,
        title: "Competitive Commissions",
        description: "Earn attractive commissions on every successful deal you bring to the platform. Our transparent structure ensures you are rewarded for your efforts.",
    },
    {
        icon: <Shield className="h-10 w-10 text-primary" />,
        title: "Access Exclusive Deals",
        description: "Get access to a pipeline of curated loan applications, valuation requests, and exit strategy clients that are not available elsewhere.",
    },
    {
        icon: <Handshake className="h-10 w-10 text-primary" />,
        title: "Marketing & Sales Support",
        description: "Leverage our brand and marketing materials to build credibility and attract more clients. We provide the support you need to close deals.",
    },
    {
        icon: <CheckCircle className="h-10 w-10 text-primary" />,
        title: "Dedicated Agent Portal",
        description: "Track your leads, manage your pipeline, and monitor your earnings through our easy-to-use agent dashboard.",
    },
];

export default function AgentsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-card">
        <div className="container py-12 md:py-24 text-center">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary">
            Partner with Us. Grow Your Business.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Join the MSMEConnect Agent Network and unlock a new stream of revenue by connecting businesses with the financial solutions they need.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/register">Become an Agent Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-24 bg-background">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
              Why Become an MSMEConnect Agent?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We provide you with the tools, support, and opportunities to succeed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {agentBenefits.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="items-center">
                  <div className="p-4 bg-secondary rounded-full group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h3 className="font-headline text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-card">
      <div className="container">
        <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 text-center shadow-lg">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            The registration process is quick and easy. Join our network today and start earning.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/register">Register as an Agent</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
