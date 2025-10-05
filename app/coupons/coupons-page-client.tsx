// app/coupons/coupons-page-client.tsx - Client component for coupons page

"use client";

import { CouponCard } from "@/components/coupon-card";
import { Card } from "@/components/ui/card";
import { Tag } from "lucide-react";
import type { Coupon } from "@/lib/types";

interface CouponsPageClientProps {
  coupons: any[]; // We'll use any for now to avoid type conflicts
}

export default function CouponsPageClient({ coupons }: CouponsPageClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Coupon Codes
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Get exclusive coupon codes and discount codes for your favorite
          stores.
        </p>
      </div>

      {/* Coupons Grid */}
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
            <p>Be the first to share a coupon code!</p>
          </div>
        </Card>
      )}
    </div>
  );
}
