// components/seo-head.tsx - Reusable SEO component

import Head from "next/head";
import { SEOConfig } from "@/lib/seo";

interface SEOHeadProps {
  seo: SEOConfig;
}

export function SEOHead({ seo }: SEOHeadProps) {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage,
    ogType = "website",
    twitterCard = "summary_large_image",
    noIndex = false,
    schema,
  } = seo;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}

      {/* Canonical URL */}
      {canonical && (
        <link rel="canonical" href={`https://dealbies.com${canonical}`} />
      )}

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta
        property="og:url"
        content={`https://dealbies.com${canonical || ""}`}
      />
      <meta property="og:site_name" content="DealHunter" />
      {ogImage && (
        <meta property="og:image" content={`https://dealbies.com${ogImage}`} />
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && (
        <meta name="twitter:image" content={`https://dealbies.com${ogImage}`} />
      )}

      {/* Schema Markup */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      )}
    </Head>
  );
}
