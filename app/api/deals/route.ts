import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"
import { Prisma } from "@prisma/client"
import { error } from "console"

// Helper function to check if Prisma is initialized
async function isPrismaInitialized() {
  try {
    // Try a simple query to check if Prisma is working
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("Prisma initialization check failed:", error)
    return false
  }
}

export async function GET(request: Request) {
  try {
    // Check if Prisma is initialized
    if (!(await isPrismaInitialized())) {
      return NextResponse.json({ error: "Database connection not available. Please try again later." }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const sort = searchParams.get("sort") || "newest"

    let orderBy: any = { createdAt: "desc" }

    if (sort === "hottest") {
      // For hottest, we'll sort later after calculating scores
      orderBy = { createdAt: "desc" }
    } else if (sort === "comments") {
      orderBy = [{ comments: { _count: "desc" } }, { createdAt: "desc" }]
    }

    const deals = await prisma.deal.findMany({
      where: category ? { category } : undefined,
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

    // Calculate score for each deal
    const dealsWithScore = deals.map((deal) => {
      const upVotes = deal.votes.filter((vote) => vote.voteType === "up").length
      const downVotes = deal.votes.filter((vote) => vote.voteType === "down").length
      const score = upVotes - downVotes

      // Get user's vote if logged in
      let userVote = undefined
      if (currentUserId) {
        const userVoteObj = deal.votes.find((vote) => vote.userId === currentUserId)
        if (userVoteObj) {
          userVote = userVoteObj.voteType
        }
      }

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

    // If sorting by hottest, sort by score
    if (sort === "hottest") {
      dealsWithScore.sort((a, b) => b.score - a.score || (b.createdAt > a.createdAt ? 1 : -1))
    }

    return NextResponse.json(dealsWithScore)
  } catch (error) {
    console.error("Error fetching deals:", error)
    return NextResponse.json({ error: "An error occurred while fetching deals" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // 1. Check Prisma connection
    if (!(await isPrismaInitialized())) {
      return NextResponse.json({ error: "Database connection not available." }, { status: 503 })
    }

    // 2. Validate Content-Type
    const contentType = request.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 })
    }

    // 3. Parse request body
    let requestBody
    try {
      requestBody = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { title, description, imageUrl, price, originalPrice, merchant, category, dealUrl, expiresAt } = requestBody

    if (!title || !description || !merchant || !category || !dealUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 4. Get Supabase user from Authorization token
    const supabase = getSupabase()
    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!supabase) {
      return NextResponse.json({error: "Internal Server Error!"})
    }

    if (!token) {
      return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 })
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    // 5. Get or create user in your database
    let dbUser = await prisma.user.findUnique({ where: { email: user.email! } })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          username: user.user_metadata?.username || user.email!.split("@")[0],
          avatarUrl: `/placeholder.svg?height=40&width=40&text=${(user.user_metadata?.username || user.email!.charAt(0)).toUpperCase()}`,
          password: "", // Supabase handles auth
        },
      })
    }

    // 6. Parse prices
    let parsedPrice = price ? parseFloat(price) : 0
    if (isNaN(parsedPrice)) return NextResponse.json({ error: "Invalid price format" }, { status: 400 })

    let parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : null
    if (originalPrice && parsedOriginalPrice !== null && isNaN(parsedOriginalPrice)) {

      return NextResponse.json({ error: "Invalid original price format" }, { status: 400 })
    }

    // 7. Create the deal
    const deal = await prisma.deal.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
        price: parsedPrice,
        originalPrice: parsedOriginalPrice,
        merchant,
        category,
        dealUrl,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        userId: dbUser.id,
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

    // 8. Return response
    return NextResponse.json(
      {
        ...deal,
        score: 0,
        commentCount: 0,
        postedBy: {
          id: deal.user.id,
          name: deal.user.username,
          avatar: deal.user.avatarUrl,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Unhandled error in POST /api/deals:", error)
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 })
  }
}
