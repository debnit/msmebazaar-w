
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HandCoins, FileText, Banknote, Rocket, Route, Award } from "lucide-react";

const features = [
  {
    icon: <Route className="h-10 w-10 text-primary" />,
    title: "NavArambh Exit Strategy",
    description: "Our flagship service provides comprehensive business valuation and strategic guidance for a profitable exit, ensuring you get the maximum value for your hard work.",
  },
  {
    icon: <HandCoins className="h-10 w-10 text-primary" />,
    title: "Quick Business Loans",
    description: "Access working capital, expand your operations, or purchase new equipment with our streamlined loan application process designed for the speed of business.",
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: "Referral Program",
    description: "Refer other MSMEs to our platform and earn rewards in your wallet. It's our way of saying thank you for helping our community grow.",
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Easy Enquiry & Support",
    description: "Our simple enquiry form connects you with our experts to get the answers and support you need to grow your business.",
  },
];

const Features = () => {
  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            A Complete Financial Toolkit for MSMEs
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From strategic exits to daily operations, we offer a comprehensive suite of services designed for your success.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center group hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center">
                <div className="p-4 bg-secondary rounded-full group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <h3 className="font-headline text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
