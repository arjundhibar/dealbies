import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const merchant = searchParams.get("merchant")
    const sort = searchParams.get("sort") || "newest"

    let orderBy: any = { createdAt: "desc" }

    if (sort === "hottest") {
      // For hottest, we'll sort later after calculating scores
      orderBy = { createdAt: "desc" }
    } else if (sort === "expiring") {
      orderBy = { expiresAt: "asc" }
    }

    const coupons = await prisma.coupon.findMany({
      where: merchant ? { merchant } : undefined,
      orderBy,
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
          },
        },
        votes: true,
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

    // Calculate score for each coupon
    const couponsWithScore = coupons.map((coupon) => {
      const upVotes = coupon.votes.filter((vote) => vote.voteType === "up").length
      const downVotes = coupon.votes.filter((vote) => vote.voteType === "down").length
      const score = upVotes - downVotes

      // Get user's vote if logged in
      let userVote = undefined
      if (currentUserId) {
        const userVoteObj = coupon.votes.find((vote) => vote.userId === currentUserId)
        if (userVoteObj) {
          userVote = userVoteObj.voteType
        }
      }

      return {
        id: coupon.id,
        code: coupon.code,
        title: coupon.title,
        description: coupon.description,
        merchant: coupon.merchant,
        logoUrl: coupon.logoUrl,
        expiresAt: coupon.expiresAt,
        terms: coupon.terms,
        createdAt: coupon.createdAt,
        score,
        commentCount: coupon._count.comments,
        postedBy: {
          id: coupon.user.id,
          name: coupon.user.username,
          avatar: coupon.user.avatarUrl,
        },
        userVote,
      }
    })

    // If sorting by hottest, sort by score
    if (sort === "hottest") {
      couponsWithScore.sort((a, b) => b.score - a.score || (b.createdAt > a.createdAt ? 1 : -1))
    }

    return NextResponse.json(couponsWithScore)
  } catch (error) {
    console.error("Error fetching coupons:", error)
    return NextResponse.json({ error: "An error occurred while fetching coupons" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { code, title, description, merchant, logoUrl, expiresAt, terms } = await request.json()

    // Get user from session
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "You must be logged in to post a coupon" }, { status: 401 })
    }

    // Find user in our database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        title,
        description,
        merchant,
        logoUrl,
        expiresAt: new Date(expiresAt),
        terms,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        ...coupon,
        score: 0,
        commentCount: 0,
        postedBy: {
          id: coupon.user.id,
          name: coupon.user.username,
          avatar: coupon.user.avatarUrl,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating coupon:", error)
    return NextResponse.json({ error: "An error occurred while creating the coupon" }, { status: 500 })
  }
}
