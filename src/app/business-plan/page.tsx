
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';

const formSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  industry: z.string().min(3, "Industry is required"),
  targetAudience: z.string().min(3, "Target audience is required"),
});

export default function BusinessPlanPage() {
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      targetAudience: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setGeneratedPlan(null);
    try {
      const response = await fetch("/api/ai/business-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedPlan(data.plan);
        toast({
          title: "Plan Generated",
          description: "Your foundational business plan is ready.",
        });
      } else {
        throw new Error(data.error || "Failed to generate plan.");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-12 md:py-24">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">
              AI-Powered Business Plan Generator
            </CardTitle>
            <CardDescription>
              Answer a few simple questions, and our AI will create a foundational business plan to get you started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!generatedPlan ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What is the name of your business?</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Acme Innovations" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What industry is it in?</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Technology, Retail, Manufacturing" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Who is your target audience?</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Small business owners, students, local residents" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {loading ? "Generating..." : "Generate My Plan"}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown>{generatedPlan}</ReactMarkdown>
                <Button onClick={() => setGeneratedPlan(null)} className="mt-8">
                    Generate Another
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
