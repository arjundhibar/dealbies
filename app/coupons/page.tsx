// app/coupons/page.tsx - SEO-optimized coupons listing page

import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { pageSEO } from "@/lib/seo";
import CouponsPageClient from "./coupons-page-client";

export const metadata: Metadata = {
  title: pageSEO.coupons.title,
  description: pageSEO.coupons.description,
  keywords: pageSEO.coupons.keywords?.join(", "),
  openGraph: {
    title: pageSEO.coupons.title,
    description: pageSEO.coupons.description,
    type: "website",
    url: "https://dealbies.com/coupons",
    siteName: "DealHunter",
  },
  twitter: {
    card: "summary_large_image",
    title: pageSEO.coupons.title,
    description: pageSEO.coupons.description,
  },
  alternates: {
    canonical: "/coupons",
  },
};

export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({
    include: {
      images: true,
      user: { select: { username: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Convert Decimal objects to numbers for client component
  const serializedCoupons = coupons.map((coupon) => ({
    ...coupon,
    discountValue: coupon.discountValue
      ? coupon.discountValue.toNumber()
      : undefined,
  }));

  return <CouponsPageClient coupons={serializedCoupons} />;
}
