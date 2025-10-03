// app/coupons/[slug]/coupon-page-client.tsx - Client component for coupon page

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
  ChevronRight,
  Clock,
  ArrowBigDown,
  ArrowBigUp,
  CalendarDays,
  Tag,
  Copy,
  Check,
} from "lucide-react";
import { formatDistanceToNow, isPast, format } from "date-fns";
import { cn, getImageUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CommentSection } from "@/components/comment-section";
import type { Coupon } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel } from "@/components/ui/carousel";

interface CouponPageClientProps {
  coupon: Coupon & {
    images: Array<{ slug: string; url: string; cloudflareUrl: string }>;
    user: { username: string; avatarUrl?: string };
    _count: { comments: number };
    votes: Array<{ voteType: string; userId: string }>;
  };
}

export default function CouponPageClient({
  coupon: initialCoupon,
}: CouponPageClientProps) {
  const { voteCoupon, updateCouponVote, currentUser } = useData();
  const [coupon, setCoupon] = useState(initialCoupon);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const isMobile = useIsMobile();
  const [showStickyNav, setShowStickyNav] = useState(false);
  const couponCardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

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

  // Sticky navigation effect
  useEffect(() => {
    const handleScroll = () => {
      if (couponCardRef.current) {
        const rect = couponCardRef.current.getBoundingClientRect();
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
      await voteCoupon(coupon.id, voteType);

      // Update local state optimistically
      setCoupon((prev) => ({
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

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(coupon.discountCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Coupon code copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy coupon code.",
        variant: "destructive",
      });
    }
  };

  const handleUseCode = () => {
    if (coupon.couponUrl) {
      window.open(coupon.couponUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: coupon.title,
          text: coupon.description,
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
        description: "Coupon link copied to clipboard.",
      });
    }
  };

  const isExpired =
    coupon.expired || (coupon.expiresAt && isPast(new Date(coupon.expiresAt)));

  const offerStatus = isExpired ? (
    <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <Clock className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700 dark:text-red-300">
            This coupon has expired
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
              {coupon.title}
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
              <span>{coupon._count.comments}</span>
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
            href={`/category/${coupon.category.toLowerCase()}`}
            className="hover:text-gray-700 dark:hover:text-gray-300"
          >
            {coupon.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 dark:text-gray-100">
            {coupon.title}
          </span>
        </nav>

        {/* Main Coupon Card */}
        <Card
          ref={couponCardRef}
          className="mb-6 overflow-hidden dark:bg-dark-secondary bg-[#fff] pt-[1.5em] pl-[1.5rem] pr-[1.5rem] pb-[1.5rem]"
        >
          {offerStatus}
          <div className="flex flex-col lg:flex-row">
            {/* Coupon Image - 40% width */}
            <div className="lg:w-[45%] lg:flex-shrink-0 lg:h-[400px]">
              <div className="w-full h-full lg:pr-[0.25rem] pt-[1.5em] flex items-center justify-center">
                <Carousel
                  images={
                    coupon.images && coupon.images.length > 0
                      ? coupon.images.map((img) => getImageUrl(img.slug))
                      : ["/placeholder.svg?height=400&width=400"]
                  }
                />
              </div>
            </div>

            {/* Coupon Content - 60% width */}
            <div className="lg:w-[55%] p-6">
              <div className="flex flex-col h-full">
                {/* Title and Merchant */}
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {coupon.title}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Tag className="h-4 w-4" />
                    <span>{coupon.merchant}</span>
                    <span>•</span>
                    <span>{coupon.category}</span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Coupon Code
                        </p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {coupon.discountCode}
                        </p>
                      </div>
                      <Button
                        onClick={handleCopyCode}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        <span>{copied ? "Copied!" : "Copy"}</span>
                      </Button>
                    </div>
                  </div>

                  {coupon.expiresAt && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>
                        Expires{" "}
                        {format(new Date(coupon.expiresAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6 flex-1">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {coupon.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <Button
                      size="lg"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={handleUseCode}
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      <span>Use Coupon</span>
                    </Button>
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
                          coupon.userVote === "up" &&
                            "bg-green-100 text-green-700"
                        )}
                      >
                        <ArrowBigUp className="h-4 w-4" />
                        <span>{coupon.score}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote("down")}
                        disabled={isVoting}
                        className={cn(
                          "flex items-center space-x-1",
                          coupon.userVote === "down" &&
                            "bg-red-100 text-red-700"
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
                        <span>{coupon._count.comments} comments</span>
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
          <CommentSection couponId={coupon.id} />
        </div>
      </div>
    </>
  );
}
