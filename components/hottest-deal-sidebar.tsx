"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface HottestDeal {
  id: string;
  slug?: string;
  title: string;
  score: number;
  price: string | number;
  imageUrl: string;
  dealUrl: string;
}

interface HottestDealsSidebarProps {
  deals?: HottestDeal[]; // Make deals optional since we'll fetch them internally
}

export function HottestDealsSidebar({
  deals: initialDeals,
}: HottestDealsSidebarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [deals, setDeals] = useState<HottestDeal[]>(initialDeals || []);
  const [loading, setLoading] = useState(!initialDeals);

  useEffect(() => {
    // If no initial deals provided, fetch them
    if (!initialDeals) {
      const fetchHottestDeals = async () => {
        try {
          const response = await fetch("/api/deals/hottest");
          if (response.ok) {
            const data = await response.json();
            setDeals(data);
          }
        } catch (error) {
          console.error("Error fetching hottest deals:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchHottestDeals();
    }
  }, [initialDeals]);

  if (!isVisible) return null;

  if (loading) {
    return (
      <div className="bg-white rounded-lg border overflow-hidden mt-1 dark:bg-dark-secondary">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Hottest Deals</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (deals.length === 0) {
    return null; // Don't show the sidebar if there are no deals
  }

  return (
    <div className="bg-white rounded-lg borderoverflow-hidden mt-1 dark:bg-dark-secondary">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Hottest Deals</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {deals.map((deal) => (
            <Link
              href={`/deals/${deal.slug || deal.id}`}
              key={deal.id}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={
                    deal.imageUrl ||
                    "/placeholder.svg?height=64&width=64&query=product"
                  }
                  alt={deal.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-sm font-bold text-[#E86C2A]">
                    {deal.score}°
                  </span>
                  <span className="text-sm text-gray-500">
                    {deal.title.split(" ")[0]}
                  </span>
                </div>
                <h4 className="text-sm font-medium line-clamp-2 group-hover:text-[#E86C2A]">
                  {deal.title}
                </h4>
                <div className="text-sm font-bold text-right text-[#E86C2A]">
                  {typeof deal.price === "number"
                    ? `€${deal.price}`
                    : deal.price}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Button
          variant="link"
          className="w-full mt-4 text-[#E86C2A] flex items-center justify-center"
          asChild
        >
          <Link href="/hottest">Discover more →</Link>
        </Button>
      </div>
    </div>
  );
}
