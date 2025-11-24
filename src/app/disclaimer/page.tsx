
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DisclaimerPage() {
  return (
    <div className="container py-12 md:py-24">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Disclaimer</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="prose prose-sm md:prose-base max-w-none">
          <p>
            The information provided by MSMEConnect on our website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
          </p>
          
          <h2>Financial Disclaimer</h2>
          <p>
            MSMEConnect is not a financial advisor. The content on this website is not intended to be a substitute for professional financial advice. Always seek the advice of a qualified professional with any questions you may have regarding a financial matter.
          </p>

          <h2>Third-Party Links Disclaimer</h2>
          <p>
            The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.
          </p>

          <h2>Errors and Omissions Disclaimer</h2>
          <p>
           While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, MSMEConnect is not responsible for any errors or omissions or for the results obtained from the use of this information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
