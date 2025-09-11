import { LoanApplicationForm } from "@/components/LoanApplicationForm";

export default function LoanApplicationPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-headline font-bold tracking-tight text-primary sm:text-4xl">
            Business Loan Application
          </h1>
          <p className="mt-2 text-lg leading-8 text-muted-foreground">
            Complete the following steps to apply for a business loan. It only takes a few minutes.
          </p>
        </div>
        <LoanApplicationForm />
      </div>
    </div>
  );
}
