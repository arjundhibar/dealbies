"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  merchant: z.string().min(2, "Merchant name is required"),
  logoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  expiresAt: z.string().min(1, "Expiry date is required"),
  terms: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AdminCouponFormProps {
  coupon?: {
    id: string
    code: string
    title: string
    description: string
    merchant: string
    logoUrl: string | null
    expiresAt: Date
    terms: string | null
  }
}

export function AdminCouponForm({ coupon }: AdminCouponFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: coupon?.code || "",
      title: coupon?.title || "",
      description: coupon?.description || "",
      merchant: coupon?.merchant || "",
      logoUrl: coupon?.logoUrl || "",
      expiresAt: coupon?.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : "",
      terms: coupon?.terms || "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)

    try {
      const url = coupon ? `/api/admin/coupons/${coupon.id}` : "/api/admin/coupons"

      const method = coupon ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to save coupon")
      }

      toast({
        title: coupon ? "Coupon updated" : "Coupon created",
        description: coupon
          ? "The coupon has been updated successfully."
          : "The new coupon has been created successfully.",
      })

      router.push("/admin/coupons")
      router.refresh()
    } catch (error) {
      console.error("Error saving coupon:", error)
      toast({
        title: "Error",
        description: "There was a problem saving the coupon.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                    <FormDescription>The code that users will enter at checkout</FormDescription>
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
                      <Input placeholder="e.g. Amazon" {...field} disabled={isLoading} />
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
                    <Input placeholder="e.g. 20% off all summer items" {...field} disabled={isLoading} />
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
                    <Input type="url" placeholder="https://example.com/logo.jpg" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormDescription>URL to the merchant's logo image</FormDescription>
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
                {isLoading ? "Saving..." : coupon ? "Update Coupon" : "Create Coupon"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
