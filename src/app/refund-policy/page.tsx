
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RefundPolicyPage() {
  return (
    <div className="container py-12 md:py-24">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Refund Policy</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="prose prose-sm md:prose-base max-w-none">
          <p>
            At MSMEConnect, we are committed to providing our customers with high-quality services. This Refund Policy outlines the circumstances under which we will issue a refund.
          </p>
          
          <h2>1. Service Fees</h2>
          <p>
            Most of our services, including but not limited to "Quick Business Loan File Processing," "Advertise Your Business," "Valuation Service," and "Exit Strategy (NavArambh)," require a one-time processing fee. This fee covers the administrative and operational costs associated with initiating your service request.
          </p>

          <h2>2. Conditions for Refund</h2>
          <p>
            We offer a full refund of the service fee under the following conditions:
          </p>
          <ul>
            <li>
              <strong>No Service Rendered within 24 Hours:</strong> If we fail to initiate contact or begin processing your service request within 24 hours of successful payment, you are eligible for a full refund. To claim this, you must contact our support team.
            </li>
            <li>
              <strong>Service Non-Fulfillment:</strong> If MSMEConnect is unable to provide the promised service for reasons attributable to our internal processes or limitations, a full refund will be issued.
            </li>
            <li>
              <strong>Erroneous or Duplicate Transactions:</strong> In case of a duplicate or erroneous payment, please contact us immediately with transaction details. We will process a full refund for the extra amount upon verification.
            </li>
          </ul>

          <h2>3. Non-Refundable Scenarios</h2>
          <p>
            A refund will not be issued in the following cases:
          </p>
          <ul>
            <li>If you change your mind after the service process has been initiated.</li>
            <li>If your loan application or any other request is rejected by our partners or due to eligibility criteria not being met, as the fee is for processing, not for a guaranteed outcome.</li>
            <li>If you fail to provide the required information or documentation to proceed with the service after our team has contacted you.</li>
          </ul>

          <h2>4. How to Request a Refund</h2>
          <p>
            To request a refund, please contact our support team via our <a href="/enquiry">enquiry page</a> or by emailing us at [your-email@example.com] with your payment details and the reason for the refund request. Refund requests are processed within 5-7 business days.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions about our Refund Policy, please contact us at:
          </p>
          <ul>
            <li><strong>Phone:</strong> +91-8260895728</li>
            <li><strong>WhatsApp:</strong> +91-8260895728</li>
            <li><strong>Email:</strong> [your-email@example.com]</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
