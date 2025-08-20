"use client";

import { useState, useEffect } from "react";
import { DealCard } from "@/components/deal-card";
import { CouponCard } from "@/components/coupon-card";
import { useData } from "@/lib/data-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PostDealForm } from "@/components/post-deal-form";
import type { Deal, Coupon } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// Type for mixed content (deals and coupons)
type MixedContent = {
  type: "deal" | "coupon";
  id: string;
  data: Deal | Coupon;
};

interface DealsListProps {
  category?: string;
  initialSort?: string;
  showHeader?: boolean;
  filters?: {
    sortBy: string;
    hideExpired: boolean;
    minPrice: number;
    maxPrice: number;
    temperatureFilter: string;
    minTemp: number;
    maxTemp: number;
  };
  onFiltersReset?: () => void; // Added prop for resetting filters
}

export function DealsList({
  category,
  initialSort = "newest",
  showHeader = true,
  filters,
  onFiltersReset,
}: DealsListProps) {
  const { fetchDeals, fetchCoupons, isLoading } = useData();
  const { user } = useAuth();
  const [sort, setSort] = useState(initialSort);
  const [mixedContent, setMixedContent] = useState<MixedContent[]>([]);
  const [isPostDealOpen, setIsPostDealOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Update sort when filters change
  useEffect(() => {
    if (filters?.sortBy) {
      console.log("DealsList - Sort changed to:", filters.sortBy);
      setSort(filters.sortBy);
    }
  }, [filters?.sortBy]);

  // Debug filters changes
  useEffect(() => {
    console.log("DealsList - Filters changed:", filters);
  }, [filters]);

  // Function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Function to apply filters to content
  const applyFilters = (content: MixedContent[]): MixedContent[] => {
    if (!filters) return content;

    return content.filter((item) => {
      // Hide expired filter
      if (filters.hideExpired && item.data.expired) {
        return false;
      }

      // Price filter
      if (filters.minPrice > 0 || filters.maxPrice < 9999) {
        const price = item.type === "deal" ? (item.data as Deal).price : 0;
        if (price < filters.minPrice || price > filters.maxPrice) {
          return false;
        }
      }

      // Temperature filter (using score as temperature)
      if (
        filters.temperatureFilter !== "each" ||
        filters.minTemp > 0 ||
        filters.maxTemp < 9999
      ) {
        const score = item.data.score;

        if (filters.temperatureFilter !== "each") {
          const threshold = parseInt(filters.temperatureFilter);
          if (score < threshold) {
            return false;
          }
        }

        if (filters.minTemp > 0 && score < filters.minTemp) {
          return false;
        }

        if (filters.maxTemp < 9999 && score > filters.maxTemp) {
          return false;
        }
      }

      return true;
    });
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        console.log("DealsList - Loading content for category:", category);
        console.log("DealsList - Sort:", sort);
        console.log("DealsList - Filters:", filters);

        const [deals, coupons] = await Promise.all([
          fetchDeals(category, sort),
          fetchCoupons(undefined, category, sort),
        ]);

        console.log("DealsList - Deals fetched:", deals);
        console.log("DealsList - Coupons fetched:", coupons);

        // Create mixed content array
        const mixed: MixedContent[] = [
          ...deals.map((deal) => ({
            type: "deal" as const,
            id: deal.id,
            data: deal,
          })),
          ...coupons.map((coupon) => ({
            type: "coupon" as const,
            id: coupon.id,
            data: coupon,
          })),
        ];

        console.log("DealsList - Mixed content created:", mixed);

        // Apply filters and set the content
        const filteredContent = applyFilters(mixed);
        console.log("DealsList - Filtered content:", filteredContent);

        // Shuffle the filtered content
        const shuffledContent = shuffleArray(filteredContent);
        setMixedContent(shuffledContent);
      } catch (error) {
        console.error("Error loading content:", error);
      }
    };

    loadContent();
  }, [category, sort, fetchDeals, fetchCoupons]);

  // Re-apply filters when filters change (without re-fetching)
  useEffect(() => {
    if (mixedContent.length > 0 && filters) {
      console.log("DealsList - Re-applying filters:", filters);
      const filteredContent = applyFilters(mixedContent);
      console.log("DealsList - Re-filtered content:", filteredContent);
      const shuffledContent = shuffleArray(filteredContent);
      setMixedContent(shuffledContent);
    }
  }, [filters, mixedContent.length]);

  const handleDealPosted = async () => {
    setIsPostDealOpen(false);
    // Refetch content to update the list
    try {
      const [deals, coupons] = await Promise.all([
        fetchDeals(category, sort),
        fetchCoupons(undefined, category, sort),
      ]);

      const mixed: MixedContent[] = [
        ...deals.map((deal) => ({
          type: "deal" as const,
          id: deal.id,
          data: deal,
        })),
        ...coupons.map((coupon) => ({
          type: "coupon" as const,
          id: coupon.id,
          data: coupon,
        })),
      ];

      // Apply filters to the refreshed content
      const filteredContent = applyFilters(mixed);
      const shuffledContent = shuffleArray(filteredContent);
      setMixedContent(shuffledContent);

      toast({
        title: "Success!",
        description:
          "Your deal has been posted and is now visible in the list.",
      });
    } catch (error) {
      console.error("Error refreshing content:", error);
    }
  };

  const handlePostDealClick = () => {
    if (!user) {
      router.push("/login?redirect=/");
      toast({
        title: "Login required",
        description: "You need to be logged in to post a deal.",
      });
      return;
    }
    setIsPostDealOpen(true);
  };

  const hasActiveFilters = () => {
    return (
      filters &&
      (filters.sortBy !== "newest" ||
        filters.hideExpired ||
        filters.minPrice > 0 ||
        filters.maxPrice < 9999 ||
        filters.temperatureFilter !== "each" ||
        filters.minTemp > 0 ||
        filters.maxTemp < 9999)
    );
  };

  return (
    <div className="space-y-4">
      {/* Header section */}
      {showHeader && (
        <div>
          <h1 className="text-lg font-bold text-gray-500 dark:text-[hsla(0,0%,100%,0.75)] font-['Averta_CY','Helvetica_Neue',Helvetica]">
            Deals for you
          </h1>
          <p className="text-gray-500 text-sm dark:text-[hsla(0,0%,100%,0.75)] font-['Averta_CY','Helvetica_Neue',Helvetica]">
            Specially selected deals based on your interactions on the platform
          </p>
        </div>
      )}

      {/* Active Filters Display */}
      {filters && hasActiveFilters() && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {filters.sortBy !== "newest" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white">
              Sort:{" "}
              {filters.sortBy === "hottest"
                ? "Hottest"
                : filters.sortBy === "most-comments"
                ? "Most Comments"
                : filters.sortBy === "ending-soon"
                ? "Ending Soon"
                : filters.sortBy}
            </span>
          )}
          {filters.hideExpired && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white">
              Hide Expired
            </span>
          )}
          {(filters.minPrice > 0 || filters.maxPrice < 9999) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white">
              Price: ₹{filters.minPrice} - ₹{filters.maxPrice}
            </span>
          )}
          {filters.temperatureFilter !== "each" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white">
              Temp: {filters.temperatureFilter}°+
            </span>
          )}
          {(filters.minTemp > 0 || filters.maxTemp < 9999) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white">
              Range: {filters.minTemp}° - {filters.maxTemp}°
            </span>
          )}
          <button
            onClick={() => {
              // Reset filters by calling the parent's reset function
              if (onFiltersReset) {
                onFiltersReset();
              }
            }}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Filter Loading Indicator */}
      {/* Removed loading indicator to fix scroll issues */}

      {/* Deals list */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-background">
              <div className="flex flex-col md:flex-row">
                <Skeleton className="h-48 w-full md:w-48 rounded-t-lg md:rounded-l-lg md:rounded-tr-none" />
                <div className="p-4 space-y-3 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : mixedContent.length === 0 ? ( // Changed from filteredContent to mixedContent
        <div className="rounded-lg border bg-background p-8 text-center">
          <h3 className="text-lg font-medium">
            {filters && hasActiveFilters()
              ? "No results found with current filters"
              : "No content found"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {filters && hasActiveFilters()
              ? "Try adjusting your filters or clearing them to see more results."
              : category
              ? `There are no deals or coupons in the ${category} category yet.`
              : "There are no deals or coupons yet. Be the first to post one!"}
          </p>
          {filters && hasActiveFilters() ? (
            <Button
              variant="outline"
              onClick={() => {
                // This will trigger the parent component to reset filters
                window.location.reload();
              }}
            >
              Clear All Filters
            </Button>
          ) : (
            <Dialog open={isPostDealOpen} onOpenChange={setIsPostDealOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-[#E86C2A] hover:bg-[#D15E20] text-white"
                  onClick={handlePostDealClick}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Post a Deal
                </Button>
              </DialogTrigger>
              {user && (
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Post a New Deal</DialogTitle>
                    <DialogDescription>
                      Share a great deal with the community. Fill out the form
                      below with all the details.
                    </DialogDescription>
                  </DialogHeader>
                  <PostDealForm onSuccess={handleDealPosted} />
                </DialogContent>
              )}
            </Dialog>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {mixedContent.map(
            (
              item // Changed from filteredContent to mixedContent
            ) =>
              item.type === "deal" ? (
                <DealCard key={item.id} deal={item.data as Deal} />
              ) : (
                <CouponCard key={item.id} coupon={item.data as Coupon} />
              )
          )}
        </div>
      )}
    </div>
  );
}
