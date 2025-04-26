import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    // Get user from session
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "You must be logged in to view saved deals" }, { status: 401 })
    }

    // Find user in our database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get saved deals
    const savedDeals = await prisma.savedDeal.findMany({
      where: { userId: user.id },
      include: {
        deal: {
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
            votes: {
              where: {
                userId: user.id,
              },
              select: {
                voteType: true,
              },
            },
          },
        },
      },
    })

    // Format the response
    const formattedDeals = savedDeals.map((saved) => {
      const deal = saved.deal
      const upVotes = deal.votes.filter((vote) => vote.voteType === "up").length
      const downVotes = deal.votes.filter((vote) => vote.voteType === "down").length
      const score = upVotes - downVotes
      const userVote = deal.votes[0]?.voteType

      return {
        id: deal.id,
        title: deal.title,
        description: deal.description,
        imageUrl: deal.imageUrl,
        price: deal.price,
        originalPrice: deal.originalPrice,
        merchant: deal.merchant,
        category: deal.category,
        dealUrl: deal.dealUrl,
        expired: deal.expired,
        expiresAt: deal.expiresAt,
        createdAt: deal.createdAt,
        score,
        commentCount: deal._count.comments,
        postedBy: {
          id: deal.user.id,
          name: deal.user.username,
          avatar: deal.user.avatarUrl,
        },
        userVote,
      }
    })

    return NextResponse.json(formattedDeals)
  } catch (error) {
    console.error("Error fetching saved deals:", error)
    return NextResponse.json({ error: "An error occurred while fetching saved deals" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { dealId } = await request.json()

    // Get user from session
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "You must be logged in to save deals" }, { status: 401 })
    }

    // Find user in our database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if deal exists
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
    })

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    // Check if already saved
    const existingSave = await prisma.savedDeal.findFirst({
      where: {
        userId: user.id,
        dealId,
      },
    })

    if (existingSave) {
      return NextResponse.json({ error: "Deal already saved" }, { status: 400 })
    }

    // Save the deal
    const savedDeal = await prisma.savedDeal.create({
      data: {
        userId: user.id,
        dealId,
      },
    })

    return NextResponse.json(savedDeal, { status: 201 })
  } catch (error) {
    console.error("Error saving deal:", error)
    return NextResponse.json({ error: "An error occurred while saving the deal" }, { status: 500 })
  }
}
