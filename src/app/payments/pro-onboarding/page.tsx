
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  businessName: z.string().min(2, { message: "Business name is required." }),
  businessNature: z.string().min(3, { message: "Please describe the nature of your business." }),
  helpNeeded: z.string().min(1, { message: "Please select an area where you need help." }),
  consultationNotes: z.string().min(10, { message: "Please provide some details for your consultation." }),
});

export default function ProOnboardingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessNature: "",
      helpNeeded: "",
      consultationNotes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/pro-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: "Onboarding Complete!",
          description: "Thank you! We have received your details and will be in touch soon.",
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
            <CardTitle className="text-2xl font-headline">Welcome to Pro-Membership!</CardTitle>
            <CardDescription>
                To get started, please tell us a little about your business.
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
                      <FormLabel>Name of your Business</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Acme Innovations Pvt. Ltd." {...field} />
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
                  name="helpNeeded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What do you need help with right now?</FormLabel>
                       <FormControl>
                        <Input placeholder="e.g., Selling my products, Getting raw materials" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consultationNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Book a Consultation</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What would you like to discuss? Please suggest a few preferred time slots."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Complete Onboarding'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
