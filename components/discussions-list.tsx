"use client";

import { useState, useEffect } from "react";
import { DiscussionCard } from "@/components/discussion-card";
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
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { Discussion } from "@/lib/types";

interface DiscussionsListProps {
  category?: string;
  initialSort?: string;
  showHeader?: boolean;
  initialData?: {
    discussions: Discussion[];
  };
  filters?: {
    sortBy: string;
    hideExpired: boolean;
    minPrice: number;
    maxPrice: number;
    temperatureFilter: string;
    minTemp: number;
    maxTemp: number;
  };
  onFiltersReset?: () => void;
}

export function DiscussionsList({
  category,
  initialSort = "newest",
  showHeader = true,
  initialData,
  filters,
  onFiltersReset,
}: DiscussionsListProps) {
  const { isLoading, currentSort, fetchDiscussions } = useData();
  const { user } = useAuth();
  const [sort, setSort] = useState(initialSort);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isPostDiscussionOpen, setIsPostDiscussionOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Update sort when filters change
  useEffect(() => {
    if (filters?.sortBy) {
      console.log("DiscussionsList - Sort changed to:", filters.sortBy);
      setSort(filters.sortBy);
    }
  }, [filters?.sortBy]);

  // Update sort when global sort changes (from navbar tabs)
  useEffect(() => {
    if (currentSort && currentSort !== sort) {
      console.log("DiscussionsList - Global sort changed to:", currentSort);
      setSort(currentSort);
    }
  }, [currentSort, sort]);

  // Debug filters changes
  useEffect(() => {
    console.log("DiscussionsList - Filters changed:", filters);
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
  const applyFilters = (content: Discussion[]): Discussion[] => {
    if (!filters) return content;

    return content.filter((item) => {
      // Temperature filter (using score as temperature)
      if (
        filters.temperatureFilter !== "each" ||
        filters.minTemp > 0 ||
        filters.maxTemp < 9999
      ) {
        const score = item.score || 0;

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

  // Apply filters when filters change
  useEffect(() => {
    if (discussions.length > 0 && filters) {
      console.log("DiscussionsList - Applying filters:", filters);
      const filteredContent = applyFilters(discussions);
      const shuffledContent = shuffleArray(filteredContent);
      setDiscussions(shuffledContent);
    }
  }, [filters]);

  // Initialize discussions from initialData if provided
  useEffect(() => {
    if (initialData) {
      setDiscussions(initialData.discussions);
    }
  }, [initialData]);

  // Load content when no initialData is provided (only for standalone usage)
  useEffect(() => {
    if (!initialData && sort) {
      const loadContent = async () => {
        try {
          console.log(
            "DiscussionsList - Loading content for category:",
            category || "all",
            "sort:",
            sort
          );

          const discussionsData = await fetchDiscussions(
            category,
            category,
            sort
          );
          console.log("DiscussionsList - Fetched data:", discussionsData);
          setDiscussions(discussionsData);
        } catch (error) {
          console.error("Error loading discussions:", error);
        }
      };

      loadContent();
    }
  }, [initialData, category, sort]);

  const handleDiscussionPosted = async () => {
    setIsPostDiscussionOpen(false);
    // The parent component (category page) will handle refreshing the data
    toast({
      title: "Success!",
      description:
        "Your discussion has been posted and is now visible in the list.",
    });
  };

  const handlePostDiscussionClick = () => {
    if (!user) {
      router.push("/login?redirect=/");
      toast({
        title: "Login required",
        description: "You need to be logged in to post a discussion.",
      });
      return;
    }
    router.push("/submission/discussion");
  };

  const hasActiveFilters = () => {
    return (
      filters &&
      (filters.sortBy !== "newest" ||
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
            Discussions for you
          </h1>
          <p className="text-gray-500 text-sm dark:text-[hsla(0,0%,100%,0.75)] font-['Averta_CY','Helvetica_Neue',Helvetica]">
            Specially selected discussions based on your interactions on the
            platform
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

      {/* Discussions list */}
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
      ) : discussions.length === 0 ? (
        <div className="rounded-lg border bg-background p-8 text-center">
          <h3 className="text-lg font-medium">
            {filters && hasActiveFilters()
              ? "No results found with current filters"
              : "No discussions found"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {filters && hasActiveFilters()
              ? "Try adjusting your filters or clearing them to see more results."
              : category
              ? `There are no discussions in the ${category} category yet.`
              : "There are no discussions yet. Be the first to post one!"}
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
            <Button
              className="bg-[#E86C2A] hover:bg-[#D15E20] text-white"
              onClick={handlePostDiscussionClick}
            >
              <Plus className="mr-2 h-4 w-4" />
              Post a Discussion
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <DiscussionCard
              key={discussion.id}
              discussion={{
                ...discussion,
                _count: {
                  comments: discussion.commentCount,
                  votes: 0, // We don't have vote count in the Discussion type
                },
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
