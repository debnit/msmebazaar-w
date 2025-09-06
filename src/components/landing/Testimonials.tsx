import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const testimonials = [
  {
    quote: "MSMEConnect transformed how we manage our finances. The loan process was incredibly fast and easy!",
    name: "Sunita Sharma",
    title: "Owner, Creative Weaves",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    quote: "The payment gateway integration was seamless. Our sales have increased since we started accepting online payments.",
    name: "Rajesh Kumar",
    title: "CEO, Tech Innovators",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
  },
  {
    quote: "Their team is always ready to help. The support we received during our GST registration was exceptional.",
    name: "Priya Singh",
    title: "Founder, Fresh Bakes",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
  },
  {
    quote: "A true partner for growth. MSMEConnect understands the challenges faced by small businesses and provides real solutions.",
    name: "Amit Patel",
    title: "Director, Patel Hardware",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026707d",
  },
];

const Testimonials = () => {
  return (
    <section className="py-12 md:py-24 bg-card">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            Trusted by Businesses Like Yours
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our customers have to say.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col justify-between">
                    <CardContent className="pt-6">
                      <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                    </CardContent>
                    <div className="flex items-center gap-4 p-6 bg-secondary/50">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
