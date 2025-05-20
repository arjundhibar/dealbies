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

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md">
      <div className="flex">
        {/* Left side - Product image */}
        <div className="w-[40%] relative">
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
        <div className="w-[60%] p-4 flex flex-col">
          {/* Top section with voting and posted time */}
          <div className="flex justify-between items-center mb-2">
            {/* Voting buttons */}
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className={cn("rounded-full border-gray-300 h-10 w-10", userVote === "down" && "text-blue-500")}
                onClick={() => handleVote("down")}
                disabled={isVoting}
              >
                <ChevronDown className="h-5 w-5" />
                <span className="sr-only">Downvote</span>
              </Button>

              <span className="text-xl font-bold text-hotukdeals-red mx-2">{score}°</span>

              <Button
                variant="outline"
                size="icon"
                className={cn("rounded-full border-gray-300 h-10 w-10", userVote === "up" && "text-hotukdeals-red")}
                onClick={() => handleVote("up")}
                disabled={isVoting}
              >
                <ChevronUp className="h-5 w-5" />
                <span className="sr-only">Upvote</span>
              </Button>
            </div>

            {/* Posted time */}
            <div className="text-sm text-muted-foreground">Posted {formatRelativeTime(postedAtDate)}</div>
          </div>

          {/* Title */}
          <Link href={`/deal/${id}`} className="hover:underline">
            <h3 className="text-xl font-bold mb-1">{title}</h3>
          </Link>

          {/* Price section */}
          <div className="flex items-center gap-2 my-2">
            <span className="text-2xl font-bold text-hotukdeals-red">{formatCurrency(Number(price))}</span>
            {originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatCurrency(Number(originalPrice))}
                </span>
                <span className="text-green-600 font-bold">-{discount}%</span>
              </>
            )}
          </div>

          {/* Available at */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-muted-foreground">Available at</span>
            <Badge variant="outline" className="bg-white">
              {merchant}
            </Badge>

            {/* Posted by */}
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-sm text-muted-foreground">Posted by</span>
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={postedBy.avatar || "/placeholder.svg?height=40&width=40&text=U"}
                  alt={postedBy.name}
                />
                <AvatarFallback>{postedBy.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{postedBy.name}</span>
            </div>
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-muted-foreground mb-auto">{description}</p>

          {/* Bottom section with actions */}
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-3">
              {/* Comments */}
              <Button variant="ghost" size="sm" className="gap-1 p-0" asChild>
                <Link href={`/deal/${id}#comments`}>
                  <MessageSquare className="h-4 w-4" />
                  <span className="ml-1">{commentCount}</span>
                </Link>
              </Button>

              {/* Share */}
              <Button variant="ghost" size="sm" className="gap-1 p-0">
                <Share2 className="h-4 w-4" />
              </Button>

              {/* Save */}
              <DealCardSaveButton dealId={id} />
            </div>

            {/* Get Deal button */}
            <Button variant="default" size="sm" asChild className="bg-orange-500 hover:bg-orange-600">
              <a href={dealUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <span>Get Deal</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
