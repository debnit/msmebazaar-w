
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  method: z.string().min(1, "Please select a redemption method."),
  details: z.string().min(10, "Please enter valid redemption details."),
});

interface RedemptionDialogProps {
  balance: number;
  onSuccess: () => void;
}

export function RedemptionDialog({ balance, onSuccess }: RedemptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { method: "", details: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
        const response = await fetch('/api/user/redeem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...values, amount: balance }),
        });
        
        const data = await response.json();

        if (response.ok) {
            toast({
                title: "Request Submitted",
                description: "Your redemption request has been submitted for processing.",
            });
            onSuccess();
            setOpen(false);
            form.reset();
        } else {
            toast({
                title: "Submission Failed",
                description: data.error || "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    } catch (error) {
        toast({
            title: "Error",
            description: "An unexpected network error occurred.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={balance <= 0}>Redeem</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Redeem Wallet Balance</DialogTitle>
          <DialogDescription>
            Request a payout for your available balance of ₹{balance.toFixed(2)}.
            Requests are typically processed within 3-5 business days.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payout Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UPI">UPI ID</SelectItem>
                      <SelectItem value="AccountNumber">Bank Account</SelectItem>
                      <SelectItem value="Mobile">Mobile Number (PayTM/PhonePe)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.getValues("method") === 'UPI' ? 'UPI ID' : 
                     form.getValues("method") === 'AccountNumber' ? 'Account Number + IFSC' :
                     'Details'
                    }
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={
                        form.getValues("method") === 'UPI' ? 'yourname@okhdfcbank' : 
                        form.getValues("method") === 'AccountNumber' ? '1234567890 HDFC0001234' :
                        'Enter payout details'
                    } {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Request
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
