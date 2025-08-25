import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get all top-level comments for the deal
    const comments = await prisma.comment.findMany({
      where: {
        dealId: params.id,
        parentId: null, // Only top-level comments
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        votes: true,
        // Include replies (nested comments)
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
            votes: true,
          },
        },
      },
    })

    // Get current user for vote status
    const supabase = getSupabase()
    let currentUserId: string | null = null

    if (supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email! },
        })
        currentUserId = user?.id || null
      }
    }

    // Format comments with score and user vote
    const formatComment = (comment: any) => {
      const upVotes = comment.votes.filter((vote: any) => vote.voteType === "up").length
      const downVotes = comment.votes.filter((vote: any) => vote.voteType === "down").length
      const score = upVotes - downVotes

      // Get user's vote if logged in
      let userVote = null
      if (currentUserId) {
        const userVoteObj = comment.votes.find((vote: any) => vote.userId === currentUserId)
        if (userVoteObj) {
          userVote = userVoteObj.voteType
        }
      }

      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        postedBy: {
          id: comment.user.id,
          name: comment.user.username,
          avatar: comment.user.avatarUrl,
        },
        score,
        userVote,
        replies: comment.replies ? comment.replies.map(formatComment) : [],
      }
    }

    const formattedComments = comments.map(formatComment)

    return NextResponse.json(formattedComments)
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while fetching comments" }, { status: 500 })
  }
}
