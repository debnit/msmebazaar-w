import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HandCoins, FileText, Banknote, Rocket } from "lucide-react";

const features = [
  {
    icon: <HandCoins className="h-10 w-10 text-primary" />,
    title: "Quick Business Loans",
    description: "Access capital quickly with our streamlined loan application process. Get funds in as little as 24 hours.",
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Easy Enquiry",
    description: "Have questions? Our simple enquiry form connects you with our experts to get the answers you need.",
  },
  {
    icon: <Banknote className="h-10 w-10 text-primary" />,
    title: "Seamless Payments",
    description: "Integrate our secure payment gateway to accept payments from customers effortlessly. Powered by Razorpay.",
  },
  {
    icon: <Rocket className="h-10 w-10 text-primary" />,
    title: "Grow Your Business",
    description: "From registration to scaling, we provide the tools and financial support to fuel your growth journey.",
  },
];

const Features = () => {
  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            Solutions Tailored for Your Business
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We offer a comprehensive suite of services designed to meet the unique needs of micro, small, and medium enterprises.
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
