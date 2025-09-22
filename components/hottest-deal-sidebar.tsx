"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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
  deals: HottestDeal[];
}

export function HottestDealsSidebar({ deals }: HottestDealsSidebarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

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
