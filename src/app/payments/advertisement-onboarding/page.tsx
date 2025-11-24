
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  businessName: z.string().min(2, { message: "Business name is required." }),
  businessNature: z.string().min(3, { message: "Please describe the nature of your business." }),
  businessAddress: z.string().min(10, { message: "Please enter a valid business address." }),
  contactDetails: z.string().min(10, { message: "Please enter valid contact details (phone or email)." }),
  photos: z.any().optional(),
  videos: z.any().optional(),
});

export default function AdvertisementOnboardingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessNature: "",
      businessAddress: "",
      contactDetails: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // In a real app, you would upload files and get URLs.
    const photosUrl = values.photos?.[0]?.name ? `uploads/photos/${values.photos[0].name}` : undefined;
    const videosUrl = values.videos?.[0]?.name ? `uploads/videos/${values.videos[0].name}` : undefined;
    
    const payload = {
        businessName: values.businessName,
        businessNature: values.businessNature,
        businessAddress: values.businessAddress,
        contactDetails: values.contactDetails,
        photosUrl,
        videosUrl,
        paymentId,
    };

    try {
      const response = await fetch('/api/user/advertisement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Details Submitted!",
          description: "Thank you! Our team will get back to you in 15 minutes.",
        });
        router.push("/dashboard");
      } else {
        const data = await response.json();
        toast({
          title: "Submission Failed",
          description: data.error || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
     <div className="container py-12 md:py-24">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Advertise Your Business</CardTitle>
            <CardDescription>
                Fill in your business details below. Our team will use this to build your online presence.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Acme Innovations" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessNature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nature of Business</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Manufacturing, IT Services, Retail" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="businessAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Your full business address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="contactDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Info</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., your@email.com or +91 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                    <FormField
                    control={form.control}
                    name="photos"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Upload Photos (Optional)</FormLabel>
                        <FormControl>
                            <Input type="file" accept="image/*" multiple {...form.register("photos")} />
                        </FormControl>
                        <FormDescription>Upload images that represent your business.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="videos"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Upload Videos (Optional)</FormLabel>
                        <FormControl>
                            <Input type="file" accept="video/*" multiple {...form.register("videos")} />
                        </FormControl>
                        <FormDescription>Upload videos showcasing your products or services.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
               
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Submit Details'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
