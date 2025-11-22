"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  siteTitle: z
    .string()
    .min(10, "Site title must be at least 10 characters")
    .max(70, "Site title should be less than 70 characters for optimal SEO"),
  metaDescription: z
    .string()
    .min(50, "Meta description must be at least 50 characters")
    .max(
      160,
      "Meta description should be less than 160 characters for optimal SEO"
    ),
  siteName: z
    .string()
    .min(2, "Site name is required")
    .max(50, "Site name is too long"),
  ogImage: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface SiteSettings {
  id: string;
  siteTitle: string;
  metaDescription: string;
  siteName: string;
  ogImage: string | null;
}

export function SEOSettingsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteTitle: "",
      metaDescription: "",
      siteName: "DealHunter",
      ogImage: "",
    },
  });

  // Fetch existing settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        const data: SiteSettings = await response.json();
        form.reset({
          siteTitle: data.siteTitle,
          metaDescription: data.metaDescription,
          siteName: data.siteName,
          ogImage: data.ogImage || "",
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast({
          title: "Error",
          description: "Failed to load site settings.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchSettings();
  }, [form, toast]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save settings");
      }

      toast({
        title: "Settings updated",
        description:
          "Website title tags and meta descriptions have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem saving the settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Title Tags & Meta Descriptions</CardTitle>
        <CardDescription>
          Manage your website&apos;s SEO metadata. These settings control how
          your site appears in search engines and social media.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="siteTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="DealHunter - Find the Best Deals & Coupons"
                      {...field}
                      disabled={isLoading}
                      maxLength={70}
                    />
                  </FormControl>
                  <FormDescription>
                    The main title of your website. Recommended: 50-60
                    characters for optimal SEO.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Discover amazing deals, discounts, and coupons from top retailers..."
                      {...field}
                      disabled={isLoading}
                      rows={4}
                      maxLength={160}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of your website that appears in search
                    results. Recommended: 120-155 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="DealHunter"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    The name of your website (used in Open Graph tags).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ogImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Open Graph Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="/og-image.jpg"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    The image URL that appears when your site is shared on
                    social media. Use a relative path or full URL.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
