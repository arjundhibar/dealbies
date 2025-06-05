"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { useData } from "@/lib/data-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, ExternalLink, Share2, MessageCircle, ChevronDown, ChevronUp } from "lucide-react"
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
  const [isVoting, setIsVoting] = useState(false)

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

    } finally {
      setIsVoting(false)
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
    <div className="mx-auto max-w-[82.5rem] px-4 w-full box-border">
      {/* Main Deal Card */}
      <Card className="mb-6 overflow-hidden dark:bg-dark-secondary">
        <div className="flex flex-col lg:flex-row">
          {/* Deal Image */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <div className="relative aspect-square lg:h-80 w-full">
              <Image
                src={imageUrl || "/placeholder.svg?height=400&width=400"}
                alt={title}
                fill
                className="object-cover"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-3 right-3 bg-black/50 text-white hover:bg-black/70"
              >
                Enlarge
              </Button>
            </div>
          </div>

          {/* Deal Content */}
          <div className="flex-1 p-6">
            {/* Header with voting and actions */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
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
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 ">
                <Button variant="ghost" size="sm" className="gap-1 hover:text-dealhunter-redHover">
                  <MessageCircle className="h-4 w-4 " />
                  {commentCount}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1 hover:text-dealhunter-redHover">
                  <Share2 className="h-4 w-4" />
                  To share
                </Button>
                <DealCardSaveButton dealId={id} />
              </div>
            </div>

            {/* Posted time */}
            <p className="text-sm text-muted-foreground mb-3">
              Posted {formatDistanceToNow(postedAtDate, { addSuffix: true })}
            </p>

            {/* Deal title */}
            <h1 className="text-2xl font-bold mb-4">{title}</h1>

            {/* Merchant info */}
            <p className="text-muted-foreground mb-6">
              Available at <span className="text-black font-medium">{merchant}</span>
            </p>

            {/* Deal button */}
            <Button size="lg" className="w-full lg:w-auto bg-orange-500 hover:bg-orange-600 rounded-full" asChild>
              <a href={dealUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                To deal
              </a>
            </Button>
          </div>
        </div>
      </Card>

      {/* Voting feedback section */}
      <Card className="mb-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">Your vote helps us show you the best deals. What do you think?</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
              <span className="text-xs">?</span>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <span className="text-blue-500">❄️</span>
              Cold
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <span className="text-red-500">🔥</span>
              Is called
            </Button>
          </div>
        </div>
      </Card>

      {/* About this offer section */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">About this offer</h2>

          {/* Posted by info */}
          <div className="flex items-center gap-3 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarImage src={postedBy.avatar || "/placeholder.svg"} alt={postedBy.name} />
              <AvatarFallback>{postedBy.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Posted by {postedBy.name}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">📅 Member since 2020</span>
                <span className="flex items-center gap-1">🏷️ 47</span>
                <span className="flex items-center gap-1">👍 907</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose max-w-none dark:prose-invert mb-6">
            <p>{description}</p>
          </div>

          {/* Price info */}
          {(price || originalPrice) && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {price && <span className="text-2xl font-bold text-primary">₹{Number(price).toFixed(2)}</span>}
                {originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{Number(originalPrice).toFixed(2)}
                  </span>
                )}
                {discount && <Badge className="bg-red-500">-{discount}%</Badge>}
              </div>
            </div>
          )}

          {/* Additional info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Badge variant="outline">{category}</Badge>
            <Badge variant="outline">{merchant}</Badge>
            {isExpired && <Badge variant="destructive">Expired</Badge>}
          </div>

          {/* More details link */}
          <Button variant="outline" size="sm" className="gap-2">
            📄 More details at {merchant}
          </Button>

          {/* Disclaimer */}
          <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
            <p className="italic">Modified by moderator, {formatDistanceToNow(postedAtDate, { addSuffix: true })}</p>
            <p className="mt-2">
              If you click on a link and/or order something, dealhunter may receive a payment from the seller. This has
              no influence on the decision to place an offer or not. For more information, see the FAQ and About Us
              page.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-2">
              💬 New response
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              📌 Save
            </Button>
          </div>
        </div>
      </Card>

      {/* Related deals section */}
      {relatedDeals.length > 0 && (
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {relatedDeals.slice(0, 6).map((relatedDeal) => {
                const relatedDiscount = relatedDeal.originalPrice
                  ? Math.round(((relatedDeal.originalPrice - relatedDeal.price) / relatedDeal.originalPrice) * 100)
                  : null

                return (
                  <Link key={relatedDeal.id} href={`/deal/${relatedDeal.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square relative">
                        <Image
                          src={relatedDeal.imageUrl || "/placeholder.svg?height=200&width=200"}
                          alt={relatedDeal.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm line-clamp-2 mb-2">{relatedDeal.title}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          {relatedDeal.price === 0 ? (
                            <span className="font-bold text-green-600">FREE</span>
                          ) : (
                            <span className="font-bold text-primary">₹{Number(relatedDeal.price).toFixed(2)}</span>
                          )}
                          {relatedDeal.originalPrice && relatedDeal.originalPrice > relatedDeal.price && (
                            <span className="text-xs text-muted-foreground line-through">
                              ₹{Number(relatedDeal.originalPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                        {relatedDiscount && (
                          <span className="text-xs text-green-600 font-medium">-{relatedDiscount}%</span>
                        )}
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Comments section */}
      <CommentSection dealId={id} />
    </div>
  )
}
