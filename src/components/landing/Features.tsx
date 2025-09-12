
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HandCoins, FileText, Banknote, Rocket, Route, Award, BrainCircuit, Megaphone } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Route className="h-10 w-10 text-primary" />,
    title: "NavArambh Exit Strategy",
    description: "Our flagship service provides comprehensive business valuation and strategic guidance for a profitable exit, ensuring you get the maximum value for your hard work.",
    href: "/payments"
  },
  {
    icon: <Megaphone className="h-10 w-10 text-primary" />,
    title: "Advertise Your Business",
    description: "Get your business noticed by the right people. We help create and boost your online presence to reach a wider audience and grow your customer base.",
    href: "/payments"
  },
  {
    icon: <BrainCircuit className="h-10 w-10 text-primary" />,
    title: "AI Business Plan Generator",
    description: "Generate a foundational business plan in minutes. Our AI helps you structure your ideas, analyze your market, and create a professional plan to guide your venture.",
    href: "/business-plan"
  },
  {
    icon: <HandCoins className="h-10 w-10 text-primary" />,
    title: "Quick Business Loans",
    description: "Access working capital, expand your operations, or purchase new equipment with our streamlined loan application process designed for the speed of business.",
    href: "/loan-application"
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: "Referral Program",
    description: "Refer other MSMEs to our platform and earn rewards in your wallet. It's our way of saying thank you for helping our community grow.",
    href: "/register"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
             <Link href={feature.href} key={index} className="flex">
                <Card className="text-center group hover:shadow-xl transition-shadow duration-300 flex flex-col w-full">
                  <CardHeader className="items-center">
                    <div className="p-4 bg-secondary rounded-full group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 flex-grow">
                    <h3 className="font-headline text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
