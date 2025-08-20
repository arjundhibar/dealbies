"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, notFound } from "next/navigation"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, Share2, MessageCircle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Clock, ArrowBigDown, ArrowBigUp, CalendarDays, Tag, ThumbsUp, MessageSquare, Hourglass, Flag, Copy, Check } from "lucide-react"
import { formatDistanceToNow, isPast, format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { CommentSection } from "@/components/comment-section"
import type { Coupon } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import { Carousel } from "@/components/ui/carousel"

export default function CouponPage() {
  const params = useParams()
  const id = params.id as string
  const { getCoupon, voteCoupon, updateCouponVote } = useData()
  const [coupon, setCoupon] = useState<Coupon | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [isVoting, setIsVoting] = useState(false)
  const isMobile = useIsMobile()
  const [showStickyNav, setShowStickyNav] = useState(false)
  const couponCardRef = useRef<HTMLDivElement>(null)
  const [isColdPressed, setIsColdPressed] = useState(false)
  const [isCalledPressed, setIsCalledPressed] = useState(false)
  const [showSnow, setShowSnow] = useState(false)
  const [showFire, setShowFire] = useState(false)
  const [posterUser, setPosterUser] = useState<any>(null)
  const [posterLoading, setPosterLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const commentRef = useRef<HTMLDivElement>(null)

  const scrollsToComment = () => {
    commentRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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
    const fetchCouponData = async () => {
      setLoading(true)
      try {
        const couponData = await getCoupon(id)
        console.log("this is the coupon data in useeffect", couponData)
        if (!couponData) {
          notFound()
        }
        setCoupon(couponData)

        // Fetch poster user data
        if (couponData?.postedBy?.id) {
          try {
            const userResponse = await fetch(`/api/users/${couponData.postedBy.id}`)
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
      } catch (error) {
        console.error("Error fetching coupon:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchCouponData()
  }, [id, getCoupon])

  // Sync local vote states with actual vote state
  useEffect(() => {
    if (coupon) {
      setIsColdPressed(coupon.userVote === "down")
      setIsCalledPressed(coupon.userVote === "up")
    }
  }, [coupon?.userVote])

  // Handle scroll for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      if (couponCardRef.current) {
        const rect = couponCardRef.current.getBoundingClientRect()
        // Show sticky nav when the coupon card starts going out of view
        setShowStickyNav(rect.top <= 0)
      }
    }

    // Initial check
    handleScroll()
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleColdClick = async () => {
    if (isVoting || !coupon) return

    try {
      setIsVoting(true)
      
      // Reset other states
      setIsCalledPressed(false)
      
      // Toggle cold state
      const newColdState = !isColdPressed
      setIsColdPressed(newColdState)
      setShowSnow(true)

      // Remove emoji after animation (600ms matches animation duration)
      setTimeout(() => setShowSnow(false), 600)

      // If turning cold on, vote down. If turning off, remove vote
      const voteType = newColdState ? "down" : (coupon.userVote === "down" ? "down" : "up")
      
      // Optimistically update the UI
      const currentScore = coupon.score
      const currentUserVote = coupon.userVote
      let newScore = currentScore
      let newUserVote: "up" | "down" | undefined = newColdState ? "down" : undefined

      if (currentUserVote === "down") {
        // Remove vote
        newScore = currentScore + 1
        newUserVote = undefined
      } else if (currentUserVote) {
        // Change vote
        newScore = currentScore + 2
      } else {
        // New vote
        newScore = currentScore - 1
      }

      // Update local state immediately
      setCoupon(prev => prev ? { ...prev, score: newScore, userVote: newUserVote } : prev)
      
      // Update global state
      updateCouponVote(id, newScore, newUserVote)

      // Make API call
      await voteCoupon(id, voteType)
    } catch (error: any) {
      // Revert optimistic update on error
      if (coupon) {
        setCoupon(prev => prev ? { ...prev, score: coupon.score, userVote: coupon.userVote } : prev)
        updateCouponVote(id, coupon.score, coupon.userVote)
      }
      
      // Reset local states on error
      setIsColdPressed(false)
      
      toast({
        title: "Error",
        description: error.message || "You must be logged in to vote.",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
    }
  }

  const handleCalledClick = async () => {
    if (isVoting || !coupon) return

    try {
      setIsVoting(true)
      
      // Reset other states
      setIsColdPressed(false)
      
      // Toggle called state
      const newCalledState = !isCalledPressed
      setIsCalledPressed(newCalledState)
      setShowFire(true)

      // Remove emoji after animation (600ms matches animation duration)
      setTimeout(() => setShowFire(false), 600)

      // If turning called on, vote up. If turning off, remove vote
      const voteType = newCalledState ? "up" : (coupon.userVote === "up" ? "up" : "down")
      
      // Optimistically update the UI
      const currentScore = coupon.score
      const currentUserVote = coupon.userVote
      let newScore = currentScore
      let newUserVote: "up" | "down" | undefined = newCalledState ? "up" : undefined

      if (currentUserVote === "up") {
        // Remove vote
        newScore = currentScore - 1
        newUserVote = undefined
      } else if (currentUserVote) {
        // Change vote
        newScore = currentScore - 2
      } else {
        // New vote
        newScore = currentScore + 1
      }

      // Update local state immediately
      setCoupon(prev => prev ? { ...prev, score: newScore, userVote: newUserVote } : prev)
      
      // Update global state
      updateCouponVote(id, newScore, newUserVote)

      // Make API call
      await voteCoupon(id, voteType)
    } catch (error: any) {
      // Revert optimistic update on error
      if (coupon) {
        setCoupon(prev => prev ? { ...prev, score: coupon.score, userVote: coupon.userVote } : prev)
        updateCouponVote(id, coupon.score, coupon.userVote)
      }
      
      // Reset local states on error
      setIsCalledPressed(false)
      
      toast({
        title: "Error",
        description: error.message || "You must be logged in to vote.",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
    }
  }

  const handleVote = async (voteType: "up" | "down") => {
    if (isVoting || !coupon) return

    try {
      setIsVoting(true)
      
      // Update local vote states based on vote type
      if (voteType === "down") {
        setIsColdPressed(true)
        setIsCalledPressed(false)
        setShowSnow(true)
        setTimeout(() => setShowSnow(false), 600)
      } else if (voteType === "up") {
        setIsCalledPressed(true)
        setIsColdPressed(false)
        setShowFire(true)
        setTimeout(() => setShowFire(false), 600)
      }
      
      // Optimistically update the UI
      const currentScore = coupon.score
      const currentUserVote = coupon.userVote
      let newScore = currentScore
      let newUserVote: "up" | "down" | undefined = voteType

      if (currentUserVote === voteType) {
        // Remove vote
        newScore = voteType === "up" ? currentScore - 1 : currentScore + 1
        newUserVote = undefined
        // Reset local states when removing vote
        setIsColdPressed(false)
        setIsCalledPressed(false)
      } else if (currentUserVote) {
        // Change vote
        newScore = voteType === "up" ? currentScore + 2 : currentScore - 2
      } else {
        // New vote
        newScore = voteType === "up" ? currentScore + 1 : currentScore - 1
      }

      // Update local state immediately
      setCoupon(prev => prev ? { ...prev, score: newScore, userVote: newUserVote } : prev)
      
      // Update global state
      updateCouponVote(id, newScore, newUserVote)

      // Make API call
      await voteCoupon(id, voteType)
    } catch (error: any) {
      // Revert optimistic update on error
      if (coupon) {
        setCoupon(prev => prev ? { ...prev, score: coupon.score, userVote: coupon.userVote } : prev)
        updateCouponVote(id, coupon.score, coupon.userVote)
      }
      
      // Reset local states on error
      setIsColdPressed(false)
      setIsCalledPressed(false)
      
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
          title: coupon?.title,
          text: `Check out this coupon: ${coupon?.title}`,
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error)
        })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Coupon link copied to clipboard.",
      })
    }
  }

  const handleCopyCode = async () => {
    if (!coupon) return
    
    try {
      await navigator.clipboard.writeText(coupon.discountCode)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Discount code copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy discount code.",
        variant: "destructive",
      })
    }
  }

  if (loading || !coupon) {
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
    discountCode,
    discountType,
    discountValue,
    merchant,
    category,
    score,
    commentCount,
    createdAt,
    postedBy,
    couponUrl,
    userVote,
    expired,
    expiresAt,
    startAt,
    imageUrls
  } = coupon

  const isExpired = expired || (expiresAt && isPast(new Date(expiresAt)))
  const postedAtDate = new Date(createdAt)

  const now = new Date()
  const startAtDate = startAt ? new Date(startAt) : null
  const expiresAtDate = expiresAt ? new Date(expiresAt) : null
  let offerStatus = null
  
  if (startAtDate && now < startAtDate) {
    offerStatus = (
      <div className="flex items-center gap-2 mb-4 w-full justify-center 
  text-[var(--textStatusInfo)] dark:text-blue-400 text-base font-normal text-center 
  bg-[var(--bgStatusInfoMuted)] dark:bg-[var(--bgStatusInfoMuted)] 
  rounded-md py-4 px-4 sm:p-4 mr-2">
        <Clock className="h-5 w-5" />
        <span>
          This coupon will start on {format(startAtDate, "MMMM d, yyyy 'at' HH:mm")}
        </span>
      </div>
    )
  } else if (expiresAtDate) {
    offerStatus = (
      <div className="flex items-center gap-2 mb-4 w-full justify-center 
  text-[var(--textStatusInfo)] dark:text-blue-400 text-base font-normal text-center 
  bg-[var(--bgStatusInfoMuted)] dark:bg-[var(--bgStatusInfoMuted)] 
  rounded-md py-4 px-4 sm:p-4 mr-2">
        <Clock className="h-5 w-5" />
        <span>
          This coupon expires on {format(expiresAtDate, "MMMM d, yyyy 'at' HH:mm")}
        </span>
      </div>
    )
  }

  // Mobile layout
  if (isMobile) {
    return (
      <div className={`w-full ${showStickyNav ? 'pt-16' : ''}`}>
        {/* Sticky Navigation for Mobile */}
        {showStickyNav && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1d1f20] border-b border-[#dfe1e4] dark:border-[#46484b] shadow-sm h-16">
            <div className="flex items-center justify-between h-full px-4">
              {/* Voting buttons */}
              <div className="flex items-center bg-[#0f375f0d] rounded-full p-1 dark:bg-dark-tertiary flex-shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "rounded-full border h-7 w-7",
                    (userVote === "down" || isColdPressed) ? "bg-[#005498] text-white border-[#005498]" : "border-gray-300"
                  )}
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
                  className={cn(
                    "rounded-full border h-7 w-7",
                    (userVote === "up" || isCalledPressed) ? "bg-[#ce1734] text-white border-[#ce1734]" : "border-gray-300"
                  )}
                  onClick={() => handleVote("up")}
                  disabled={isVoting}
                >
                  <ChevronUp className="h-5 w-5" />
                  <span className="sr-only">Upvote</span>
                </Button>
              </div>

              {/* Coupon title (truncated) */}
              <div className="flex-1 mx-3 min-w-0">
                <h2 className="text-sm font-semibold truncate">
                  {title}
                </h2>
              </div>

              {/* Coupon button */}
              <Button size="sm" className="h-9 bg-[var(--background-default)] hover:bg-[var(--background-hover)] rounded-full flex-shrink-0 px-3 text-xs" asChild>
                <a href={couponUrl} target="_blank" rel="noopener noreferrer">
                  Get Deal
                  <ExternalLink className="ml-1 h-3 w-3" strokeWidth={3} />
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Main Coupon Card */}
        <Card ref={couponCardRef} className="mb-2 overflow-hidden dark:bg-dark-secondary bg-[#fff] px-4 py-2">
          {offerStatus}
          <div className="flex flex-col">
            {/* Coupon Image - Full width for mobile */}
            <div className="w-full mb-4">
              <div className="w-full h-[300px]">
                <Carousel images={coupon.imageUrls && coupon.imageUrls.length > 0 ? coupon.imageUrls.map(img => typeof img === 'string' ? img : img.url) : ["/placeholder.svg?height=400&width=400"]} />
              </div>
            </div>

            {/* Coupon Content */}
            <div className="flex-1">
              {/* Header with voting and actions */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Voting buttons */}
                  <div className="flex items-center bg-[#0f375f0d] rounded-full p-1 dark:bg-dark-tertiary" onClick={(e) => e.stopPropagation()}>
                    {/* Downvote Button */}
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "rounded-full border h-7 w-7",
                        (userVote === "down" || isColdPressed) ? "bg-[#005498] text-white border-[#005498]" : "border-[hsla(0,0%,100%,0.35)]"
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVote("down")
                      }}
                      disabled={isVoting}
                    >
                      <ArrowBigDown
                        className={cn(
                          "h-6 w-6 scale-[1.5] scale-x-[1.1]",
                          (userVote === "down" || isColdPressed) ? "text-white" : "text-[#005498] dark:text-[#5aa4f1]"
                        )}
                        strokeWidth={1.5}
                      />
                      <span className="sr-only">Downvote</span>
                    </Button>

                    {/* Score */}
                    <span className="text-lg font-bold text-dealhunter-red mx-2">{score}°</span>

                    {/* Upvote Button */}
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "rounded-full border h-7 w-7",
                        (userVote === "up" || isCalledPressed) ? "bg-[#ce1734] text-white border-[#ce1734]" : "border-[hsla(0,0%,100%,0.35)]"
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVote("up")
                      }}
                      disabled={isVoting}
                    >
                      <ArrowBigUp
                        className={cn(
                          "h-6 w-6 scale-[1.5] scale-x-[1.1]",
                          (userVote === "up" || isCalledPressed) ? "text-white" : "text-[#ce1734] dark:text-[#f97778]"
                        )}
                        strokeWidth={1.5}
                      />
                      <span className="sr-only">Upvote</span>
                    </Button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={scrollsToComment} className=" hover:text-dealhunter-redHover text-[#6b6d70] dark:text-[#c5c7ca] font-medium">
                    <MessageSquare className="h-4 w-4" strokeWidth={3} />
                    {commentCount}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1 hover:text-dealhunter-redHover text-[#6b6d70] dark:text-[#c5c7ca] font-medium">
                    <Share2 className="h-4 w-4" strokeWidth={3} />
                    To share
                  </Button>
                </div>
              </div>

              {/* Posted time */}
              <p className="text-sm text-[var(--textTranslucentSecondary)] mb-3">
                Posted {formatDistanceToNow(postedAtDate, { addSuffix: true })}
              </p>

              {/* Coupon title */}
              <h1 className="text-xl font-semibold mb-4">{title}</h1>

              {/* Discount section */}
              <div className="flex items-center gap-2 mb-1 leading-none">
                <span className="text-xl font-bold text-[#f7641b] dark:text-[var(--textAccentPrice)]">
                  {discountType === 'percentage' ? `${discountValue}% OFF` : 
                   discountType === 'euro' ? `${discountValue}€ OFF` : 
                   discountType === 'freeShipping' ? 'FREE SHIPPING' : 
                   discountCode}
                </span>
              </div>

              {/* Merchant info */}
              <p className="text-muted-foreground mb-6 text-base">
                Available at <span className="text-black text-base dark:text-white font-medium">{merchant}</span>
              </p>

              {/* Buttons section - Coupon button and Get Deal button side by side */}
              <div className="flex gap-2">
                {/* Coupon button with dashed border and copy icon */}
                <Button 
                  size="lg" 
                  variant="outline"
                  className="flex-1 h-9 border-dashed border-[#f7641b] text-[#f7641b] hover:bg-[#f7641b] hover:text-white rounded-full text-base"
                  onClick={handleCopyCode}
                >
                  <span className="mr-1">{discountCode}</span>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>

                {/* Get Deal button */}
                <Button size="lg" className="flex-1 h-9 flex items-center justify-center bg-[var(--background-default)] hover:bg-[var(--background-hover)] rounded-full text-base" asChild>
                  <a href={couponUrl} target="_blank" rel="noopener noreferrer">
                    Get Deal
                    <ExternalLink className="mr-1 h-4 w-4" strokeWidth={3} />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Voting feedback section */}
        <Card className="mb-2 py-6 px-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold">Your vote helps us show you the best coupons. What do you think?</span>
            </div>
            <div className="flex gap-2">
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
                    "gap-2 rounded-full min-w-[69.125px] py-[14px] h-9 border transition-all duration-300 text-[#6b6d70]",
                    (isColdPressed || userVote === "down")
                      ? "bg-[#dbecfe] border-[#005498] text-[#005498]"
                      : "hover:bg-[#f0f6fc] hover:border-[#e5f0fc] dark:active:bg-[#0c4b84] dark:hover:bg-[#052e53] dark:hover:border-[#023b6a]"
                  )}
                >
                  <ArrowBigDown
                    className={cn(
                      "h-6 w-6 scale-[1.5] scale-x-[1.1] transition-colors duration-300",
                      (isColdPressed || userVote === "down") ? "text-[#005498]" : "text-[#005498] dark:text-[#5aa4f1]"
                    )}
                    strokeWidth={1.5}
                  />
                  Cold
                </Button>
              </div>

              <div className="relative inline-block">
                {/* 🔥 Falling Fire Emoji */}
                {showFire && (
                  <span className="absolute left-1/2 top-[-10px] -translate-x-1/2 text-xl text-[#ce1734] animate-drop pointer-events-none select-none">
                    🔥
                  </span>
                )}

                <Button 
                  onClick={handleCalledClick}
                  variant="custom" 
                  className={cn(
                    "gap-2 rounded-full min-w-[69.125px] py-[14px] h-9 border transition-all duration-300 text-[#6b6d70]",
                    (isCalledPressed || userVote === "up")
                      ? "bg-[#ffe4e2] border-[#ce1734] text-[#ce1734]"
                      : "hover:bg-[#fcf3f2] hover:border-[#fdeae9] dark:hover:border-[#690a18] dark:hover:bg-[#]"
                  )}
                >
                  <ArrowBigUp 
                    className={cn(
                      "h-6 w-6 scale-[1.5] scale-x-[1.1] transition-colors duration-300",
                      (isCalledPressed || userVote === "up") ? "text-[#ce1734]" : "text-[#ce1734] dark:text-[#f97778]"
                    )} 
                    strokeWidth={1.5} 
                  />
                  Is called
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* About this offer section */}
        <Card className="">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-6">About this coupon</h2>

            {/* Posted by info */}
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={postedBy.avatar || "/kishan.jpeg"} alt={postedBy.name} />
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
          </div>
        </Card>

        <Card className="rounded-t-none border-t-0 bg-[#f3f5f7] dark:bg-[#28292a] text-white mb-2 -mt-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 px-4 py-2 w-full">
            <Button variant="ghost" size="sm" className="gap-2 text-[#6b6d70] dark:text-[#c5c7ca] hover:text-dealhunter-redHover dark:hover:text-[#f97936] text-sm font-medium">
              <MessageSquare className="" size={20} strokeWidth={2.5}/> <span>New response</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-[#6b6d70] dark:text-[#c5c7ca] hover:text-dealhunter-redHover dark:hover:text-[#f97936] text-sm font-medium">
              <Hourglass className="" size={20} strokeWidth={2.5}/> <span>Expired?</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-[#6b6d70] dark:text-[#c5c7ca] hover:text-dealhunter-redHover dark:hover:text-[#f97936] text-sm font-medium">
              <Flag className="" size={20} strokeWidth={2.5}/> <span>Report</span>
            </Button>
          </div>
        </Card>

        {/* Comments section */}
        <div ref={commentRef}>
          <CommentSection couponId={id} />
        </div>
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
                    className={cn(
                      "rounded-full border h-7 w-7",
                      (userVote === "down" || isColdPressed) ? "bg-[#005498] text-white border-[#005498]" : "border-[hsla(0,0%,100%,0.35)]"
                    )}
                    onClick={(e) => { e.stopPropagation(); handleVote("down") }}
                    disabled={isVoting}
                  >
                    <ArrowBigDown 
                      className={cn(
                        "h-6 w-6 scale-[1.5] scale-x-[1.1]",
                        (userVote === "down" || isColdPressed) ? "text-white" : "text-[#005498] dark:text-[#5aa4f1]"
                      )} 
                      strokeWidth={1.5} 
                    />
                    <span className="sr-only">Downvote</span>
                  </Button>

                  <span className="text-lg font-bold text-dealhunter-red mx-2">{score}°</span>

                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "rounded-full border h-7 w-7",
                      (userVote === "up" || isCalledPressed) ? "bg-[#ce1734] text-white border-[#ce1734]" : "border-[hsla(0,0%,100%,0.35)]"
                    )}
                    onClick={(e) => { e.stopPropagation(); handleVote("up") }}
                    disabled={isVoting}
                  >
                    <ArrowBigUp 
                      className={cn(
                        "h-6 w-6 scale-[1.5] scale-x-[1.1]",
                        (userVote === "up" || isCalledPressed) ? "text-white" : "text-[#ce1734] dark:text-[#f97778]"
                      )} 
                      strokeWidth={1.5} 
                    />
                    <span className="sr-only">Upvote</span>
                  </Button>
                </div>
              </div>

              {/* Coupon title (truncated) */}
              <div className="flex-1 mx-4">
                <h2 className="text-lg font-semibold truncate max-w-md lg:max-w-lg xl:max-w-xl">
                  {title}
                </h2>
              </div>

              {/* Coupon button */}
              <Button size="sm" className="bg-[var(--background-default)] hover:bg-[var(--background-hover)] rounded-full" asChild>
                <a href={couponUrl} target="_blank" rel="noopener noreferrer">
                  Get Deal
                  <ExternalLink className="ml-2 h-4 w-4" strokeWidth={3} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Coupon Card */}
      <Card ref={couponCardRef} className="mb-2 overflow-hidden dark:bg-dark-secondary bg-[#fff] pt-[1.5em] pl-[1.5rem] pr-[1.5rem] pb-[1.5rem]">
        {offerStatus}
        <div className="flex flex-col lg:flex-row">
          {/* Coupon Image - 40% width */}
          <div className="lg:w-[45%] lg:flex-shrink-0 lg:h-[400px]">
            <div className="w-full h-full lg:pr-[0.25rem] pt-[1.5em] flex items-center justify-center">
              <Carousel images={coupon.imageUrls && coupon.imageUrls.length > 0 ? coupon.imageUrls.map(img => typeof img === 'string' ? img : img.url) : ["/placeholder.svg?height=400&width=400"]} />
            </div>
          </div>

          {/* Coupon Content - 60% width */}
          <div className="lg:w-[55%] p-6">
            {/* Header with voting and actions */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Voting buttons */}
                <div className="flex items-center bg-[#0f375f0d] rounded-full p-1 dark:bg-dark-tertiary" onClick={(e) => e.stopPropagation()}>
                  {/* Downvote Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "rounded-full border h-7 w-7",
                      (userVote === "down" || isColdPressed) ? "bg-[#005498] text-white border-[#005498]" : "border-[hsla(0,0%,100%,0.35)]"
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVote("down")
                    }}
                    disabled={isVoting}
                  >
                    <ArrowBigDown
                      className={cn(
                        "h-6 w-6 scale-[1.5] scale-x-[1.1]",
                        (userVote === "down" || isColdPressed) ? "text-white" : "text-[#005498] dark:text-[#5aa4f1]"
                      )}
                      strokeWidth={1.5}
                    />
                    <span className="sr-only">Downvote</span>
                  </Button>

                  {/* Score */}
                  <span className="text-lg font-bold text-dealhunter-red mx-2">{score}°</span>

                  {/* Upvote Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "rounded-full border h-7 w-7",
                      (userVote === "up" || isCalledPressed) ? "bg-[#ce1734] text-white border-[#ce1734]" : "border-[hsla(0,0%,100%,0.35)]"
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVote("up")
                    }}
                    disabled={isVoting}
                  >
                    <ArrowBigUp
                      className={cn(
                        "h-6 w-6 scale-[1.5] scale-x-[1.1]",
                        (userVote === "up" || isCalledPressed) ? "text-white" : "text-[#ce1734] dark:text-[#f97778]"
                      )}
                      strokeWidth={1.5}
                    />
                    <span className="sr-only">Upvote</span>
                  </Button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={scrollsToComment} className=" hover:text-dealhunter-redHover text-[#6b6d70] dark:text-[#c5c7ca] font-medium">
                  <MessageSquare className="h-4 w-4" strokeWidth={3} />
                  {commentCount}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1 hover:text-dealhunter-redHover text-[#6b6d70] dark:text-[#c5c7ca] font-medium">
                  <Share2 className="h-4 w-4" strokeWidth={3} />
                  To share
                </Button>
              </div>
            </div>

            {/* Posted time */}
            <p className="text-sm text-[var(--textTranslucentSecondary)] mb-3">
              Posted {formatDistanceToNow(postedAtDate, { addSuffix: true })}
            </p>

            {/* Coupon title */}
            <h1 className="text-2xl font-bold mb-4">{title}</h1>

            {/* Discount section */}
            <div className="flex items-center gap-2 mb-1 leading-none">
              <span className="text-[2em] font-bold text-[#f7641b] dark:text-[var(--textAccentPrice)]">
                {discountType === 'percentage' ? `${discountValue}% OFF` : 
                 discountType === 'euro' ? `${discountValue}€ OFF` : 
                 discountType === 'freeShipping' ? 'FREE SHIPPING' : 
                 discountCode}
              </span>
            </div>

            {/* Merchant info */}
            <p className="text-muted-foreground mb-6">
              Available at <span className="text-black dark:text-white font-medium">{merchant}</span>
            </p>

            {/* Buttons section - Coupon button and Get Deal button side by side */}
            <div className="flex gap-4">
              {/* Coupon button with dashed border and copy icon */}
              <Button 
                size="lg" 
                variant="outline"
                className="flex-1 h-14 border-dashed border-[#f7641b] text-[#f7641b] hover:bg-[#f7641b] hover:text-white rounded-full text-lg"
                onClick={handleCopyCode}
              >
                <span className="mr-2">{discountCode}</span>
                {copied ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>

              {/* Get Deal button */}
              <Button size="lg" className="flex-1 h-14 flex items-center justify-center bg-[var(--background-default)] hover:bg-[var(--background-hover)] rounded-full text-lg" asChild>
                <a href={couponUrl} target="_blank" rel="noopener noreferrer">
                  Get Deal
                  <ExternalLink className="mr-2 h-6 w-6" strokeWidth={3} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Voting feedback section */}
      <Card className="mb-2 py-8 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl font-semibold">Your vote helps us show you the best coupons. What do you think?</span>
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
                  (isColdPressed || userVote === "down")
                    ? "bg-[#dbecfe] border-[#005498] text-[#005498]"
                    : "hover:bg-[#f0f6fc] hover:border-[#e5f0fc] dark:active:bg-[#0c4b84] dark:hover:bg-[#052e53] dark:hover:border-[#023b6a]"
                )}
              >
                <ArrowBigDown
                  className={cn(
                    "h-6 w-6 scale-[1.5] scale-x-[1.1] transition-colors duration-300",
                    (isColdPressed || userVote === "down") ? "text-[#005498]" : "text-[#005498] dark:text-[#5aa4f1]"
                  )}
                  strokeWidth={1.5}
                />
                Cold
              </Button>
            </div>

            <div className="relative inline-block">
              {/* 🔥 Falling Fire Emoji */}
              {showFire && (
                <span className="absolute left-1/2 top-[-10px] -translate-x-1/2 text-xl text-[#ce1734] animate-drop pointer-events-none select-none">
                  🔥
                </span>
              )}

              <Button 
                onClick={handleCalledClick}
                variant="custom" 
                className={cn(
                  "gap-2 rounded-full min-w-[69.125px] py-[14px] h-9 border transition-all duration-300",
                  (isCalledPressed || userVote === "up")
                    ? "bg-[#ffe4e2] border-[#ce1734] text-[#ce1734]"
                    : "hover:bg-[#fcf3f2] hover:border-[#fdeae9] dark:hover:border-[#690a18] dark:hover:bg-[#]"
                )}
              >
                <ArrowBigUp 
                  className={cn(
                    "h-6 w-6 scale-[1.5] scale-x-[1.1] transition-colors duration-300",
                    (isCalledPressed || userVote === "up") ? "text-[#ce1734]" : "text-[#ce1734] dark:text-[#f97778]"
                  )} 
                  strokeWidth={1.5} 
                />
                Is called
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* About this offer section */}
      <Card className="">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">About this coupon</h2>

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
        </div>
      </Card>

              {/* Comments section */}
        <div ref={commentRef}>
          <CommentSection couponId={id} />
        </div>
    </div>
  )
}
