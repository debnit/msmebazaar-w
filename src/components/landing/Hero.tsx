
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const Hero = () => {
  return (
    <section className="bg-card">
      <div className="container py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary">
            A Financial Partner for Every MSME
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're scaling up or planning your exit, we provide the tools and expertise to navigate your business journey.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* NavArambh Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/exit-strategy/800/400"
                  alt="Exit strategy planning"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  data-ai-hint="exit strategy"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <CardTitle className="font-headline text-2xl">Plan Your Perfect Exit with NavArambh</CardTitle>
              <CardDescription className="mt-2">
                Our flagship service provides comprehensive business valuation and strategic guidance for a profitable exit.
              </CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90">
                <Link href="/payments">Explore Exit Strategies</Link>
              </Button>
            </div>
          </Card>

          {/* Quick Loans Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/business-loan/800/400"
                  alt="Business loan for growth"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  data-ai-hint="business loan"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <CardTitle className="font-headline text-2xl">Fuel Your Growth with Quick Loans</CardTitle>
              <CardDescription className="mt-2">
                Fast, accessible business loans to help you scale your MSME, purchase equipment, or manage working capital.
              </CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
               <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/loan-application">Apply for a Loan</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
