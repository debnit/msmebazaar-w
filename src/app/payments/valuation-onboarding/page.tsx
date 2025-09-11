
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Upload } from "lucide-react";

const formSchema = z.object({
  turnover: z.coerce.number().min(1, { message: "Annual turnover is required." }),
  assets: z.string().min(10, { message: "Please provide details about your assets." }),
  liabilities: z.string().min(10, { message: "Please provide details about your liabilities." }),
  phone: z.string().min(10, { message: "A valid phone number is required." }),
  balanceSheet: z.any().optional(),
  gstReturns: z.any().optional(),
});

export default function ValuationOnboardingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      turnover: 0,
      assets: "",
      liabilities: "",
      phone: "",
    },
  });

  // Since we cannot handle file uploads, we'll just log them and send placeholder names
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // In a real app, you'd upload files to a service like S3 or Firebase Storage
    // and get back a URL. For this demo, we'll just use placeholder names.
    const balanceSheetUrl = values.balanceSheet?.[0]?.name ? `uploads/${values.balanceSheet[0].name}` : undefined;
    const gstReturnsUrl = values.gstReturns?.[0]?.name ? `uploads/${values.gstReturns[0].name}` : undefined;

    const payload = {
        ...values,
        paymentId,
        balanceSheetUrl,
        gstReturnsUrl,
    };
    delete payload.balanceSheet;
    delete payload.gstReturns;

    try {
      const response = await fetch('/api/user/valuation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Details Submitted!",
          description: "Thank you! Our team will be in touch with your valuation report soon.",
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
            <CardTitle className="text-2xl font-headline">Business Valuation Details</CardTitle>
            <CardDescription>
                Please provide the following financial details. Our team will prepare your valuation report and send it to your registered email/phone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="turnover"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Turnover (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="assets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Assets</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List your significant assets (e.g., machinery, property, inventory, cash reserves)."
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
                  name="liabilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Liabilities</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List your significant liabilities (e.g., bank loans, outstanding debts, accounts payable)."
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="A number our team can reach you on" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                    <FormField
                    control={form.control}
                    name="balanceSheet"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Balance Sheet (Optional)</FormLabel>
                        <FormControl>
                            <Input type="file" {...form.register("balanceSheet")} />
                        </FormControl>
                        <FormDescription>Latest audited balance sheet if available.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="gstReturns"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Annual GST Returns (Optional)</FormLabel>
                        <FormControl>
                            <Input type="file" {...form.register("gstReturns")} />
                        </FormControl>
                        <FormDescription>Last financial year's GST returns summary.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
               
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Submit Valuation Details'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
