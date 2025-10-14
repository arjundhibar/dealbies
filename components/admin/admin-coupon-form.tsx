"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  discountCode: z.string().min(1, "Coupon code is required"),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  merchant: z.string().min(2, "Merchant name is required"),
  discountType: z.string().min(1, "Discount type is required"),
  discountValue: z.string().optional(),
  availability: z.string().min(1, "Availability is required"),
  couponUrl: z.string().url("Please enter a valid URL"),
  expiresAt: z.string().min(1, "Expiry date is required"),
  category: z.string().min(1, "Category is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface AdminCouponFormProps {
  coupon?: {
    id: string;
    discountCode: string;
    title: string;
    description: string;
    merchant: string | null;
    discountType: string;
    discountValue: number | null;
    availability: string;
    couponUrl: string;
    expiresAt: Date | null;
    category: string;
  };
}

export function AdminCouponForm({ coupon }: AdminCouponFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discountCode: coupon?.discountCode || "",
      title: coupon?.title || "",
      description: coupon?.description || "",
      merchant: coupon?.merchant || "",
      discountType: coupon?.discountType || "",
      discountValue: coupon?.discountValue?.toString() || "",
      availability: coupon?.availability || "",
      couponUrl: coupon?.couponUrl || "",
      expiresAt: coupon?.expiresAt
        ? new Date(coupon.expiresAt).toISOString().slice(0, 16)
        : "",
      category: coupon?.category || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const url = coupon
        ? `/api/admin/coupons/${coupon.id}`
        : "/api/admin/coupons";

      const method = coupon ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to save coupon");
      }

      toast({
        title: coupon ? "Coupon updated" : "Coupon created",
        description: coupon
          ? "The coupon has been updated successfully."
          : "The new coupon has been created successfully.",
      });

      router.push("/admin/coupons");
      router.refresh();
    } catch (error) {
      console.error("Error saving coupon:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the coupon.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="discountCode"
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. percentage, euro, freeShipping"
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
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Value (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 20"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. ONLINE, OFFLINE"
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Electronics, Fashion"
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
              name="couponUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/coupon"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    URL where users can redeem this coupon
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
                    <Input
                      type="datetime-local"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/coupons")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : coupon
                  ? "Update Coupon"
                  : "Create Coupon"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
