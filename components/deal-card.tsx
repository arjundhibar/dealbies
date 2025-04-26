"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, ExternalLink, Clock, ChevronUp, ChevronDown } from "lucide-react"
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

  // Determine temperature class based on score
  const getTemperatureClass = () => {
    if (score >= 100) return "temperature-hot"
    if (score >= 50) return "temperature-warm"
    return "temperature-cold"
  }

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
    <Card className={cn("overflow-hidden transition-all hover:shadow-md relative", isExpired && "opacity-70")}>
      {/* Temperature indicator */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", getTemperatureClass())} />

      <div className="flex h-full">
        {/* Vote column */}
        <div className="flex flex-col items-center justify-start pt-4 px-2 ml-1.5 border-r">
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-8 w-8 p-0", userVote === "up" && "text-hotukdeals-red")}
            onClick={() => handleVote("up")}
            disabled={isVoting}
          >
            <ChevronUp className="h-6 w-6" />
            <span className="sr-only">Upvote</span>
          </Button>

          <span className={cn("text-lg font-bold py-1", getTemperatureClass())}>{score}°</span>

          <Button
            variant="ghost"
            size="sm"
            className={cn("h-8 w-8 p-0", userVote === "down" && "text-blue-500")}
            onClick={() => handleVote("down")}
            disabled={isVoting}
          >
            <ChevronDown className="h-6 w-6" />
            <span className="sr-only">Downvote</span>
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Image */}
          <div className="relative h-48 w-full">
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
            {discount && discount >= 10 && (
              <div className="absolute right-2 top-2 bg-hotukdeals-red text-white text-sm font-bold px-2 py-1 rounded">
                -{discount}%
              </div>
            )}
            <Badge className="absolute left-2 top-2">{category}</Badge>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(postedAtDate)}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <Badge variant="outline" className="bg-white">
                {merchant}
              </Badge>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-hotukdeals-red">{formatCurrency(Number(price))}</span>
                {originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(Number(originalPrice))}
                  </span>
                )}
              </div>
            </div>

            <Link href={`/deal/${id}`} className="hover:underline">
              <h3 className="mb-2 line-clamp-2 text-lg font-bold">{title}</h3>
            </Link>

            <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1 px-2" asChild>
                  <Link href={`/deal/${id}#comments`}>
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">{commentCount}</span>
                  </Link>
                </Button>
                <DealCardSaveButton dealId={id} />
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={postedBy.avatar || "/placeholder.svg?height=40&width=40&text=U"}
                    alt={postedBy.name}
                  />
                  <AvatarFallback>{postedBy.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" asChild className="h-8">
                  <a href={dealUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Get Deal
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
