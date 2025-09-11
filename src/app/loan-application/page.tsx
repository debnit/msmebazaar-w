
import { LoanApplicationForm } from "@/components/LoanApplicationForm";

export default function LoanApplicationPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-headline font-bold tracking-tight text-primary sm:text-4xl">
            Streamlined Business Loan Application
          </h1>
          <p className="mt-2 text-lg leading-8 text-muted-foreground">
            Our simplified 3-step process makes getting the funding you need faster than ever. Complete the form to get started.
          </p>
        </div>
        <LoanApplicationForm />
      </div>
    </div>
  );
}
