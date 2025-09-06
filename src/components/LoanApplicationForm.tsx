"use client";

import { useState } from "react";
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
});

const businessInfoSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(1, "Please select a business type"),
  yearsInBusiness: z.coerce.number().min(0, "Years must be positive"),
  annualTurnover: z.coerce.number().min(0, "Turnover must be positive"),
});

const loanDetailsSchema = z.object({
  loanAmount: z.coerce.number().min(10000, "Loan amount must be at least ₹10,000"),
  loanPurpose: z.string().min(1, "Please select a loan purpose"),
});

const formSchema = personalInfoSchema.merge(businessInfoSchema).merge(loanDetailsSchema);

type FormData = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: "Personal Information", fields: Object.keys(personalInfoSchema.shape) as (keyof FormData)[] },
  { id: 2, title: "Business Information", fields: Object.keys(businessInfoSchema.shape) as (keyof FormData)[] },
  { id: 3, title: "Loan Details", fields: Object.keys(loanDetailsSchema.shape) as (keyof FormData)[] },
];

export function LoanApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "", email: "", phone: "", pan: "",
      businessName: "", businessType: "", yearsInBusiness: 0, annualTurnover: 0,
      loanAmount: 10000, loanPurpose: "",
    },
  });

  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep - 1].fields;
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  function onSubmit(values: FormData) {
    console.log(values);
    toast({
      title: "Application Submitted!",
      description: "We have received your loan application and will review it shortly.",
    });
    form.reset();
    setCurrentStep(1);
  }

  const progress = (currentStep / steps.length) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-headline">{steps[currentStep-1].title}</CardTitle>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="fullName" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="pan" render={({ field }) => ( <FormItem><FormLabel>PAN Card Number</FormLabel><FormControl><Input placeholder="ABCDE1234F" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
            )}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="businessName" render={({ field }) => ( <FormItem><FormLabel>Business Name</FormLabel><FormControl><Input placeholder="Acme Inc." {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="businessType" render={({ field }) => ( <FormItem><FormLabel>Type of Business</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select business type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem><SelectItem value="partnership">Partnership</SelectItem><SelectItem value="pvt-ltd">Private Limited</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="yearsInBusiness" render={({ field }) => ( <FormItem><FormLabel>Years in Business</FormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="annualTurnover" render={({ field }) => ( <FormItem><FormLabel>Annual Turnover (in ₹)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500000" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
            )}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="loanAmount" render={({ field }) => ( <FormItem><FormLabel>Loan Amount Required (in ₹)</FormLabel><FormControl><Input type="number" placeholder="e.g., 200000" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="loanPurpose" render={({ field }) => ( <FormItem><FormLabel>Purpose of Loan</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select loan purpose" /></SelectTrigger></FormControl><SelectContent><SelectItem value="working-capital">Working Capital</SelectItem><SelectItem value="expansion">Business Expansion</SelectItem><SelectItem value="equipment">Equipment Purchase</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
              </div>
            )}
            <CardFooter className="flex justify-between p-0 pt-6">
              {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={handlePrev}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              ) : <div></div>}
              {currentStep < steps.length ? (
                <Button type="button" onClick={handleNext} className="bg-primary hover:bg-primary/90">Next</Button>
              ) : (
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">Submit Application</Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
