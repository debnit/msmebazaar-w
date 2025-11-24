
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12 md:py-24">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Privacy Policy</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="prose prose-sm md:prose-base max-w-none">
          <p>
            MSMEConnect ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
          </p>
          
          <h2>1. Information We Collect</h2>
          <p>
            We may collect personal information that you voluntarily provide to us, including your name, email address, phone number, and financial information when you register, apply for a loan, or use our services. We also collect non-personal information, such as browser type, operating system, and website usage data.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, operate, and maintain our services.</li>
            <li>Process your transactions and manage your account.</li>
            <li>Improve, personalize, and expand our services.</li>
            <li>Communicate with you, including for customer service and to provide you with updates and other information relating to the website.</li>
            <li>For compliance purposes, including enforcing our Terms of Service, or other legal rights.</li>
          </ul>

          <h2>3. Sharing Your Information</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
          </p>

          <h2>4. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us via our <a href="/enquiry">enquiry page</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
