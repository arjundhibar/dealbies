"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useData } from "@/lib/data-context";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface PostCouponFormProps {
  onSuccess?: () => void;
}

const formSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  merchant: z.string().min(2, "Merchant name is required"),
  logoUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  expiresAt: z.string().min(1, "Expiry date is required"),
  terms: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function PostCouponForm({ onSuccess }: PostCouponFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useData();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      title: "",
      description: "",
      merchant: "",
      logoUrl: "",
      expiresAt: "",
      terms: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      if (!currentUser) {
        throw new Error("You must be logged in to post a coupon");
      }

      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to post coupon");
      }

      const coupon = await response.json();

      toast({
        title: "Success!",
        description: "Your coupon has been posted.",
      });

      if (onSuccess) onSuccess();
      router.push(`/coupons/${coupon.slug || coupon.id}`);
    } catch (error: any) {
      console.error("Error posting coupon:", error);
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while posting the coupon.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. SUMMER20"
                    {...field}
                    className="font-mono uppercase"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  The code that users will enter at checkout
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="merchant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Merchant</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Amazon"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 20% off all summer items"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide details about the coupon..."
                  rows={3}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/logo.jpg"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                URL to the merchant's logo image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiresAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terms & Conditions (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any terms or restrictions for using this coupon..."
                  rows={2}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Posting..." : "Post Coupon"}
        </Button>
      </form>
    </Form>
  );
}
