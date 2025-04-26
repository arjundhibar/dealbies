"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, Reply, AlertCircle } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { Comment } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CommentSectionProps {
  dealId: string
}

export function CommentSection({ dealId }: CommentSectionProps) {
  const { currentUser, addComment, voteComment } = useData()
  const [dealComments, setDealComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/deals/${dealId}/comments`)
        if (response.ok) {
          const data = await response.json()
          setDealComments(data)
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to load comments")
        }
      } catch (error: any) {
        console.error("Error fetching comments:", error)
        setError(error.message || "Failed to load comments. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [dealId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await addComment(dealId, newComment)
      setNewComment("")

      // Refetch comments to get the updated list
      const response = await fetch(`/api/deals/${dealId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setDealComments(data)
      }

      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post comment.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    try {
      await addComment(dealId, replyContent, parentId)

      // Refresh comments to get the updated structure with replies
      const response = await fetch(`/api/deals/${dealId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setDealComments(data)
      }

      setReplyContent("")
      setReplyingTo(null)
      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post reply.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVote = async (commentId: string, voteType: "up" | "down") => {
    try {
      await voteComment(dealId, commentId, voteType)

      // Refresh comments to get updated votes
      const response = await fetch(`/api/deals/${dealId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setDealComments(data)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "You must be logged in to vote.",
        variant: "destructive",
      })
    }
  }

  const renderComment = (comment: Comment) => {
    const { id, content, createdAt, postedBy, score, userVote, replies } = comment
    const isReplying = replyingTo === id

    return (
      <div key={id} className="border-b py-4 last:border-0">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={postedBy.avatar || "/placeholder.svg?height=40&width=40&text=U"} alt={postedBy.name} />
            <AvatarFallback>{postedBy.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{postedBy.name}</span>
              <span className="text-xs text-muted-foreground">{formatRelativeTime(new Date(createdAt))}</span>
            </div>
            <p className="mt-1">{content}</p>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-6 w-6 p-0", userVote === "up" && "text-green-600 dark:text-green-400")}
                  onClick={() => handleVote(id, "up")}
                  disabled={!currentUser}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span className="sr-only">Upvote</span>
                </Button>
                <span
                  className={cn(
                    "text-sm",
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
                  className={cn("h-6 w-6 p-0", userVote === "down" && "text-red-600 dark:text-red-400")}
                  onClick={() => handleVote(id, "down")}
                  disabled={!currentUser}
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span className="sr-only">Downvote</span>
                </Button>
              </div>
              {currentUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setReplyingTo(isReplying ? null : id)}
                >
                  <Reply className="mr-1 h-3 w-3" />
                  Reply
                </Button>
              )}
            </div>

            {isReplying && (
              <div className="mt-3">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="mb-2"
                  disabled={isSubmitting}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyContent("")
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(id)}
                    disabled={isSubmitting || !replyContent.trim()}
                  >
                    {isSubmitting ? "Posting..." : "Reply"}
                  </Button>
                </div>
              </div>
            )}

            {replies && replies.length > 0 && <div className="mt-4 border-l-2 pl-4">{replies.map(renderComment)}</div>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border" id="comments">
      <div className="border-b p-4">
        <h2 className="text-xl font-bold">Comments ({dealComments.length})</h2>
      </div>

      <div className="p-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmitComment} className="mb-6">
          <Textarea
            placeholder={currentUser ? "Write a comment..." : "Log in to comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!currentUser || isSubmitting}
            className="mb-2"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !newComment.trim() || !currentUser}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 border-b py-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : dealComments.length > 0 ? (
          <div className="space-y-1">{dealComments.map(renderComment)}</div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  )
}
