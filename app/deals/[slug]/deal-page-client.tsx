// app/deals/[slug]/deal-page-client.tsx - Client component for deal page

"use client";

import { useState, useRef, useEffect } from "react";
import { useData } from "@/lib/data-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ExternalLink,
  Share2,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowBigDown,
  ArrowBigUp,
  CalendarDays,
  Tag,
  ThumbsUp,
  MessageSquare,
  Hourglass,
  Flag,
} from "lucide-react";
import { formatDistanceToNow, isPast, format } from "date-fns";
import { cn, formatCurrency, getImageUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CommentSection } from "@/components/comment-section";
import type { Deal } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { DealCardSaveButton } from "@/components/deal-card-save-button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel } from "@/components/ui/carousel";

interface DealPageClientProps {
  deal: Deal & {
    images: Array<{ slug: string; url: string; cloudflareUrl: string }>;
    user: { username: string; avatarUrl?: string };
    _count: { comments: number };
    votes: Array<{ voteType: string; userId: string }>;
  };
}

export default function DealPageClient({
  deal: initialDeal,
}: DealPageClientProps) {
  const { voteDeal, updateDealVote, currentUser } = useData();
  const [deal, setDeal] = useState(initialDeal);
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const isMobile = useIsMobile();
  const [showStickyNav, setShowStickyNav] = useState(false);
  const dealCardRef = useRef<HTMLDivElement>(null);
  const [isColdPressed, setIsColdPressed] = useState(false);
  const [isCalledPressed, setIsCalledPressed] = useState(false);
  const [showSnow, setShowSnow] = useState(false);
  const [showFire, setShowFire] = useState(false);
  const [posterUser, setPosterUser] = useState<any>(null);
  const [posterLoading, setPosterLoading] = useState(true);

  const commentRef = useRef<HTMLDivElement>(null);

  const scrollsToComment = () => {
    commentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add effect to hide navbar when sticky nav is shown
  useEffect(() => {
    const navbar = document.querySelector("header");
    if (navbar) {
      if (showStickyNav) {
        navbar.style.display = "none";
      } else {
        navbar.style.display = "block";
      }
    }

    return () => {
      if (navbar) {
        navbar.style.display = "block";
      }
    };
  }, [showStickyNav]);

  // Load related deals
  useEffect(() => {
    const loadRelatedDeals = async () => {
      try {
        const response = await fetch(`/api/deals/${deal.id}/related`);
        if (response.ok) {
          const related = await response.json();
          setRelatedDeals(related);
        }
      } catch (error) {
        console.error("Error loading related deals:", error);
      }
    };

    loadRelatedDeals();
  }, [deal.id]);

  // Sticky navigation effect
  useEffect(() => {
    const handleScroll = () => {
      if (dealCardRef.current) {
        const rect = dealCardRef.current.getBoundingClientRect();
        setShowStickyNav(rect.bottom <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleVote = async (voteType: "up" | "down") => {
    if (isVoting) return;

    try {
      setIsVoting(true);
      await voteDeal(deal.id, voteType);

      // Update local state optimistically
      setDeal((prev) => ({
        ...prev,
        score: prev.score + (voteType === "up" ? 1 : -1),
        userVote: voteType,
      }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "You must be logged in to vote.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  const handleColdClick = () => {
    setIsColdPressed(true);
    setShowSnow(true);
    setTimeout(() => {
      setIsColdPressed(false);
      setShowSnow(false);
    }, 2000);
  };

  const handleCalledClick = () => {
    setIsCalledPressed(true);
    setShowFire(true);
    setTimeout(() => {
      setIsCalledPressed(false);
      setShowFire(false);
    }, 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: deal.title,
          text: deal.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Deal link copied to clipboard.",
      });
    }
  };

  const isExpired =
    deal.expired || (deal.expiresAt && isPast(new Date(deal.expiresAt)));
  const discount = deal.originalPrice
    ? Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)
    : null;

  const offerStatus = isExpired ? (
    <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <Flag className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700 dark:text-red-300">
            This deal has expired
          </p>
        </div>
      </div>
    </div>
  ) : null;

  const stickyNav = showStickyNav && (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-secondary border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-lg font-bold">
              DealHunter
            </Link>
            <h1 className="text-lg font-semibold truncate max-w-md">
              {deal.title}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollsToComment}
              className="flex items-center space-x-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{deal._count.comments}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {stickyNav}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link
            href="/"
            className="hover:text-gray-700 dark:hover:text-gray-300"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/category/${deal.category.toLowerCase()}`}
            className="hover:text-gray-700 dark:hover:text-gray-300"
          >
            {deal.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 dark:text-gray-100">{deal.title}</span>
        </nav>

        {/* Main Deal Card */}
        <Card
          ref={dealCardRef}
          className="mb-6 overflow-hidden dark:bg-dark-secondary bg-[#fff] pt-[1.5em] pl-[1.5rem] pr-[1.5rem] pb-[1.5rem]"
        >
          {offerStatus}
          <div className="flex flex-col lg:flex-row">
            {/* Deal Image - 40% width */}
            <div className="lg:w-[45%] lg:flex-shrink-0 lg:h-[400px]">
              <div className="w-full h-full lg:pr-[0.25rem] pt-[1.5em] flex items-center justify-center">
                <Carousel
                  images={
                    deal.images && deal.images.length > 0
                      ? deal.images.map((img) => getImageUrl(img.slug))
                      : ["/placeholder.svg?height=400&width=400"]
                  }
                />
              </div>
            </div>

            {/* Deal Content - 60% width */}
            <div className="lg:w-[55%] p-6">
              <div className="flex flex-col h-full">
                {/* Title and Merchant */}
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {deal.title}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Tag className="h-4 w-4" />
                    <span>{deal.merchant}</span>
                    <span>•</span>
                    <span>{deal.category}</span>
                  </div>
                </div>

                {/* Price and Discount */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl font-bold text-green-600">
                      €{deal.price.toFixed(2)}
                    </span>
                    {deal.originalPrice && deal.originalPrice > deal.price && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          €{deal.originalPrice.toFixed(2)}
                        </span>
                        {discount && (
                          <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                            -{discount}%
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {deal.expiresAt && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>
                        Expires{" "}
                        {format(new Date(deal.expiresAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6 flex-1">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {deal.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <Button
                      size="lg"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      asChild
                    >
                      <a
                        href={deal.dealUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2"
                      >
                        <ExternalLink className="h-5 w-5" />
                        <span>View Deal</span>
                      </a>
                    </Button>
                    <DealCardSaveButton dealId={deal.id} />
                  </div>

                  {/* Voting */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote("up")}
                        disabled={isVoting}
                        className={cn(
                          "flex items-center space-x-1",
                          deal.userVote === "up" &&
                            "bg-green-100 text-green-700"
                        )}
                      >
                        <ArrowBigUp className="h-4 w-4" />
                        <span>{deal.score}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote("down")}
                        disabled={isVoting}
                        className={cn(
                          "flex items-center space-x-1",
                          deal.userVote === "down" && "bg-red-100 text-red-700"
                        )}
                      >
                        <ArrowBigDown className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <button
                        onClick={scrollsToComment}
                        className="flex items-center space-x-1 hover:text-gray-900 dark:hover:text-gray-300"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{deal._count.comments} comments</span>
                      </button>
                      <button
                        onClick={handleShare}
                        className="flex items-center space-x-1 hover:text-gray-900 dark:hover:text-gray-300"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        <div ref={commentRef}>
          <CommentSection dealId={deal.id} />
        </div>

        {/* Related Deals */}
        {relatedDeals.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Deals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDeals.slice(0, 6).map((relatedDeal) => {
                const relatedDiscount = relatedDeal.originalPrice
                  ? Math.round(
                      ((relatedDeal.originalPrice - relatedDeal.price) /
                        relatedDeal.originalPrice) *
                        100
                    )
                  : null;

                return (
                  <Link
                    key={relatedDeal.id}
                    href={`/deals/${
                      (relatedDeal as any).slug || relatedDeal.id
                    }`}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square relative">
                        <Image
                          src={
                            relatedDeal.imageUrls?.[0]?.slug
                              ? getImageUrl(relatedDeal.imageUrls[0].slug)
                              : relatedDeal.imageUrls?.[0]?.url ||
                                "/placeholder.svg?height=200&width=200"
                          }
                          alt={relatedDeal.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm line-clamp-2 mb-2">
                          {relatedDeal.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm">
                          {relatedDeal.price === 0 ? (
                            <span className="font-bold text-green-600">
                              FREE
                            </span>
                          ) : (
                            <span className="font-bold text-primary">
                              €{Number(relatedDeal.price).toFixed(2)}
                            </span>
                          )}
                          {relatedDeal.originalPrice &&
                            relatedDeal.originalPrice > relatedDeal.price && (
                              <span className="text-xs text-muted-foreground line-through">
                                €{Number(relatedDeal.originalPrice).toFixed(2)}
                              </span>
                            )}
                          {relatedDiscount && (
                            <span className="text-xs bg-red-100 text-red-800 px-1 rounded">
                              -{relatedDiscount}%
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
