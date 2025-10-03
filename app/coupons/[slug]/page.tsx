// app/coupons/[slug]/page.tsx - Server component with SEO

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateCouponSEO } from "@/lib/seo";
import CouponPageClient from "./coupon-page-client";

interface CouponPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CouponPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { slug },
      include: {
        images: true,
        user: { select: { username: true } },
      },
    });

    if (!coupon) {
      return {
        title: "Coupon Not Found",
        description: "The coupon you are looking for could not be found.",
      };
    }

    const seo = generateCouponSEO({
      title: coupon.title,
      description: coupon.description,
      merchant: coupon.merchant,
      discountCode: coupon.discountCode,
      category: coupon.category,
      slug: coupon.slug,
    });

    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      openGraph: {
        title: seo.title,
        description: seo.description,
        type: "article",
        url: `https://dealbies.com/coupons/${coupon.slug}`,
        images:
          coupon.images.length > 0
            ? [
                {
                  url: `https://dealbies.com/api/images/${coupon.images[0].slug}`,
                  width: 1200,
                  height: 630,
                  alt: coupon.title,
                },
              ]
            : undefined,
        publishedTime: coupon.createdAt.toISOString(),
        authors: [coupon.user.username],
      },
      twitter: {
        card: "summary_large_image",
        title: seo.title,
        description: seo.description,
        images:
          coupon.images.length > 0
            ? [`https://dealbies.com/api/images/${coupon.images[0].slug}`]
            : undefined,
      },
      alternates: {
        canonical: `/coupons/${coupon.slug}`,
      },
      other: {
        "article:author": coupon.user.username,
        "article:section": coupon.category,
        "article:tag": coupon.merchant,
        "coupon:code": coupon.discountCode,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for coupon:", error);
    return {
      title: "Coupon Not Found",
      description: "The coupon you are looking for could not be found.",
    };
  }
}

export default async function CouponPage({ params }: CouponPageProps) {
  const { slug } = await params;

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { slug },
      include: {
        images: true,
        user: { select: { username: true, avatarUrl: true } },
        _count: { select: { comments: true } },
        votes: true,
      },
    });

    if (!coupon) {
      notFound();
    }

    return <CouponPageClient coupon={coupon} />;
  } catch (error) {
    console.error("Error fetching coupon:", error);
    notFound();
  }
}
