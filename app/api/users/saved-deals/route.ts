import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    console.log("GET /api/users/saved-deals called")
    // Get user from session
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log("GET - Session user:", session?.user?.email)
    console.log("GET - Session exists:", !!session)

    if (!session?.user) {
      console.log("GET - No session found, returning 401")
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
        imageUrl: (deal as any).imageUrl, 
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
    console.log("POST /api/users/saved-deals called")
    const { dealId } = await request.json()
    console.log("Request body dealId:", dealId)

    // Get user from session
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log("Session user:", session?.user?.email)
    console.log("Session exists:", !!session)

    if (!session?.user) {
      console.log("No session found, returning 401")
      return NextResponse.json({ error: "You must be logged in to save deals" }, { status: 401 })
    }

    // Find user in our database
    console.log("Looking for user with email:", session.user.email)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    console.log("Found user:", user?.id)

    if (!user) {
      console.log("User not found in database")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if deal exists
    console.log("Looking for deal with id:", dealId)
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
    })

    console.log("Found deal:", deal?.id)

    if (!deal) {
      console.log("Deal not found")
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    // Check if already saved
    console.log("Checking if deal is already saved")
    const existingSave = await prisma.savedDeal.findFirst({
      where: {
        userId: user.id,
        dealId,
      },
    })

    console.log("Existing save found:", !!existingSave)

    if (existingSave) {
      console.log("Deal already saved, returning 400")
      return NextResponse.json({ error: "Deal already saved" }, { status: 400 })
    }

    // Save the deal
    console.log("Creating saved deal record")
    const savedDeal = await prisma.savedDeal.create({
      data: {
        userId: user.id,
        dealId,
      },
    })

    console.log("Saved deal created:", savedDeal.id)
    return NextResponse.json(savedDeal, { status: 201 })
  } catch (error) {
    console.error("Error saving deal:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json({ error: "An error occurred while saving the deal" }, { status: 500 })
  }
}
