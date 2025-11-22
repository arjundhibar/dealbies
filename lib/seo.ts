// lib/seo.ts - Centralized SEO configuration

import prisma from "@/lib/prisma";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noIndex?: boolean;
  schema?: any;
}

// Helper function to get schema markup settings from database
async function getSchemaMarkupSettings() {
  try {
    const settings = await prisma.schemaMarkupSettings.findUnique({
      where: { id: "schema-markup-settings" },
    });
    return settings;
  } catch (error) {
    console.error("Error fetching schema markup settings:", error);
    return null;
  }
}

// Helper function to replace placeholders in schema template
function replacePlaceholders(
  template: string,
  replacements: Record<string, string | number>
): any {
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), String(value));
  }
  try {
    return JSON.parse(result);
  } catch {
    return null;
  }
}

export const defaultSEO: SEOConfig = {
  title: "DealHunter - Find the Best Deals & Coupons",
  description: "Discover amazing deals, discounts, and coupons from top retailers. Join our community to share and find the best savings on electronics, fashion, home goods, and more.",
  keywords: [
    "deals",
    "discounts", 
    "coupons",
    "savings",
    "shopping",
    "retail",
    "electronics",
    "fashion",
    "home goods",
    "online shopping"
  ],
  ogType: "website",
  twitterCard: "summary_large_image",
  ogImage: "/og-image.jpg"
};

export const generatePageSEO = (config: Partial<SEOConfig>): SEOConfig => {
  return {
    ...defaultSEO,
    ...config,
    title: config.title ? `${config.title} | DealHunter` : defaultSEO.title
  };
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: "DealHunter - Find the Best Deals & Coupons",
    description: "Discover amazing deals, discounts, and coupons from top retailers. Join our community to share and find the best savings on electronics, fashion, home goods, and more.",
    keywords: ["deals", "discounts", "coupons", "savings", "shopping"]
  },
  
  deals: {
    title: "Latest Deals",
    description: "Browse the latest and hottest deals from top retailers. Find amazing discounts on electronics, fashion, home goods, and more.",
    keywords: ["deals", "discounts", "latest deals", "hot deals"]
  },
  
  coupons: {
    title: "Coupon Codes",
    description: "Find working coupon codes and discount codes for your favorite stores. Save money with our verified coupon database.",
    keywords: ["coupons", "coupon codes", "discount codes", "promo codes"]
  },
  
  categories: {
    title: "Deal Categories",
    description: "Browse deals by category - Electronics, Fashion, Home & Garden, Sports, and more. Find deals in your favorite categories.",
    keywords: ["deal categories", "electronics deals", "fashion deals", "home deals"]
  },
  
  search: {
    title: "Search Deals",
    description: "Search for specific deals, coupons, and discounts. Find exactly what you're looking for with our powerful search.",
    keywords: ["search deals", "find deals", "deal search"]
  },
  
  profile: {
    title: "User Profile",
    description: "View user profile, posted deals, and activity on DealHunter.",
    keywords: ["user profile", "member profile"]
  },
  
  submit: {
    title: "Submit a Deal",
    description: "Share a great deal with the DealHunter community. Submit deals, coupons, and discounts to help others save money.",
    keywords: ["submit deal", "share deal", "post deal"]
  }
};

// Generate deal-specific SEO
export async function generateDealSEO(deal: {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  merchant: string;
  category: string;
  slug: string;
}): Promise<SEOConfig> {
  const discount = deal.originalPrice 
    ? Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)
    : 0;
  
  // Get schema markup from database
  const schemaSettings = await getSchemaMarkupSettings();
  let schema: any = null;
  
  if (schemaSettings?.enabled && schemaSettings.dealsSchema) {
    try {
      const template = schemaSettings.dealsSchema;
      schema = replacePlaceholders(template, {
        title: deal.title,
        description: deal.description,
        price: deal.price,
        merchant: deal.merchant,
        category: deal.category,
        url: `https://dealbies.com/deals/${deal.slug}`,
      });
    } catch (error) {
      console.error("Error processing deal schema:", error);
      // Fallback to default schema
      schema = {
        "@context": "https://schema.org",
        "@type": "Offer",
        "name": deal.title,
        "description": deal.description,
        "price": deal.price,
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": deal.merchant
        },
        "category": deal.category,
        "url": `https://dealbies.com/deals/${deal.slug}`
      };
    }
  } else {
    // Default schema if not configured
    schema = {
      "@context": "https://schema.org",
      "@type": "Offer",
      "name": deal.title,
      "description": deal.description,
      "price": deal.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": deal.merchant
      },
      "category": deal.category,
      "url": `https://dealbies.com/deals/${deal.slug}`
    };
  }
    
  return {
    title: `${deal.title} - ${deal.merchant}`,
    description: `${deal.description.substring(0, 150)}... Save ${discount}% on ${deal.title} at ${deal.merchant}. ${deal.category} deal.`,
    keywords: [
      deal.title.toLowerCase(),
      deal.merchant.toLowerCase(),
      deal.category.toLowerCase(),
      "deal",
      "discount",
      "savings"
    ],
    canonical: `/deals/${deal.slug}`,
    ogType: "article",
    schema
  };
}

