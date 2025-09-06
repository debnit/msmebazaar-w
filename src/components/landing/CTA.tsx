import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container">
        <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 text-center shadow-lg">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            Ready to Grow Your Business?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Join thousands of MSMEs who trust us to power their growth. Get started today with a simple registration.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/register">Register Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
