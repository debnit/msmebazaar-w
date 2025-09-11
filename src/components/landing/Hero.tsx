
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-card">
      <div className="container grid md:grid-cols-2 gap-8 items-center py-12 md:py-24">
        <div className="space-y-6">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary">
            Unlock Your Business Potential
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            MSMEConnect provides fast, flexible financing and seamless payment solutions to help your small business thrive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/loan-application">Apply for a Loan</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/enquiry">Contact Sales</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-xl">
          <Image
            src="https://picsum.photos/seed/business/800/600"
            alt="Business meeting"
            fill
            className="object-cover"
            data-ai-hint="business meeting"
          />
          <div className="absolute inset-0 bg-primary/20"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
