"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { useData } from "@/lib/data-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, ExternalLink, Share2 } from "lucide-react"
import { formatDistanceToNow, isPast } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { CommentSection } from "@/components/comment-section"
import type { Deal } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { DealCardSaveButton } from "@/components/deal-card-save-button"

export default function DealPage() {
  const params = useParams()
  const id = params.id as string
  const { getDeal, getRelatedDeals, voteDeal } = useData()
  const [deal, setDeal] = useState<Deal | undefined>(undefined)
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDealData = async () => {
      setLoading(true)
      try {
        const dealData = await getDeal(id)
        if (!dealData) {
          notFound()
        }
        setDeal(dealData)

        const related = await getRelatedDeals(id)
        setRelatedDeals(related)
      } catch (error) {
        console.error("Error fetching deal:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchDealData()
  }, [id, getDeal, getRelatedDeals])

  const handleVote = async (voteType: "up" | "down") => {
    try {
      if (!deal) return
      await voteDeal(deal.id, voteType)

      // Refresh deal data
      const updatedDeal = await getDeal(id)
      if (updatedDeal) {
        setDeal(updatedDeal)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "You must be logged in to vote.",
        variant: "destructive",
      })
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: deal?.title,
          text: `Check out this deal: ${deal?.title}`,
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error)
        })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Deal link copied to clipboard.",
      })
    }
  }

  if (loading || !deal) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="animate-pulse">
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    )
  }

  const {
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

  const isExpired = expired || (expiresAt && isPast(new Date(expiresAt)))
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null
  const postedAtDate = new Date(createdAt)

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge>{category}</Badge>
              <Badge variant="outline">{merchant}</Badge>
              {isExpired && <Badge variant="destructive">Expired</Badge>}
              <span className="text-sm text-muted-foreground">
                Posted {formatDistanceToNow(postedAtDate, { addSuffix: true })}
              </span>
            </div>

            <h1 className="mb-4 text-2xl font-bold sm:text-3xl">{title}</h1>

            <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={imageUrl || "/placeholder.svg?height=600&width=1200"}
                alt={title}
                fill
                className="object-cover"
              />
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">₹{Number(price).toFixed(2)}</span>
                {originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                    ₹{Number(originalPrice).toFixed(2)}
                    </span>
                    {discount && <Badge className="bg-red-500">-{discount}%</Badge>}
                  </>
                )}
              </div>

              <Button size="lg" asChild>
                <a href={dealUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Get Deal
                </a>
              </Button>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-10 rounded-r-none px-3",
                    userVote === "up" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                  )}
                  onClick={() => handleVote("up")}
                >
                  <ThumbsUp className="h-5 w-5" />
                </Button>
                <span
                  className={cn(
                    "flex h-10 min-w-[3rem] items-center justify-center px-2 text-lg font-medium",
                    score > 0
                      ? "text-green-600 dark:text-green-400"
                      : score < 0
                        ? "text-red-600 dark:text-red-400"
                        : "",
                  )}
                >
                  {score}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-10 rounded-l-none px-3",
                    userVote === "down" && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
                  )}
                  onClick={() => handleVote("down")}
                >
                  <ThumbsDown className="h-5 w-5" />
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>

              <DealCardSaveButton dealId={id} />

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={postedBy.avatar || "/placeholder.svg"} alt={postedBy.name} />
                  <AvatarFallback>{postedBy.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  Posted by <span className="font-medium">{postedBy.name}</span>
                </span>
              </div>
            </div>

            <div className="prose max-w-none dark:prose-invert">
              <p>{description}</p>
            </div>
          </div>

          <CommentSection dealId={id} />
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="mb-4 text-lg font-bold">Related Deals</h3>
            {relatedDeals.length > 0 ? (
              <div className="space-y-4">
                {relatedDeals.map((relatedDeal) => (
                  <div key={relatedDeal.id} className="flex gap-3 border-b pb-3 last:border-0">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        src={relatedDeal.imageUrl || "/placeholder.svg?height=100&width=100"}
                        alt={relatedDeal.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/deal/${relatedDeal.id}`} className="font-medium hover:underline">
                        {relatedDeal.title}
                      </Link>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>₹{Number(relatedDeal.price).toFixed(2)}</span>
                        <span>•</span>
                        <span>{relatedDeal.merchant}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No related deals found.</p>
            )}
          </Card>

          <Card className="p-4">
            <h3 className="mb-4 text-lg font-bold">Deal Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posted by:</span>
                <span className="font-medium">{postedBy.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Merchant:</span>
                <span className="font-medium">{merchant}</span>
              </div>
              {expiresAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-medium">{formatDistanceToNow(new Date(expiresAt), { addSuffix: true })}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
