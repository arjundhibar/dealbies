// app/deals/deals-page-client.tsx - Client component for deals page

"use client";

import { DealCard } from "@/components/deal-card";
import { Card } from "@/components/ui/card";
import { Tag } from "lucide-react";
import type { Deal } from "@/lib/types";

interface DealsPageClientProps {
  deals: (Deal & {
    images: Array<{ slug: string; url: string; cloudflareUrl: string }>;
    user: { username: string };
    _count: { comments: number };
  })[];
}

export default function DealsPageClient({ deals }: DealsPageClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Latest Deals
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover amazing deals on electronics, fashion, home goods, and more.
        </p>
      </div>

      {/* Deals Grid */}
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
            <p>Be the first to share a great deal!</p>
          </div>
        </Card>
      )}
    </div>
  );
}
