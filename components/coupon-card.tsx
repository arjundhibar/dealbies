"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Share2,
  MessagesSquare,
  ArrowBigDown,
  ArrowBigUp,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { isPast } from "date-fns";
import {
  cn,
  formatRelativeTime,
  formatCurrency,
  calculateDiscount,
} from "@/lib/utils";
import type { Coupon } from "@/lib/types";
import { useData } from "@/lib/data-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CouponCardProps {
  coupon: Coupon;
}

export function CouponCard({ coupon }: CouponCardProps) {
  const {
    id,
    title,
    description,
    imageUrls,
    discountCode,
    discountType,
    discountValue,
    availability,
    merchant,
    couponUrl,
    commentCount,
    createdAt,
    postedBy,
    expired,
    expiresAt,
  } = coupon;

  const {
    voteDeal,
    updateDealVote,
    currentUser,
    deals: globalDeals,
  } = useData();

  // Get the current vote state from the global deals array
  const currentDeal = globalDeals.find((d) => d.id === id);
  const score = currentDeal?.score ?? coupon.score;
  const userVote = currentDeal?.userVote ?? coupon.userVote;
  const { toast } = useToast();
  const router = useRouter();
  const [isVoting, setIsVoting] = useState(false);
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();

  const isExpired = expired || (expiresAt && isPast(new Date(expiresAt)));
  const postedAtDate = new Date(createdAt);

  const handleVote = async (voteType: "up" | "down") => {
    if (isVoting) return;

    try {
      setIsVoting(true);

      // Make API call - the voteDeal function will handle all state updates
      await voteDeal(id, voteType);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "You must be logged in to vote.",
        variant: "destructive",
      });
      if (!currentUser) {
        router.push("/login");
      }
    } finally {
      setIsVoting(false);
    }
  };

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(discountCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Discount code copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy discount code.",
        variant: "destructive",
      });
    }
  };

  const handleUseCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (couponUrl) {
      window.open(couponUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Mobile layout
  if (isMobile) {
    return (
      <Link href={`/coupon/${id}`} className="block group">
        <Card className="overflow-hidden shadow-sm border-none">
          <div className="flex flex-grow-0 w-full">
            {/* Left side - Image with overlay controls */}
            <div className="relative w-[8rem] bg-[#f3f5f7] dark:bg-[#28292a] flex items-center justify-center pl-3 pr-3">
              {/* Product Image */}
              <div className="relative w-[7rem] h-[7rem]">
                <Image
                  src={
                    typeof imageUrls?.[0] === "string"
                      ? imageUrls[0]
                      : imageUrls?.[0]?.url ||
                        "/placeholder.svg?height=400&width=400&query=product"
                  }
                  alt={title}
                  fill
                  className="object-cover z-5 rounded-lg"
                />
              </div>

              {/* Top overlay - Voting */}
              <div
                className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex items-center bg-[#fff] rounded-full p-1 gap-2 dark:bg-[#1d1f20]"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 w-7 p-0 rounded-full border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)]",
                    userVote === "down" && "text-blue-500"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleVote("down");
                  }}
                  disabled={isVoting}
                >
                  <ArrowBigDown
                    className="h-6 w-6 scale-[1.5] scale-x-[1] text-[#005498] dark:text-[#5aa4f1]"
                    strokeWidth={1.5}
                  />
                </Button>
                <span className="text-lg font-bold text-vote-lightOrange">
                  {score}°
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 w-7 p-0 rounded-full border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)]",
                    userVote === "up" && "text-dealhunter-red"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleVote("up");
                  }}
                  disabled={isVoting}
                >
                  <ArrowBigUp
                    className="h-6 w-6 scale-[1.5] scale-x-[1] text-[#ce1734] dark:text-[#f97778]"
                    strokeWidth={1.5}
                  />
                </Button>
              </div>

              {/* Bottom overlay - Actions */}
              <div
                className="absolute bottom-1 text-gray-500 left-[40%] -translate-x-1/2 z-10 flex rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={`/coupon/${id}#comments`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-0 font-semibold"
                  >
                    <MessagesSquare className="h-5 w-5 dark:text-[hsla(0,0%,100%,0.75)] dark:hover:text-dealhunter-red" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="p-0">
                  <Share2 className="h-5 w-5 dark:text-[hsla(0,0%,100%,0.75)] dark:hover:text-dealhunter-red" />
                </Button>
              </div>
            </div>

            {/* Right side - Coupon Info */}
            <div className="w-[75%] p-2 flex flex-col dark:bg-[#1d1f20]">
              <div className="flex-grow">
                <div className="flex justify-end mb-6">
                  <div className="text-sm text-muted-foreground pl-[0.5rem] pr-[0.5rem] pb-[0.25rem] pt-[0.25rem] rounded-md dark:bg-[hsla(0,0%,100%,0.11)] dark:text-[hsla(0,0%,100%,0.75)] bg-[#0f375f0d] ">
                    Posted {formatRelativeTime(postedAtDate)}
                  </div>
                </div>

                <h3 className="text-base font-bold mb-1 leading-[1.5rem] group-hover:text-[#f7641b] line-clamp-1">
                  {title}
                </h3>

                <div className="flex items-center gap-2 mb-1 leading-none">
                  <span className="text-xl font-bold text-[#f7641b] dark:text-[#f97936]">
                    {discountType === "percentage"
                      ? `${discountValue}% OFF`
                      : discountType === "euro"
                      ? `${discountValue}€ OFF`
                      : discountType === "freeShipping"
                      ? "FREE SHIPPING"
                      : discountCode}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground mb-1 leading-none">
                  Available at{" "}
                  <Badge
                    variant="outline"
                    className="text-sm bg-white dark:text-white dark:bg-dark-secondary"
                  >
                    {merchant}
                  </Badge>
                </div>

                <div className="flex items-center text-[12px] gap-1 text-muted-foreground leading-none">
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src={
                        postedBy.avatar ||
                        "/placeholder.svg?height=40&width=40&text=U"
                      }
                      alt={postedBy.name}
                      className="h-5 w-5 object-cover"
                    />
                    <AvatarFallback>
                      {postedBy.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>Posted by</span>
                  <span className="font-medium">{postedBy.name}</span>
                </div>
              </div>

              {/* Discount Code Button */}
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-dashed border-[#f7641b] text-[#f7641b] hover:bg-[#f7641b] hover:text-white rounded-l-[50vh] rounded-r-none h-9 px-4 border-r-0"
                  onClick={handleCopyCode}
                >
                  <span className="text-[0.875rem] font-bold">
                    {discountCode}
                  </span>
                  {copied ? (
                    <Check className="ml-1 h-3 w-3" />
                  ) : (
                    <Copy className="ml-1 h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#f7641b] hover:bg-[#eb611f] active:bg-[#da5a1c] shadow-[#f7641b] hover:shadow-[#eb611f] rounded-r-[50vh] rounded-l-none h-9 px-4 border-l-0"
                  onClick={handleUseCode}
                >
                  <span className="text-[0.875rem] font-bold text-white">
                    Use
                  </span>
                  <ExternalLink className="ml-1 h-3 w-3 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Desktop layout
  return (
    <Link href={`/coupon/${id}`} className="block group">
      <Card className="overflow-hidden shadow-sm hover:shadow-md dark:bg-dark-secondary cursor-pointer min-h-[14.25rem] border-none">
        <div className="flex">
          {/* Left side - Product image */}
          <div className="w-[14.125rem] p-[0.75rem]  relative bg-[#0f375f0d] dark:bg-dark-tertiary">
            <div className="relative h-full">
              <Image
                src={
                  typeof imageUrls?.[0] === "string"
                    ? imageUrls[0]
                    : imageUrls?.[0]?.url ||
                      "/placeholder.svg?height=400&width=600&query=product"
                }
                alt={title}
                fill
                className="object-cover rounded-lg"
              />
              {isExpired && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Badge variant="destructive" className="text-lg">
                    Expired
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Content */}
          <div className="w-[78%] p-4 flex flex-col">
            {/* Top section with voting and posted time */}
            <div className="flex justify-between items-center mb-2 ">
              {/* Voting buttons */}
              <div
                className="flex items-center bg-[#0f375f0d] rounded-full p-1 dark:bg-dark-tertiary"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "rounded-full border-[hsla(0,0%,100%,0.35)] h-7 w-7",
                    userVote === "down" && "text-blue-500"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleVote("down");
                  }}
                  disabled={isVoting}
                >
                  <ArrowBigDown
                    className="h-6 w-6 scale-[1.5] scale-x-[1.1]  text-[#005498] dark:text-[#5aa4f1]"
                    strokeWidth={1.5}
                  />
                  <span className="sr-only">Downvote</span>
                </Button>

                <span className="text-lg font-bold text-dealhunter-red mx-2">
                  {score}°
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "rounded-full border-[hsla(0,0%,100%,0.35)] h-7 w-7",
                    userVote === "up" && "text-dealhunter-red"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleVote("up");
                  }}
                  disabled={isVoting}
                >
                  <ArrowBigUp
                    className="h-6 w-6 scale-[1.5] scale-x-[1.1] text-[#ce1734] dark:text-[#f97778]"
                    strokeWidth={1.5}
                  />
                  <span className="sr-only">Upvote</span>
                </Button>
              </div>

              {/* Posted time */}
              <div className="text-sm text-muted-foreground pl-[0.5rem] pr-[0.5rem] pb-[0.25rem] pt-[0.25rem] rounded-sm dark:bg-[hsla(0,0%,100%,0.11)] dark:text-[hsla(0,0%,100%,0.75)] bg-[#0f375f0d] ">
                Posted {formatRelativeTime(postedAtDate)}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold group-hover:text-[#f7641b] line-clamp-1">
              {title}
            </h3>

            {/* Discount section */}
            <div className="flex items-center gap-2 my-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#f7641b] dark:text-[#f97936]">
                  {discountType === "percentage"
                    ? `${discountValue}% OFF`
                    : discountType === "euro"
                    ? `${discountValue}€ OFF`
                    : discountType === "freeShipping"
                    ? "FREE SHIPPING"
                    : discountCode}
                </span>
              </div>
              <span className="text-gray-500">|</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-[hsla(0,0%,100%,0.75)]">
                <span>Available at</span>
                <Badge
                  variant="outline"
                  className="bg-white dark:text-white dark:bg-dark-secondary"
                >
                  {merchant}
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-[hsla(0,0%,100%,0.75)]">
                <Avatar className="h-5 w-5">
                  <AvatarImage
                    src={
                      postedBy.avatar ||
                      "./kishan.jpeg?height=40&width=40&text=U"
                    }
                    alt={postedBy.name}
                    className="h-5 w-5 object-cover"
                  />
                  <AvatarFallback>
                    {postedBy.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>Posted by</span>
                <span className="font-medium">{postedBy.name}</span>
              </div>
            </div>

            {/* Description */}
            <p className="line-clamp-2 text-sm text-muted-foreground mb-auto">
              {description}
            </p>

            {/* Bottom section with actions */}
            <div className="flex items-center justify-between mt-4 pt-1">
              <div
                className="flex items-center gap-3 "
                onClick={(e) => e.stopPropagation()}
              >
                {/* Comments */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 p-0 hover:text-dealhunter-red shadow-none focus:outline-none focus:ring-0"
                  asChild
                >
                  <Link href={`/coupon/${id}#comments`}>
                    <MessagesSquare className="h-4 w-4" />
                    <span className="ml-1">{commentCount}</span>
                  </Link>
                </Button>

                {/* Share */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 p-0 hover:text-dealhunter-red"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Discount Code and Use buttons */}
              <div className="flex">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-dashed border-[#f7641b] text-[#f7641b] hover:bg-[#f7641b] hover:text-white rounded-l-[50vh] rounded-r-none h-9 px-4 border-r-0"
                  onClick={handleCopyCode}
                >
                  <span className="text-[0.875rem] font-bold">
                    {discountCode}
                  </span>
                  {copied ? (
                    <Check className="ml-1 h-3 w-3" />
                  ) : (
                    <Copy className="ml-1 h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#f7641b] -ml-2 hover:bg-[#eb611f] active:bg-[#da5a1c] shadow-[#f7641b] hover:shadow-[#eb611f] rounded-r-full rounded-l-full h-9 px-4 border-l-0"
                  onClick={handleUseCode}
                >
                  <span className="text-[0.875rem] font-bold text-white">
                    Copy and use
                  </span>
                  <ExternalLink className="ml-1 h-3 w-3 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
