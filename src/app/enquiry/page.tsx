
import { EnquiryForm } from "@/components/EnquiryForm";

export default function EnquiryPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-headline font-bold tracking-tight text-primary sm:text-4xl">
          Contact Our Experts
        </h1>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          Have a question or need assistance? Fill out the form below and our dedicated support team will get back to you shortly.
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-2xl">
        <EnquiryForm />
      </div>
    </div>
  );
}
