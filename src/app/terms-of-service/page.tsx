
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="container py-12 md:py-24">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Terms of Service</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="prose prose-sm md:prose-base max-w-none">
          <h2>1. Agreement to Terms</h2>
          <p>
            By using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our services.
          </p>
          
          <h2>2. Services</h2>
          <p>
            MSMEConnect provides a platform for financial services, including but not limited to loan applications, business valuations, and payment processing. We are not a financial institution and partner with third-party providers to facilitate these services.
          </p>

          <h2>3. User Responsibilities</h2>
          <p>
            You agree to provide accurate and current information when using our services. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
          </p>

          <h2>4. Limitation of Liability</h2>
          <p>
            In no event shall MSMEConnect, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>

          <h2>5. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>

           <h2>6. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us via our <a href="/enquiry">enquiry page</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