// Generate coupon-specific SEO
export async function generateCouponSEO(coupon: {
  title: string;
  description: string;
  merchant: string;
  discountCode: string;
  category: string;
  slug: string;
}): Promise<SEOConfig> {
  // Get schema markup from database
  const schemaSettings = await getSchemaMarkupSettings();
  let schema: any = null;
  
  if (schemaSettings?.enabled && schemaSettings.couponsSchema) {
    try {
      const template = schemaSettings.couponsSchema;
      schema = replacePlaceholders(template, {
        title: coupon.title,
        description: coupon.description,
        discountCode: coupon.discountCode,
        merchant: coupon.merchant,
        category: coupon.category,
        url: `https://dealbies.com/coupons/${coupon.slug}`,
      });
    } catch (error) {
      console.error("Error processing coupon schema:", error);
      // Fallback to default schema
      schema = {
        "@context": "https://schema.org",
        "@type": "Coupon",
        "name": coupon.title,
        "description": coupon.description,
        "couponCode": coupon.discountCode,
        "merchant": {
          "@type": "Organization",
          "name": coupon.merchant
        },
        "category": coupon.category,
        "url": `https://dealbies.com/coupons/${coupon.slug}`
      };
    }
  } else {
    // Default schema if not configured
    schema = {
      "@context": "https://schema.org",
      "@type": "Coupon",
      "name": coupon.title,
      "description": coupon.description,
      "couponCode": coupon.discountCode,
      "merchant": {
        "@type": "Organization",
        "name": coupon.merchant
      },
      "category": coupon.category,
      "url": `https://dealbies.com/coupons/${coupon.slug}`
    };
  }
  
  return {
    title: `${coupon.title} - ${coupon.merchant} Coupon`,
    description: `${coupon.description.substring(0, 150)}... Use coupon code ${coupon.discountCode} at ${coupon.merchant}. ${coupon.category} coupon.`,
    keywords: [
      coupon.title.toLowerCase(),
      coupon.merchant.toLowerCase(),
      coupon.category.toLowerCase(),
      "coupon",
      "discount code",
      "promo code",
      coupon.discountCode
    ],
    canonical: `/coupons/${coupon.slug}`,
    ogType: "article",
    schema
  };
}

// Generate category-specific SEO
export const generateCategorySEO = (category: string): SEOConfig => {
  const categoryNames: Record<string, string> = {
    "electronics": "Electronics Deals",
    "fashion": "Fashion Deals", 
    "home": "Home & Garden Deals",
    "sports": "Sports Deals",
    "gaming": "Gaming Deals",
    "beauty": "Beauty Deals",
    "automotive": "Automotive Deals"
  };
  
  return {
    title: categoryNames[category.toLowerCase()] || `${category} Deals`,
    description: `Find the best ${category.toLowerCase()} deals and discounts. Browse ${category.toLowerCase()} offers from top retailers.`,
    keywords: [`${category} deals`, `${category} discounts`, `${category} offers`],
    canonical: `/category/${category.toLowerCase()}`
  };
};

// Generate article/news schema markup
export async function generateArticleSchema(article: {
  title: string;
  description: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}): Promise<any> {
  const schemaSettings = await getSchemaMarkupSettings();
  
  if (schemaSettings?.enabled && schemaSettings.articlesSchema) {
    try {
      const template = schemaSettings.articlesSchema;
      return replacePlaceholders(template, {
        title: article.title,
        description: article.description,
        author: article.author || "DealHunter Team",
        datePublished: article.datePublished || new Date().toISOString(),
        dateModified: article.dateModified || new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error processing article schema:", error);
    }
  }
  
  // Default schema
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "author": {
      "@type": "Person",
      "name": article.author || "DealHunter Team"
    },
    "datePublished": article.datePublished || new Date().toISOString(),
    "dateModified": article.dateModified || new Date().toISOString(),
  };
}

// Generate store schema markup
export async function generateStoreSchema(store: {
  name: string;
  description?: string;
  url?: string;
}): Promise<any> {
  const schemaSettings = await getSchemaMarkupSettings();
  
  if (schemaSettings?.enabled && schemaSettings.storesSchema) {
    try {
      const template = schemaSettings.storesSchema;
      return replacePlaceholders(template, {
        name: store.name,
        description: store.description || "",
        url: store.url || `https://dealbies.com/stores/${store.name.toLowerCase().replace(/\s+/g, "-")}`,
      });
    } catch (error) {
      console.error("Error processing store schema:", error);
    }
  }
  
  // Default schema
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": store.name,
    "description": store.description || "",
    "url": store.url || `https://dealbies.com/stores/${store.name.toLowerCase().replace(/\s+/g, "-")}`,
  };
}

// Generate FAQ schema markup
export async function generateFAQSchema(faqs: Array<{
  question: string;
  answer: string;
}>): Promise<any> {
  const schemaSettings = await getSchemaMarkupSettings();
  
  if (schemaSettings?.enabled && schemaSettings.faqSchema) {
    try {
      // For FAQ, we need to handle multiple Q&A pairs
      const template = schemaSettings.faqSchema;
      const mainEntity = faqs.map((faq) => {
        const questionTemplate = template.includes("{{question}}") 
          ? template.replace("{{question}}", faq.question)
          : faq.question;
        const answerTemplate = questionTemplate.includes("{{answer}}")
          ? questionTemplate.replace("{{answer}}", faq.answer)
          : faq.answer;
        return answerTemplate;
      });
      
      // If template has mainEntity structure, use it, otherwise create default
      let parsedTemplate;
      try {
        parsedTemplate = JSON.parse(template);
        if (parsedTemplate.mainEntity) {
          parsedTemplate.mainEntity = faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer,
            },
          }));
          return parsedTemplate;
        }
      } catch {
        // Template is not valid JSON, use default
      }
    } catch (error) {
      console.error("Error processing FAQ schema:", error);
    }
  }
  
  // Default schema
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}
