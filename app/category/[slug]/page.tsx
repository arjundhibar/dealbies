// app/category/[slug]/page.tsx - SEO-optimized category page

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateCategorySEO } from "@/lib/seo";
import CategoryPageClient from "@/app/category/[slug]/category-page-client";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  const seo = generateCategorySEO(slug);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(", "),
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      url: `https://dealbies.com/category/${slug}`,
      siteName: "DealHunter",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  try {
    // Fetch deals and coupons for this category
    const [deals, coupons] = await Promise.all([
      prisma.deal.findMany({
        where: { category: slug },
        include: {
          images: true,
          user: { select: { username: true } },
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.coupon.findMany({
        where: { category: slug },
        include: {
          images: true,
          user: { select: { username: true } },
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    return (
      <CategoryPageClient category={slug} deals={deals} coupons={coupons} />
    );
  } catch (error) {
    console.error("Error fetching category data:", error);
    notFound();
  }
}
