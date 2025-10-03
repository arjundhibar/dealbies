// app/category/[slug]/category-page-client.tsx - Client component for category page

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DealCard } from "@/components/deal-card";
import { CouponCard } from "@/components/coupon-card";
import { ChevronRight, Tag } from "lucide-react";
import Link from "next/link";
import type { Deal, Coupon } from "@/lib/types";

interface CategoryPageClientProps {
  category: string;
  deals: (Deal & {
    images: Array<{ slug: string; url: string; cloudflareUrl: string }>;
    user: { username: string };
    _count: { comments: number };
  })[];
  coupons: (Coupon & {
    images: Array<{ slug: string; url: string; cloudflareUrl: string }>;
    user: { username: string };
    _count: { comments: number };
  })[];
}

export default function CategoryPageClient({
  category,
  deals,
  coupons,
}: CategoryPageClientProps) {
  const [activeTab, setActiveTab] = useState("deals");

  const categoryNames: Record<string, string> = {
    electronics: "Electronics",
    fashion: "Fashion",
    home: "Home & Garden",
    sports: "Sports",
    gaming: "Gaming",
    beauty: "Beauty",
    automotive: "Automotive",
    books: "Books",
    health: "Health & Wellness",
    travel: "Travel",
  };

  const displayName = categoryNames[category.toLowerCase()] || category;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 dark:text-gray-100">{displayName}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Tag className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {displayName} Deals & Coupons
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Find the best {displayName.toLowerCase()} deals and coupons from top
          retailers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {deals.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Active Deals
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {coupons.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Coupon Codes
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {deals.length + coupons.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Offers
          </div>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deals" className="flex items-center space-x-2">
            <span>Deals ({deals.length})</span>
          </TabsTrigger>
          <TabsTrigger value="coupons" className="flex items-center space-x-2">
            <span>Coupons ({coupons.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deals" className="mt-6">
          {deals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                <Tag className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No deals found</h3>
                <p>Be the first to share a {displayName.toLowerCase()} deal!</p>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="coupons" className="mt-6">
          {coupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                <Tag className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No coupons found</h3>
                <p>
                  Be the first to share a {displayName.toLowerCase()} coupon!
                </p>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
