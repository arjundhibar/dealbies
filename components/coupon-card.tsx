"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, MessageSquare, Copy, Clock } from "lucide-react"
import { formatDistanceToNow, isPast } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useData } from "@/lib/data-context"
import type { Coupon } from "@/lib/types"
import Link from "next/link"

interface CouponCardProps {
  coupon: Coupon
}

export function CouponCard({ coupon }: CouponCardProps) {
  const { id, code, title, description, merchant, logoUrl, expiresAt, terms, score, commentCount, postedBy, userVote } =
    coupon

  const { toast } = useToast()
  const { currentUser } = useData()
  const [copied, setCopied] = useState(false)

  const isExpired = isPast(new Date(expiresAt))
  const expiresIn = formatDistanceToNow(new Date(expiresAt), { addSuffix: true })

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast({
      title: "Code copied!",
      description: `${code} has been copied to your clipboard.`,
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const handleVote = (voteType: "up" | "down") => {
    if (!currentUser) {
      toast({
        title: "Login required",
        description: "You must be logged in to vote.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would call an API
    toast({
      title: "Vote recorded",
      description: `You voted ${voteType} on this coupon.`,
    })
  }

  return (
    <Card className={cn("overflow-hidden", isExpired && "opacity-70")}>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-md border">
            <img
              src={logoUrl || "/placeholder.svg?height=100&width=100"}
              alt={merchant}
              className="h-full w-full object-contain p-2"
            />
          </div>
          <div>
            <h3 className="font-bold">{merchant}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {isExpired ? <span className="text-red-500">Expired</span> : <span>Expires {expiresIn}</span>}
            </div>
          </div>
        </div>

        <h3 className="mb-2 text-lg font-bold">{title}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>

        <div className="mb-4 flex items-center gap-2">
          <div className="flex-1 rounded-md border bg-muted p-2 text-center font-mono text-lg font-bold">{code}</div>
          <Button variant={copied ? "outline" : "default"} size="icon" onClick={handleCopyCode}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {terms && (
          <div className="mb-2 text-xs text-muted-foreground">
            <strong>Terms:</strong> {terms}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-r-none px-2",
                userVote === "up" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
              )}
              onClick={() => handleVote("up")}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <span
              className={cn(
                "flex h-8 min-w-[2rem] items-center justify-center px-1 text-sm font-medium",
                score > 0 ? "text-green-600 dark:text-green-400" : score < 0 ? "text-red-600 dark:text-red-400" : "",
              )}
            >
              {score}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-l-none px-2",
                userVote === "down" && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
              )}
              onClick={() => handleVote("down")}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 px-2" asChild>
            <Link href={`/coupon/${id}#comments`}>
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{commentCount}</span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={postedBy.avatar || "/placeholder.svg"} alt={postedBy.name} />
            <AvatarFallback>{postedBy.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{postedBy.name}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
