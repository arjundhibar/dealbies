"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, ExternalLink, ChevronUp, ChevronDown, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { isPast } from "date-fns"
import { cn, formatRelativeTime, formatCurrency, calculateDiscount } from "@/lib/utils"
import type { Deal } from "@/lib/types"
import { useData } from "@/lib/data-context"
import { useToast } from "@/hooks/use-toast"
import { DealCardSaveButton } from "@/components/deal-card-save-button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

interface DealCardProps {
  deal: Deal
}

export function DealCard({ deal }: DealCardProps) {
  const {
    id,
    title,
    description,
    imageUrl,
    price,
    originalPrice,
    merchant,
    category,
    score,
    commentCount,
    createdAt,
    postedBy,
    dealUrl,
    userVote,
    expired,
    expiresAt,
  } = deal

  const { voteDeal, currentUser } = useData()
  const { toast } = useToast()
  const router = useRouter()
  const [isVoting, setIsVoting] = useState(false)
  const isMobile = useIsMobile()

  const isExpired = expired || (expiresAt && isPast(new Date(expiresAt)))
  const discount = originalPrice ? calculateDiscount(Number(originalPrice), Number(price)) : null
  const postedAtDate = new Date(createdAt)

  const handleVote = async (voteType: "up" | "down") => {
    if (isVoting) return

    try {
      setIsVoting(true)
      await voteDeal(id, voteType)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "You must be logged in to vote.",
        variant: "destructive",
      })
      if (!currentUser) {
        router.push("/login")
      }
    } finally {
      setIsVoting(false)
    }
  }

  // Mobile layout
  if (isMobile) {
    return (
      <Card className="overflow-hidden shadow-sm">
        <div className="flex w-full">
          {/* Left side - Image with overlay controls */}
          <div className="relative w-1/3">
            {/* Product Image */}
            <div className="relative aspect-[2/4]">
              <Image
                src={imageUrl || "/placeholder.svg?height=400&width=400&query=product"}
                alt={title}
                fill
                className="object-cover z-5"
              />
            </div>

            {/* Top overlay - Voting */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-white/80 rounded-full px-1 py-1 flex items-center ">
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-8 w-8 p-0 rounded-full", userVote === "down" && "text-blue-500")}
                onClick={() => handleVote("down")}
                disabled={isVoting}
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
              <span className="text-lg font-bold text-vote-red">{score}°</span>
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-8 w-8 p-0 rounded-full", userVote === "up" && "text-dealhunter-red")}
                onClick={() => handleVote("up")}
                disabled={isVoting}
              >
                <ChevronUp className="h-5 w-5" />
              </Button>
            </div>

            {/* Bottom overlay - Actions */}
            <div className="absolute bottom-1 text-gray-500 left-[40%] -translate-x-1/2 z-10 flex rounded-full">
              <Link href={`/deal/${id}#comments`}>
                <Button variant="ghost" size="icon" className="p-0 font-semibold">
                  <MessageSquare className="h-5 w-5 " />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="p-0">
                <Share2 className="h-5 w-5" />
              </Button>
              {/* <DealCardSaveButton dealId={id} /> */}
            </div>
          </div>

          {/* Right side - Deal Info */}
          <div className="w-2/3 p-2 flex flex-col justify-between">
            <div>
              <Badge variant="outline" className="bg-gray-100 text-gray-600 font-normal mb-6 ml-20">
                Posted {formatRelativeTime(postedAtDate)}
              </Badge>

              <Link href={`/deal/${id}`} className="hover:text-dealhunter-red">
                <h3 className="text-base font-bold line-clamp-2 mb-1">{title}</h3>
              </Link>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-bold text-dealhunter-red">{formatCurrency(Number(price))}</span>
                {originalPrice && (
                  <>
                    <span className="text-base text-muted-foreground line-through">
                      {formatCurrency(Number(originalPrice))}
                    </span>
                    <span className="text-green-600 text-[14px] font-bold">-{discount}%</span>
                  </>
                )}
              </div>

              <div className="text-[12px] text-muted-foreground mb-1">
                Available at <span className="font-medium">{merchant}</span>
              </div>

              <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                <Avatar className="h-5 w-5">
                  <AvatarImage
                    src={postedBy.avatar || "/placeholder.svg?height=40&width=40&text=U"}
                    alt={postedBy.name}
                  />
                  <AvatarFallback>{postedBy.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>Posted by</span>
                <span className="font-medium">{postedBy.name}</span>
              </div>
            </div>

            <Button
              variant="default"
              size="sm"
              asChild
              className="bg-dealhunter-red hover:bg-dealhunter-redHover mt-4 rounded-full"
            >
              <a href={dealUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                <span>Get Deal</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Desktop layout (your existing layout)
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md h-62 dark:bg-dark-secondary">
      <div className="flex">
        {/* Left side - Product image */}
        <div className="w-[30%] relative p-3 bg-[#0f375f0d] dark:bg-dark-tertiary">
          <div className="relative h-full">
            <Image
              src={imageUrl || "/placeholder.svg?height=400&width=600&query=product"}
              alt={title}
              fill
              className="object-cover"
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
        <div className="w-[70%] p-4 flex flex-col">
          {/* Top section with voting and posted time */}
          <div className="flex justify-between items-center mb-2 ">
            {/* Voting buttons */}
            <div className="flex items-center bg-[#0f375f0d] rounded-full p-1 dark:bg-dark-tertiary">
              <Button
                variant="outline"
                size="icon"
                className={cn("rounded-full border-gray-300 h-7 w-7", userVote === "down" && "text-blue-500")}
                onClick={() => handleVote("down")}
                disabled={isVoting}
              >
                <ChevronDown className="h-5 w-5" />
                <span className="sr-only">Downvote</span>
              </Button>

              <span className="text-lg font-bold text-dealhunter-red mx-2">{score}°</span>

              <Button
                variant="outline"
                size="icon"
                className={cn("rounded-full border-gray-300 h-7 w-7", userVote === "up" && "text-dealhunter-red")}
                onClick={() => handleVote("up")}
                disabled={isVoting}
              >
                <ChevronUp className="h-5 w-5" />
                <span className="sr-only">Upvote</span>
              </Button>
            </div>

            {/* Posted time */}
            <div className="text-sm text-muted-foreground bg-[#0f375f0d] p-1">Posted {formatRelativeTime(postedAtDate)}</div>
          </div>

          {/* Title */}
          <Link href={`/deal/${id}`} className="hover:text-dealhunter-redHover">
            <h3 className="text-lg font-bold">{title}</h3>
          </Link>

          {/* Price section */}
          {/* Price, Merchant, Posted By - All in one line */}
<div className="flex items-center gap-2 my-2 flex-wrap">
  <div className="flex items-center gap-2">
    <span className="text-2xl font-bold text-dealhunter-red">{formatCurrency(Number(price))}</span>
    {originalPrice && (
      <>
        <span className="text-xl text-muted-foreground line-through">
          {formatCurrency(Number(originalPrice))}
        </span>
        <span className="text-green-600 font-bold">-{discount}%</span>
      </>
    )}
  </div>
    <span className="text-gray-500">|</span>
  <div className="flex items-center gap-1 text-sm text-muted-foreground">
    <span>Available at</span>
    <Badge variant="outline" className="bg-white dark:text-white dark:bg-dark-secondary">
      {merchant}
    </Badge>
  </div>

  <div className="flex items-center gap-1 text-sm text-muted-foreground">
    <span>Posted by</span>
    <span className="font-medium">{postedBy.name}</span>
  </div>
</div>


          {/* Description */}
          <p className="line-clamp-2 text-sm text-muted-foreground mb-auto">{description}</p>

          {/* Bottom section with actions */}
          <div className="flex items-center justify-between mt-4 pt-1">
            <div className="flex items-center gap-3 ">
              {/* Comments */}
              <Button variant="ghost" size="sm" className="gap-1 p-0 hover:text-dealhunter-red" asChild>
                <Link href={`/deal/${id}#comments`}>
                  <MessageSquare className="h-4 w-4" />
                  <span className="ml-1">{commentCount}</span>
                </Link>
              </Button>

              {/* Share */}
              <Button variant="ghost" size="sm" className="gap-1 p-0 hover:text-dealhunter-red">
                <Share2 className="h-4 w-4" />
              </Button>

              {/* Save */}
              <DealCardSaveButton dealId={id} />
            </div>

            {/* Get Deal button */}
            <Button
              variant="default"
              size="sm"
              asChild
              className="bg-dealhunter-red hover:bg-dealhunter-redHover rounded-full px-8"
            >
              <a href={dealUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <span className="text-md">Get Deal</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
