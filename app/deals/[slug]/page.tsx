// app/deals/[slug]/page.tsx - Server component with SEO

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateDealSEO } from "@/lib/seo";
import DealPageClient from "@/app/deals/[slug]/deal-page-client";

interface DealPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DealPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const deal = await prisma.deal.findUnique({
      where: { slug },
      include: {
        images: true,
        user: { select: { username: true } },
      },
    });

    if (!deal) {
      return {
        title: "Deal Not Found",
        description: "The deal you are looking for could not be found.",
      };
    }

    const seo = generateDealSEO({
      title: deal.title,
      description: deal.description,
      price: deal.price,
      originalPrice: deal.originalPrice,
      merchant: deal.merchant,
      category: deal.category,
      slug: deal.slug,
    });

    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      openGraph: {
        title: seo.title,
        description: seo.description,
        type: "article",
        url: `https://dealbies.com/deals/${deal.slug}`,
        images:
          deal.images.length > 0
            ? [
                {
                  url: `https://dealbies.com/api/images/${deal.images[0].slug}`,
                  width: 1200,
                  height: 630,
                  alt: deal.title,
                },
              ]
            : undefined,
        publishedTime: deal.createdAt.toISOString(),
        authors: [deal.user.username],
      },
      twitter: {
        card: "summary_large_image",
        title: seo.title,
        description: seo.description,
        images:
          deal.images.length > 0
            ? [`https://dealbies.com/api/images/${deal.images[0].slug}`]
            : undefined,
      },
      alternates: {
        canonical: `/deals/${deal.slug}`,
      },
      other: {
        "article:author": deal.user.username,
        "article:section": deal.category,
        "article:tag": deal.merchant,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for deal:", error);
    return {
      title: "Deal Not Found",
      description: "The deal you are looking for could not be found.",
    };
  }
}

export default async function DealPage({ params }: DealPageProps) {
  const { slug } = await params;

  try {
    const deal = await prisma.deal.findUnique({
      where: { slug },
      include: {
        images: true,
        user: { select: { username: true, avatarUrl: true } },
        _count: { select: { comments: true } },
        votes: true,
      },
    });

    if (!deal) {
      notFound();
    }

    return <DealPageClient deal={deal} />;
  } catch (error) {
    console.error("Error fetching deal:", error);
    notFound();
  }
}
