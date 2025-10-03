// lib/seo.ts - Centralized SEO configuration

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
export const generateDealSEO = (deal: {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  merchant: string;
  category: string;
  slug: string;
}): SEOConfig => {
  const discount = deal.originalPrice 
    ? Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)
    : 0;
    
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
    schema: {
      "@context": "https://schema.org",
      "@type": "Offer",
      "name": deal.title,
      "description": deal.description,
      "price": deal.price,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": deal.merchant
      },
      "category": deal.category,
      "url": `https://dealbies.com/deals/${deal.slug}`
    }
  };
};

// Generate coupon-specific SEO
export const generateCouponSEO = (coupon: {
  title: string;
  description: string;
  merchant: string;
  discountCode: string;
  category: string;
  slug: string;
}): SEOConfig => {
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
    schema: {
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
    }
  };
};

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
