"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  dealsSchema: z.string().optional(),
  couponsSchema: z.string().optional(),
  articlesSchema: z.string().optional(),
  storesSchema: z.string().optional(),
  faqSchema: z.string().optional(),
  enabled: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface SchemaMarkupSettings {
  id: string;
  dealsSchema: string | null;
  couponsSchema: string | null;
  articlesSchema: string | null;
  storesSchema: string | null;
  faqSchema: string | null;
  enabled: boolean;
}

export function SchemaMarkupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dealsSchema: "",
      couponsSchema: "",
      articlesSchema: "",
      storesSchema: "",
      faqSchema: "",
      enabled: true,
    },
  });

  // Fetch existing settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/schema-markup");
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        const data: SchemaMarkupSettings = await response.json();
        form.reset({
          dealsSchema: data.dealsSchema
            ? JSON.stringify(JSON.parse(data.dealsSchema), null, 2)
            : "",
          couponsSchema: data.couponsSchema
            ? JSON.stringify(JSON.parse(data.couponsSchema), null, 2)
            : "",
          articlesSchema: data.articlesSchema
            ? JSON.stringify(JSON.parse(data.articlesSchema), null, 2)
            : "",
          storesSchema: data.storesSchema
            ? JSON.stringify(JSON.parse(data.storesSchema), null, 2)
            : "",
          faqSchema: data.faqSchema
            ? JSON.stringify(JSON.parse(data.faqSchema), null, 2)
            : "",
          enabled: data.enabled,
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast({
          title: "Error",
          description: "Failed to load schema markup settings.",
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
      // Validate JSON before submitting
      const validateAndFormat = (
        jsonString: string | undefined
      ): string | null => {
        if (!jsonString || jsonString.trim() === "") return null;
        try {
          const parsed = JSON.parse(jsonString);
          return JSON.stringify(parsed);
        } catch (error) {
          throw new Error(
            `Invalid JSON: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      };

      const payload = {
        dealsSchema: validateAndFormat(values.dealsSchema),
        couponsSchema: validateAndFormat(values.couponsSchema),
        articlesSchema: validateAndFormat(values.articlesSchema),
        storesSchema: validateAndFormat(values.storesSchema),
        faqSchema: validateAndFormat(values.faqSchema),
        enabled: values.enabled,
      };

      const response = await fetch("/api/admin/schema-markup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save settings");
      }

      toast({
        title: "Settings updated",
        description: "Schema markup settings have been updated successfully.",
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

  const getDefaultSchema = (type: string): string => {
    const defaults: Record<string, string> = {
      deals: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "Offer",
          name: "{{title}}",
          description: "{{description}}",
          price: "{{price}}",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "{{merchant}}",
          },
          category: "{{category}}",
          url: "{{url}}",
        },
        null,
        2
      ),
      coupons: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "Coupon",
          name: "{{title}}",
          description: "{{description}}",
          couponCode: "{{discountCode}}",
          merchant: {
            "@type": "Organization",
            name: "{{merchant}}",
          },
          category: "{{category}}",
          url: "{{url}}",
        },
        null,
        2
      ),
      articles: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "{{title}}",
          description: "{{description}}",
          author: {
            "@type": "Person",
            name: "{{author}}",
          },
          datePublished: "{{datePublished}}",
          dateModified: "{{dateModified}}",
        },
        null,
        2
      ),
      stores: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "{{name}}",
          description: "{{description}}",
          url: "{{url}}",
        },
        null,
        2
      ),
      faq: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "{{question}}",
              acceptedAnswer: {
                "@type": "Answer",
                text: "{{answer}}",
              },
            },
          ],
        },
        null,
        2
      ),
    };
    return defaults[type] || "{}";
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
        <CardTitle>Schema Markup Configuration</CardTitle>
        <CardDescription>
          Configure JSON-LD schema markup for different content types. Use
          placeholders like {"{{title}}"}, {"{{description}}"} that will be
          replaced with actual content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enable Schema Markup</FormLabel>
                    <FormDescription>
                      Toggle schema markup on or off for all content types.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Tabs defaultValue="deals" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="deals">Deals</TabsTrigger>
                <TabsTrigger value="coupons">Coupons</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="stores">Stores</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="deals" className="space-y-4">
                <FormField
                  control={form.control}
                  name="dealsSchema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deals Schema Markup</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isLoading}
                          rows={15}
                          className="font-mono text-sm"
                          placeholder={getDefaultSchema("deals")}
                        />
                      </FormControl>
                      <FormDescription>
                        JSON-LD schema for deals. Available placeholders:
                        {"{{title}}"}, {"{{description}}"}, {"{{price}}"},
                        {"{{merchant}}"}, {"{{category}}"}, {"{{url}}"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    form.setValue("dealsSchema", getDefaultSchema("deals"));
                  }}
                >
                  Reset to Default
                </Button>
              </TabsContent>

              <TabsContent value="coupons" className="space-y-4">
                <FormField
                  control={form.control}
                  name="couponsSchema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupons Schema Markup</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isLoading}
                          rows={15}
                          className="font-mono text-sm"
                          placeholder={getDefaultSchema("coupons")}
                        />
                      </FormControl>
                      <FormDescription>
                        JSON-LD schema for coupons. Available placeholders:
                        {"{{title}}"}, {"{{description}}"},{"{{discountCode}}"},{" "}
                        {"{{merchant}}"},{"{{category}}"}, {"{{url}}"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    form.setValue("couponsSchema", getDefaultSchema("coupons"));
                  }}
                >
                  Reset to Default
                </Button>
              </TabsContent>

              <TabsContent value="articles" className="space-y-4">
                <FormField
                  control={form.control}
                  name="articlesSchema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Articles/News Schema Markup</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isLoading}
                          rows={15}
                          className="font-mono text-sm"
                          placeholder={getDefaultSchema("articles")}
                        />
                      </FormControl>
                      <FormDescription>
                        JSON-LD schema for articles/news. Available
                        placeholders:
                        {"{{title}}"}, {"{{description}}"}, {"{{author}}"},
                        {"{{datePublished}}"}, {"{{dateModified}}"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    form.setValue(
                      "articlesSchema",
                      getDefaultSchema("articles")
                    );
                  }}
                >
                  Reset to Default
                </Button>
              </TabsContent>

              <TabsContent value="stores" className="space-y-4">
                <FormField
                  control={form.control}
                  name="storesSchema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stores Schema Markup</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isLoading}
                          rows={15}
                          className="font-mono text-sm"
                          placeholder={getDefaultSchema("stores")}
                        />
                      </FormControl>
                      <FormDescription>
                        JSON-LD schema for stores. Available placeholders:
                        {"{{name}}"}, {"{{description}}"}, {"{{url}}"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    form.setValue("storesSchema", getDefaultSchema("stores"));
                  }}
                >
                  Reset to Default
                </Button>
              </TabsContent>

              <TabsContent value="faq" className="space-y-4">
                <FormField
                  control={form.control}
                  name="faqSchema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FAQ Schema Markup</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isLoading}
                          rows={15}
                          className="font-mono text-sm"
                          placeholder={getDefaultSchema("faq")}
                        />
                      </FormControl>
                      <FormDescription>
                        JSON-LD schema for FAQ pages. Available placeholders:
                        {"{{question}}"}, {"{{answer}}"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    form.setValue("faqSchema", getDefaultSchema("faq"));
                  }}
                >
                  Reset to Default
                </Button>
              </TabsContent>
            </Tabs>

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
