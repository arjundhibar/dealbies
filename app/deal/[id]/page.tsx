"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, notFound } from "next/navigation"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {  ExternalLink, Share2, MessageCircle, ChevronDown, ChevronUp, Clock, ArrowBigDown, ArrowBigUp, CalendarDays, Tag, ThumbsUp, MessageSquare, Hourglass, Flag } from "lucide-react"
import { formatDistanceToNow, isPast, format } from "date-fns"
import { cn, formatCurrency } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { CommentSection } from "@/components/comment-section"
import type { Deal } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { DealCardSaveButton } from "@/components/deal-card-save-button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Carousel } from "@/components/ui/carousel";

export default function DealPage() {
  const params = useParams()
  const id = params.id as string
  const { getDeal, getRelatedDeals, voteDeal, updateDealVote } = useData()
  const [deal, setDeal] = useState<Deal | undefined>(undefined)
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [isVoting, setIsVoting] = useState(false)
  const isMobile = useIsMobile()
  const [showStickyNav, setShowStickyNav] = useState(false)
  const dealCardRef = useRef<HTMLDivElement>(null)
  const [isColdPressed, setIsColdPressed] = useState(false)
  const [isCalledPressed, setIsCalledPressed] = useState(false)
  const [showSnow, setShowSnow] = useState(false);
  const [posterUser, setPosterUser] = useState<any>(null)
  const [posterLoading, setPosterLoading] = useState(true)

  // Add effect to hide navbar when sticky nav is shown
  useEffect(() => {
    const navbar = document.querySelector('header')
    if (navbar) {
      if (showStickyNav) {
        navbar.style.display = 'none'
      } else {
        navbar.style.display = 'block'
      }
    }

    return () => {
      if (navbar) {
        navbar.style.display = 'block'
      }
    }
  }, [showStickyNav])

  useEffect(() => {
    const fetchDealData = async () => {
      setLoading(true)
      try {
        const dealData = await getDeal(id)
        console.log("this is the deal data in useeffect", dealData)
        // if (!dealData) {
        //   notFound()
        // }
        setDeal(dealData)

        // Fetch poster user data
        if (dealData?.postedBy?.id) {
          try {
            // We need to fetch user by ID instead of email since postedBy doesn't have email
            const userResponse = await fetch(`/api/users/${dealData.postedBy.id}`)
            if (userResponse.ok) {
              const userData = await userResponse.json()
              setPosterUser(userData)
            }
          } catch (error) {
            console.error("Error fetching poster user:", error)
          } finally {
            setPosterLoading(false)
          }
        }

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

  // Handle scroll for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      if (dealCardRef.current) {
        const rect = dealCardRef.current.getBoundingClientRect()
        setShowStickyNav(rect.top <= 0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleColdClick = () => {
  setIsColdPressed((prev) => !prev);
  setShowSnow(true);

  // Remove emoji after animation (600ms matches animation duration)
  setTimeout(() => setShowSnow(false), 600);
};

  
  // useEffect(() => {
  //   const fetchDealData = async () => {
  //     const cached = localStorage.getItem(`deal-${id}`)
  //     if (cached) {
  //       setDeal(JSON.parse(cached))
  //       return
  //     }

  //     setLoading(true)
  //     try {
  //       const dealData = await getDeal(id)
  //       if (!dealData) notFound()
  //       setDeal(dealData)
  //       localStorage.setItem(`deal-${id}`, JSON.stringify(dealData))

  //       const related = await getRelatedDeals(id)
  //       setRelatedDeals(related)
  //     } catch (error) {
  //       console.error("Error fetching deal:", error)
  //       notFound()
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchDealData()
  // }, [id])



  const handleVote = async (voteType: "up" | "down") => {
    if (isVoting || !deal) return

    try {
      setIsVoting(true)
      
      // Optimistically update the UI
      const currentScore = deal.score
      const currentUserVote = deal.userVote
      let newScore = currentScore
      let newUserVote: "up" | "down" | undefined = voteType

      if (currentUserVote === voteType) {
        // Remove vote
        newScore = voteType === "up" ? currentScore - 1 : currentScore + 1
        newUserVote = undefined
      } else if (currentUserVote) {
        // Change vote
        newScore = voteType === "up" ? currentScore + 2 : currentScore - 2
      } else {
        // New vote
        newScore = voteType === "up" ? currentScore + 1 : currentScore - 1
      }

      // Update local state immediately
      setDeal(prev => prev ? { ...prev, score: newScore, userVote: newUserVote } : prev)
      
      // Update global state
      updateDealVote(id, newScore, newUserVote)

      // Make API call
      await voteDeal(id, voteType)
    } catch (error: any) {
      // Revert optimistic update on error
      if (deal) {
        setDeal(prev => prev ? { ...prev, score: deal.score, userVote: deal.userVote } : prev)
        updateDealVote(id, deal.score, deal.userVote)
      }
      
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
    startAt,
    imageUrls
  } = deal
  console.log("this is the deal data in page[]id lauda lehsun", deal)
  const isExpired = expired || (expiresAt && isPast(new Date(expiresAt)))
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null
  const postedAtDate = new Date(createdAt)

  const now = new Date();
  const startAtDate = startAt ? new Date(startAt) : null;
  const expiresAtDate = expiresAt ? new Date(expiresAt) : null;
  let offerStatus = null;
  if (startAtDate && now < startAtDate) {
    offerStatus = (
      <div className="flex items-center gap-2 mb-4 w-full justify-center text-[var(--textStatusInfo)] dark:text-blue-400 text-base font-normal text-center bg-[var(--bgStatusInfoMuted)] dark:bg-[var(--bgStatusInfoMuted)] rounded-md py-4 mr-2">
        <Clock className="h-5 w-5" />
        <span>
          This offer will start on {format(startAtDate, "MMMM d, yyyy 'at' HH:mm")}
        </span>
      </div>
    );
  } else if (expiresAtDate) {
    offerStatus = (
      <div className="flex items-center gap-2 mb-4 w-full justify-center text-[var(--textStatusInfo)] dark:text-blue-400 text-base font-normal text-center bg-[var(--bgStatusInfoMuted)] dark:bg-[var(--bgStatusInfoMuted)] rounded-md py-4 mr-2">
        <Clock className="h-5 w-5" />
        <span>
          This offer expires on {format(expiresAtDate, "MMMM d, yyyy 'at' HH:mm")}
        </span>
      </div>
    );
  }

  // Mobile layout
  if (isMobile) {
    return (
      <div className={`w-full px-4 ${showStickyNav ? 'pt-16' : ''}`}>
        {/* Sticky Navigation for Mobile */}
        {showStickyNav && (
                  <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1d1f20] border-b border-[#dfe1e4] dark:border-[#46484b] shadow-sm h-16">
          <div className="flex items-center justify-between h-full px-4">
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

              {/* Deal title (truncated) */}
              <div className="flex-1 mx-3">
                <h2 className="text-sm font-semibold truncate">
                  {title}
                </h2>
              </div>

              {/* Deal button */}
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 rounded-full" asChild>
                <a href={dealUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Main Deal Card */}
        <Card ref={dealCardRef} className="mb-6 overflow-hidden dark:bg-dark-secondary">
          <div className="flex flex-col">
            {/* Deal Image */}
            {/* <div className="w-full">
              <div className="relative w-full h-[228px]">
                <Image
                  src={imageUrls[0] || "/placeholder.svg?height=400&width=400"}
                  alt={title}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-2 right-2 rounded-[50vh] border border-[#dfe1e4] hover:border-[#d7d9dd] active:border-[#ced0d3] hover:bg-[#f3f5f7] active:bg-[#eceef0] text-[#6b6d70] hover:text-[#76787b] active:text-[#818386] cursor-pointer h-9 px-4 font-bold text-[0.875rem] whitespace-nowrap overflow-hidden text-ellipsis bg-white"
                >
                  <MoveDiagonal />
                  Enlarge
                </Button>
              </div>
            </div> */}

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
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-1 hover:text-dealhunter-redHover">
                    <MessageCircle className="h-4 w-4" />
                    {commentCount}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1 hover:text-dealhunter-redHover">
                    <Share2 className="h-4 w-4" />
                    To share
                  </Button>
                   <div className="flex items-center gap-1">
    <DealCardSaveButton dealId={id} />
    <span className="text-sm font-medium">Save</span>
  </div>
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
              <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600 rounded-full" asChild>
                <a href={dealUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  To deal
                </a>
              </Button>
            </div>
          </div>
        </Card>

        {/* About this offer section for mobile */}
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
                <p className="text-xs">Posted by <span className="text-sm font-bold"> {postedBy.name} </span></p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {posterLoading ? (
                    <>
                      <span className="flex items-center gap-1">📅 Loading...</span>
                      <span className="flex items-center gap-1">🏷️ Loading...</span>
                      <span className="flex items-center gap-1">👍 Loading...</span>
                    </>
                  ) : posterUser ? (
                    <>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" /> Member since {new Date(posterUser.createdAt).getFullYear()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-4 w-4" /> {posterUser.dealsPosted || 0} deals
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" /> {posterUser.votesGiven || 0} votes
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" /> Member since {new Date(createdAt).getFullYear()}
                      </span>
                      <span className="flex items-center gap-1">🏷️ --</span>
                      <span className="flex items-center gap-1">👍 --</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none dark:prose-invert mb-6">
              <div 
                className="rich-text-content"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>

            {/* More details link */}
            <Button variant="outline" size="sm" className="gap-2">
              📄 More details at {merchant}
            </Button>

            {/* Disclaimer */}
            <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
              <p className="mt-2">
                If you click on a link and/or order something, dealhunter may receive a payment from the seller. This has
                no influence on the decision to place an offer or not. For more information, see the FAQ and About Us
                page.
              </p>
            </div>
          </div>
        </Card>

        {/* Comments section */}
        <CommentSection dealId={id} />
      </div>
    )
  }

  // Desktop layout
  return (
    <div className={`w-full px-4 lg:w-[1000px] lg:px-0 mx-auto ${showStickyNav ? 'pt-16' : ''}`}>
      {/* Sticky Navigation */}
      {showStickyNav && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1d1f20] border-b border-[#dfe1e4] dark:border-[#46484b] shadow-sm h-16">
          <div className="w-full px-4 lg:w-[1000px] lg:px-0 mx-auto h-full">
            <div className="flex items-center justify-between h-full px-4">
              {/* Voting buttons */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#0f375f0d] rounded-full p-1 dark:bg-dark-tertiary">
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn("rounded-full border-[hsla(0,0%,100%,0.35)] h-7 w-7", userVote === "down" && "text-blue-500")}
                    onClick={(e) => { e.stopPropagation(); handleVote("down") }}
                    disabled={isVoting}
                  >
                    <ArrowBigDown className="h-6 w-6 scale-[1.5] scale-x-[1.1] text-[#005498] dark:text-[#5aa4f1]" strokeWidth={1.5} />
                    <span className="sr-only">Downvote</span>
                  </Button>

                  <span className="text-lg font-bold text-dealhunter-red mx-2">{score}°</span>

                  <Button
                    variant="outline"
                    size="icon"
                    className={cn("rounded-full border-[hsla(0,0%,100%,0.35)] h-7 w-7", userVote === "up" && "text-dealhunter-red")}
                    onClick={(e) => { e.stopPropagation(); handleVote("up") }}
                    disabled={isVoting}
                  >
                    <ArrowBigUp className="h-6 w-6 scale-[1.5] scale-x-[1.1] text-[#ce1734] dark:text-[#f97778]" strokeWidth={1.5} />
                    <span className="sr-only">Upvote</span>
                  </Button>
                </div>
              </div>

              {/* Deal title (truncated) */}
              <div className="flex-1 mx-4">
                <h2 className="text-lg font-semibold truncate max-w-md lg:max-w-lg xl:max-w-xl">
                  {title}
                </h2>
              </div>

              {/* Deal button */}
              <Button size="sm" className="bg-[var(--background-default)] hover:bg-[var(--background-hover)] rounded-full" asChild>
                <a href={dealUrl} target="_blank" rel="noopener noreferrer">
                  To deal
                  <ExternalLink className="ml-2 h-4 w-4" strokeWidth={3} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Deal Card */}
      <Card ref={dealCardRef} className="mb-2 overflow-hidden dark:bg-dark-secondary bg-[#fff] pt-[1.5em] pl-[1.5rem] pr-[1.5rem] pb-[1.5rem]">
        {offerStatus}
        <div className="flex flex-col lg:flex-row">
          {/* Deal Image - 40% width */}
          <div className="lg:w-[45%] lg:flex-shrink-0 lg:h-[400px]">
            <div className="w-full h-full lg:pr-[0.25rem] pt-[1.5em] flex items-center justify-center">
              <Carousel images={deal.imageUrls && deal.imageUrls.length > 0 ? deal.imageUrls.map(img => typeof img === 'string' ? img : img.url) : ["/placeholder.svg?height=400&width=400"]} />
            </div>
          </div>

          {/* Deal Content - 60% width */}
          <div className="lg:w-[55%] p-6">
            {/* Header with voting and actions */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Voting buttons */}
                <div className="flex items-center bg-[#0f375f0d] rounded-full p-1 dark:bg-dark-tertiary" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn("rounded-full border-[hsla(0,0%,100%,0.35)] h-7 w-7", userVote === "down" && "text-blue-500")}
                  onClick={(e) => { e.stopPropagation(); handleVote("down") }}
                  disabled={isVoting}
                >
                  <ArrowBigDown className="h-6 w-6 scale-[1.5] scale-x-[1.1]  text-[#005498] dark:text-[#5aa4f1]" strokeWidth={1.5} />
                  <span className="sr-only">Downvote</span>
                </Button>

                <span className="text-lg font-bold text-dealhunter-red mx-2">{score}°</span>

                <Button
                  variant="outline"
                  size="icon"
                  className={cn("rounded-full border-[hsla(0,0%,100%,0.35)] h-7 w-7", userVote === "up" && "text-dealhunter-red")}
                  onClick={(e) => { e.stopPropagation(); handleVote("up") }}
                  disabled={isVoting}
                >
                  <ArrowBigUp className="h-6 w-6 scale-[1.5] scale-x-[1.1] text-[#ce1734] dark:text-[#f97778]" strokeWidth={1.5} />
                  <span className="sr-only">Upvote</span>
                </Button>
              </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1 hover:text-dealhunter-redHover">
                  <MessageCircle className="h-4 w-4" />
                  {commentCount}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1 hover:text-dealhunter-redHover">
                  <Share2 className="h-4 w-4" />
                  To share
                </Button>
                 <div className="flex items-center hover:text-dealhunter-redHover">
    <DealCardSaveButton dealId={id} />
    <span className="text-sm font-medium">Save</span>
  </div>
              </div>
            </div>

            {/* Posted time */}
            <p className="text-sm text-[var(--textTranslucentSecondary)] mb-3">
              Posted {formatDistanceToNow(postedAtDate, { addSuffix: true })}
            </p>

            {/* Deal title */}
            <h1 className="text-2xl font-bold mb-4">{title}</h1>

            {/* Price section */}
            <div className="flex items-center gap-2 mb-1 leading-none">
                  <span className="text-[2em] font-bold text-[#f7641b] dark:text-[var(--textAccentPrice)]">{formatCurrency(Number(price))}</span>
                  {originalPrice && (
                    <>
                      <span className="text-xl text-muted-foreground dark:text-[var(--textTranslucentSecondary)] line-through">
                        {formatCurrency(Number(originalPrice))}
                      </span>
                      <span className="text-[var(--textStatusPositive)] bg-[var(--bgStatusPositiveMuted)] text-[16px] font-bold px-2 py-1 rounded-md">{discount}%</span>
                    </>
                  )}
                </div>

            {/* Merchant info */}
            <p className="text-muted-foreground mb-6">
              Available at <span className="text-black dark:text-white font-medium">{merchant}</span>
            </p>

            {/* Deal button */}
            <Button size="lg" className="w-1/2 h-14 flex items-center justify-center bg-[var(--background-default)] hover:bg-[var(--background-hover)] rounded-full text-lg" asChild>
              <a href={dealUrl} target="_blank" rel="noopener noreferrer">
                
                To deal
                <ExternalLink className="mr-2 h-6 w-6" strokeWidth={3} />
              </a>
            </Button>
          </div>
        </div>
      </Card>

      {/* Voting feedback section */}
      <Card className="mb-2 py-8 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl font-semibold">Your vote helps us show you the best deals. What do you think?</span>
          </div>
          <div className="flex gap-2 mr-24">
            <div className="relative inline-block">
  {/* ❄️ Falling Snow Emoji */}
  {showSnow && (
    <span className="absolute left-1/2 top-[-10px] -translate-x-1/2 text-xl text-[#005498] animate-drop pointer-events-none select-none">
      ❄️
    </span>
  )}

  {/* Cold Button */}
  <Button
    onClick={handleColdClick}
    variant="custom"
    className={cn(
      "gap-2 rounded-full min-w-[69.125px] py-[14px] h-9 border transition-all duration-300",
      isColdPressed
        ? "bg-[#dbecfe] border-[#005498] text-[#005498]"
        : "hover:bg-[#f0f6fc] hover:border-[#e5f0fc] dark:active:bg-[#0c4b84] dark:hover:bg-[#052e53] dark:hover:border-[#023b6a]"
    )}
  >
    <ArrowBigDown
      className={cn(
        "h-6 w-6 scale-[1.5] scale-x-[1.1] transition-colors duration-300",
        isColdPressed ? "text-[#005498]" : "text-[#005498] dark:text-[#5aa4f1]"
      )}
      strokeWidth={1.5}
    />
    Cold
  </Button>
</div>


            <Button variant="custom" className="gap-2 rounded-full min-w-[69.125px] py-[14px] h-9 border active:bg-[#ffe4e2] hover:bg-[#fcf3f2] hover:border-[#fdeae9] dark:hover:border-[#690a18] dark:hover:bg-[#] ">
              <ArrowBigUp className="h-6 w-6 scale-[1.5] scale-x-[1.1] text-[#ce1734] dark:text-[#f97778]" strokeWidth={1.5} />
              Is called
            </Button>
          </div>
        </div>
      </Card>

      {/* About this offer section */}
      <Card className="">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">About this offer</h2>

          {/* Posted by info */}
          <div className="flex items-center gap-3 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarImage src={postedBy.avatar || "/placeholder.svg"} alt={postedBy.name} />
              <AvatarFallback>{postedBy.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs">Posted by <span className="text-sm font-bold"> {postedBy.name} </span></p>
              <div className="flex items-center gap-4 text-xs text-black dark:text-white cursor-pointer">
                {posterLoading ? (
                  <>
                    <span className="flex items-center gap-1">📅 Loading...</span>
                    <span className="flex items-center gap-1">🏷️ Loading...</span>
                    <span className="flex items-center gap-1">👍 Loading...</span>
                  </>
                ) : posterUser ? (
                  <>
                    <span className="flex items-center gap-1 ">
                     <CalendarDays className="h-4 w-4" /> Member since {new Date(posterUser.createdAt).getFullYear()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" /> {posterUser.dealsPosted || 0} 
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" /> {posterUser.votesGiven || 0} 
                    </span>
                  </>
                ) : (
                  <>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" /> Member since {new Date(createdAt).getFullYear()} </span>
                    <span className="flex items-center gap-1">🏷️ --</span>
                    <span className="flex items-center gap-1">👍 --</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose max-w-none dark:prose-invert mb-6">
            <div 
              className="rich-text-content"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>

          {/* Price info */}
          {/* {(price || originalPrice) && (
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
          )} */}

          {/* Additional info */}
          {/* <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Badge variant="outline">{category}</Badge>
            <Badge variant="outline">{merchant}</Badge>
            {isExpired && <Badge variant="destructive">Expired</Badge>}
          </div> */}

          {/* More details link */}
          <span className="text-sm font-bold">More details at</span>
          <Button
            variant="custom"
            className="text-sm -mx-3 dark:text-[#f97936] hover:underline text-[#eb611f]"
            asChild
          >
            <a href={`https://${merchant}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              {merchant}
              <ExternalLink className="h-4 w-4 -mx-2" strokeWidth={3} />
            </a>
          </Button>

          {/* Disclaimer */}
          <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
            <p className="mt-2">
              If you click on a link and/or order something, dealhunter may receive a payment from the seller. This has
              no influence on the decision to place an offer or not. For more information, see the FAQ and About Us
              page.
            </p>
          </div>

          {/* Action buttons - full-width, black background, flat buttons */}
{/* <div className="w-full bg-black px-4 py-3 mt-6 rounded-b-md flex items-center justify-between">
  <button className="flex items-center gap-1 text-white text-sm hover:text-gray-300 transition-colors">
    💬 New response
  </button>
  <button className="flex items-center gap-1 text-white text-sm hover:text-gray-300 transition-colors">
    📌 Save
  </button>
</div> */}
        </div>
      </Card>
      <Card className="rounded-t-none border-t-0 bg-[#f3f5f7] dark:bg-[#28292a] text-white mb-2 -mt-1">
  <div className="flex items-center px-6 py-2 w-full">
    <Button variant="ghost" size="sm" className="gap-2 text-[#6b6d70] dark:text-[#c5c7ca] hover:text-dealhunter-redHover dark:hover:text-[#f97936] text-sm font-semibold">
      <MessageSquare className="" size={20} strokeWidth={3.5}/> <span>New response</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-[#6b6d70] dark:text-[#c5c7ca] hover:text-dealhunter-redHover dark:hover:text-[#f97936] text-sm font-semibold">
      <Hourglass className="" size={20} strokeWidth={3.5}/> <span>Expired?</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-[#6b6d70] dark:text-[#c5c7ca] hover:text-dealhunter-redHover dark:hover:text-[#f97936] text-sm font-semibold">
      <Flag className="" size={20} strokeWidth={3.5}/> <span>Report</span>
    </Button>
    {/* <Button variant="ghost" size="sm" className="gap-2 text-white hover:text-dealhunter-redHover">
      📌 <span>Save</span>
    </Button> */}
          <div className="flex items-center gap-1 hover:text-dealhunter-redHover dark:text-[#c5c7ca] dark:hover:text-[#f97936] text-sm font-semibold text-[#6b6d70] cursor-pointer">
    <DealCardSaveButton dealId={id} />
    <span className="text-sm font-medium">Save</span>
  </div>
  </div>
</Card>


      {/* Related deals section */}
      {relatedDeals.length > 0 && (
        <Card className="mb-2">
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
                          src={relatedDeal.imageUrls?.[0]?.url || "/placeholder.svg?height=200&width=200"}
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
