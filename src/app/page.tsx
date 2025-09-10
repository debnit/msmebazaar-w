import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/CTA';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const GetTheApp = () => {
  // This URL can be updated to a smart link that directs to the correct app store
  const appUrl = "https://msmeconnect.com/mobile"; 
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(appUrl)}`;

  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
             <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
              Take MSMEConnect With You
            </h2>
            <p className="text-lg text-muted-foreground">
              Get our mobile app for a seamless experience on the go. Manage your finances, track applications, and make payments anytime, anywhere.
            </p>
            <div className='flex gap-4'>
                <Button asChild size="lg" variant="outline">
                    <Link href="#">App Store</Link>
                </Button>
                 <Button asChild size="lg" variant="outline">
                    <Link href="#">Google Play</Link>
                </Button>
            </div>
          </div>
           <div className="flex justify-center items-center">
             <div className="bg-card p-6 rounded-lg shadow-lg text-center">
                <Image
                  src={qrCodeUrl}
                  alt="Download the MSMEConnect mobile app"
                  width={150}
                  height={150}
                />
                <p className="mt-4 text-sm text-muted-foreground font-semibold">Scan to Download</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <Testimonials />
      <GetTheApp />
      <CTA />
    </div>
  );
}
