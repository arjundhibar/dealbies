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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const categories = [
  "Tech",
  "Computing",
  "Home",
  "Auto",
  "Travel",
  "Kids",
  "Fashion",
  "Gaming",
  "Food",
  "Beauty",
  "Other",
]

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price:z.number().positive(),
  originalPrice: z.number().positive().optional(),
  merchant: z.string().min(2, "Merchant name is required"),
  category: z.string().nonempty("Category is required"),
  dealUrl: z.string().url("Please enter a valid URL"),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  expiresAt: z.string().optional(),
  expired: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

interface AdminDealFormProps {
  deal?: {
    id: string
    title: string
    description: string
    price: number
    originalPrice: number | null
    merchant: string
    category: string
    dealUrl: string
    imageUrl: string | null
    expired: boolean
    expiresAt: Date | null
  }
}

export function AdminDealForm({ deal }: AdminDealFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: deal?.title || "",
      description: deal?.description || "",
      price: deal?.price || undefined,
      originalPrice: deal?.originalPrice || undefined,
      merchant: deal?.merchant || "",
      category: deal?.category || "",
      dealUrl: deal?.dealUrl || "",
      imageUrl: deal?.imageUrl || "",
      expiresAt: deal?.expiresAt ? new Date(deal.expiresAt).toISOString().slice(0, 16) : "",
      expired: deal?.expired || false,
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)

    try {
      const url = deal ? `/api/admin/deals/${deal.id}` : "/api/admin/deals"

      const method = deal ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to save deal")
      }

      toast({
        title: deal ? "Deal updated" : "Deal created",
        description: deal ? "The deal has been updated successfully." : "The new deal has been created successfully.",
      })

      router.push("/admin/deals")
      router.refresh()
    } catch (error) {
      console.error("Error saving deal:", error)
      toast({
        title: "Error",
        description: "There was a problem saving the deal.",
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Deal title" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Price (£)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} disabled={isLoading}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (£) (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        value={field.value || ""}
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

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Deal description" rows={5} {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dealUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deal URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com/deal" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com/image.jpg" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormDescription>URL to an image of the deal</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Mark as expired</FormLabel>
                      <FormDescription>Check this if the deal is no longer available</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/deals")} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : deal ? "Update Deal" : "Create Deal"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
