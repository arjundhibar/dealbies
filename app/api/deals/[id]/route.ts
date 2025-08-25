import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
        votes: true,
      },
    })

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    // Calculate score
    const upVotes = deal.votes.filter((vote) => vote.voteType === "up").length
    const downVotes = deal.votes.filter((vote) => vote.voteType === "down").length
    const score = upVotes - downVotes

    // Get user's vote if logged in
    const supabase = getSupabase()
    let userVote = null

    if (supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email! },
        })

        if (user) {
          const vote = await prisma.vote.findFirst({
            where: {
              userId: user.id,
              dealId: deal.id,
            },
          })

          if (vote) {
            userVote = vote.voteType
          }
        }
      }
    }

    return NextResponse.json({
      ...deal,
      score,
      commentCount: deal._count.comments,
      postedBy: {
        id: deal.user.id,
        name: deal.user.username,
        avatar: deal.user.avatarUrl,
      },
      userVote,
      // Remove unnecessary fields
      votes: undefined,
      _count: undefined,
      user: undefined,
    })
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while fetching the deal" }, { status: 500 })
  }
}
