
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
  CardFooter,
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
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
});

export default function CreditScorePage() {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pan: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setScore(null);
    try {
      const response = await fetch("/api/credit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setScore(data.score);
        toast({
          title: "Score Checked",
          description: "Your CIBIL score has been fetched successfully.",
        });
      } else {
        throw new Error(data.error || "Failed to fetch score.");
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
      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">
              Check Your CIBIL Score
            </CardTitle>
            <CardDescription>
              Get your real-time credit score in just a few seconds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {score === null ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="pan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN Card Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ABCDE1234F"
                            {...field}
                            className="text-center text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {loading ? "Checking..." : "Get Score"}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">Your CIBIL Score is</p>
                <p className="text-7xl font-bold text-primary my-4">{score}</p>
                <div
                  className={`text-lg font-semibold ${
                    score > 750 ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {score > 750 ? "Excellent" : "Good"}
                </div>
                 <Button onClick={() => setScore(null)} className="mt-8">
                    Check Again
                </Button>
              </div>
            )}
          </CardContent>
           <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">
                    By submitting your PAN, you consent to MSMEConnect fetching your credit report from CIBIL.
                </p>
           </CardFooter>
        </Card>
      </div>
    </div>
  );
}
