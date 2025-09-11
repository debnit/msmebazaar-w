
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
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  assetDetails: z.string().min(10, { message: "Please provide details about your assets." }),
  turnoverDetails: z.string().min(10, { message: "Please provide details about your turnover." }),
  loanDetails: z.string().min(10, { message: "Please provide details about any loans." }),
  problemDetails: z.string().min(10, { message: "Please describe the problems you are facing." }),
  contactDetails: z.string().min(10, { message: "A valid phone number or email is required." }),
});

export default function NavArambhOnboardingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetDetails: "",
      turnoverDetails: "",
      loanDetails: "",
      problemDetails: "",
      contactDetails: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    const payload = {
        ...values,
        paymentId,
    };

    try {
      const response = await fetch('/api/user/navarambh-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Details Submitted!",
          description: "Thank you! Our team will reach out to you within 5 minutes.",
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
            <CardTitle className="text-2xl font-headline">NavArambh Onboarding</CardTitle>
            <CardDescription>
                Please provide the following details so our team can prepare for your consultation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="assetDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List your significant business assets (e.g., machinery, property, inventory, cash reserves)."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="turnoverDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turnover Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide details about your annual turnover, monthly revenue, and profitability."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="loanDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any outstanding business loans, debts, or other liabilities."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="problemDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the key challenges or problems your business is currently facing."
                          className="min-h-[100px]"
                          {...field}
                        />
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
                      <FormLabel>Best Contact Details</FormLabel>
                      <FormControl>
                        <Input placeholder="A phone number or email for our team to reach you immediately." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Submit & Get a Call'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
