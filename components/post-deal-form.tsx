"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useIsMobile } from "@/hooks/use-mobile"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

interface PostDealFormProps {
  onSuccess?: () => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

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
  price: z.coerce.number().positive("Price must be positive"),
  originalPrice: z.coerce.number().positive("Original price must be positive").optional(),
  merchant: z.string().min(2, "Merchant name is required"),
  category: z.string().nonempty("Category is required"),
  dealUrl: z.string().url("Please enter a valid URL"),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  expiresAt: z.string().optional(),
})

//remove the form 
type FormValues = z.infer<typeof formSchema>

export function PostDealForm({ onSuccess, isOpen, onOpenChange }: PostDealFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const isMobile = useIsMobile()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      originalPrice: undefined,
      merchant: "",
      category: "",
      dealUrl: "",
      imageUrl: "",
      expiresAt: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      if (!user) {
        throw new Error("You must be logged in to post a deal")
      }

      // Log the values being sent
      console.log("Submitting deal with values:", values)
    
      
      const token = localStorage.getItem("auth_token");
       if (!token) {
      throw new Error("Missing authentication token")
    }
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      })

      // Log the raw response for debugging
      console.log("Response status:", response.status)

      // Check if the response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)

        // Check if this is a Prisma initialization error
        if (text.includes("prisma generate")) {
          throw new Error("Database initialization error. Please run 'npx prisma generate' and restart the server.")
        }

        throw new Error(`Server error: ${response.status}. Please try again later.`)
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to create deal: ${response.status} ${response.statusText}`)
      }

      toast({
        title: "Success!",
        description: "Your deal has been posted.",
      })

      if (onSuccess) onSuccess()
      if (onOpenChange) onOpenChange(false)
      router.push(`/deal/${data.id}`)
    } catch (error: any) {
      console.error("Error posting deal:", error)
      setError(error.message || "An error occurred while posting the deal.")
    } finally {
      setIsLoading(false)
    }
  }

  const formContent = (
    <div className="pr-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 50% off Sony WH-1000XM4 Headphones"
                    {...field}
                    disabled={isLoading}
                    className="h-10 sm:h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Current Price (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 199.99"
                      {...field}
                      disabled={isLoading}
                      className="h-10 sm:h-11"
                    />
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
                  <FormLabel className="text-base">Original Price (₹) (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 299.99"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                      disabled={isLoading}
                      className="h-10 sm:h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="merchant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Merchant</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Amazon" {...field} disabled={isLoading} className="h-10 sm:h-11" />
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
                  <FormLabel className="text-base">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger className="h-10 sm:h-11">
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
                <FormLabel className="text-base">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide details about the deal..."
                    rows={4}
                    {...field}
                    disabled={isLoading}
                    className="min-h-[100px] sm:min-h-[120px] resize-y"
                  />
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
                <FormLabel className="text-base">Deal URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/deal"
                    {...field}
                    disabled={isLoading}
                    className="h-10 sm:h-11"
                  />
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
                <FormLabel className="text-base">Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    {...field}
                    disabled={isLoading}
                    className="h-10 sm:h-11"
                  />
                </FormControl>
                <FormDescription className="text-xs sm:text-sm">
                  Providing an image will make your deal more attractive
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
                <FormLabel className="text-base">Expiry Date (Optional)</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} disabled={isLoading} className="h-10 sm:h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-hotukdeals-red hover:bg-opacity-90 text-white h-11 sm:h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Posting..." : "Post Deal"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )

  // If this component is being used directly in a dialog or sheet (controlled by parent)
  if (isOpen !== undefined && onOpenChange) {
    if (isMobile) {
      return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="h-[90vh] overflow-hidden flex flex-col">
            <SheetHeader className="mb-4">
              <SheetTitle>Post a New Deal</SheetTitle>
              <SheetDescription>Share a great deal with the community</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-auto pb-8">{formContent}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Post a New Deal</DialogTitle>
            <DialogDescription>
              Share a great deal with the community. Fill out the form below with all the details.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto pb-6">{formContent}</div>
        </DialogContent>
      </Dialog>
    )
  }

  // If this component is being used directly inside a dialog or sheet content (not controlling the dialog/sheet itself)
  return formContent
}
