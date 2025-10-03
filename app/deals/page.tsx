// app/deals/page.tsx - SEO-optimized deals listing page

import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { pageSEO } from "@/lib/seo";
import DealsPageClient from "./deals-page-client";

export const metadata: Metadata = {
  title: pageSEO.deals.title,
  description: pageSEO.deals.description,
  keywords: pageSEO.deals.keywords?.join(", "),
  openGraph: {
    title: pageSEO.deals.title,
    description: pageSEO.deals.description,
    type: "website",
    url: "https://dealbies.com/deals",
    siteName: "DealHunter",
  },
  twitter: {
    card: "summary_large_image",
    title: pageSEO.deals.title,
    description: pageSEO.deals.description,
  },
  alternates: {
    canonical: "/deals",
  },
};

export default async function DealsPage() {
  const deals = await prisma.deal.findMany({
    include: {
      images: true,
      user: { select: { username: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return <DealsPageClient deals={deals} />;
}
