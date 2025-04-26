import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"

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
    // Check if Prisma is initialized
    if (!(await isPrismaInitialized())) {
      return NextResponse.json({ error: "Database connection not available. Please try again later." }, { status: 503 })
    }

    // Ensure the request has the correct content type
    const contentType = request.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 })
    }

    // Parse the request body
    let requestBody
    try {
      requestBody = await request.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { title, description, imageUrl, price, originalPrice, merchant, category, dealUrl, expiresAt } = requestBody

    // Validate required fields
    if (!title || !description || !merchant || !category || !dealUrl) {
      return NextResponse.json(
        { error: "Missing required fields. Please fill in all required information." },
        { status: 400 },
      )
    }

    // Get user from session
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError)
      return NextResponse.json({ error: "Authentication error: " + sessionError.message }, { status: 401 })
    }

    if (!session?.user) {
      return NextResponse.json({ error: "You must be logged in to post a deal" }, { status: 401 })
    }

    // Find user in our database
    let user
    try {
      user = await prisma.user.findUnique({
        where: { email: session.user.email! },
      })

      if (!user) {
        // If user doesn't exist in our database yet, create them
        user = await prisma.user.create({
          data: {
            id: session.user.id,
            email: session.user.email!,
            username: session.user.user_metadata?.username || session.user.email!.split("@")[0],
            password: "", // We don't need to store the password as Supabase handles authentication
            avatarUrl: `/placeholder.svg?height=40&width=40&text=${(session.user.user_metadata?.username || session.user.email!.charAt(0)).toUpperCase()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
      }
    } catch (error) {
      console.error("Error finding/creating user:", error)
      return NextResponse.json(
        {
          error: "Your account is not properly registered. Please try logging out and back in.",
        },
        { status: 403 },
      )
    }

    // Validate price format
    let parsedPrice
    try {
      parsedPrice = price ? Number.parseFloat(price.toString()) : 0
      if (isNaN(parsedPrice)) {
        return NextResponse.json({ error: "Invalid price format" }, { status: 400 })
      }
    } catch (error) {
      console.error("Price parsing error:", error)
      return NextResponse.json({ error: "Invalid price format" }, { status: 400 })
    }

    // Validate original price format
    let parsedOriginalPrice = null
    if (originalPrice) {
      try {
        parsedOriginalPrice = Number.parseFloat(originalPrice.toString())
        if (isNaN(parsedOriginalPrice)) {
          return NextResponse.json({ error: "Invalid original price format" }, { status: 400 })
        }
      } catch (error) {
        console.error("Original price parsing error:", error)
        return NextResponse.json({ error: "Invalid original price format" }, { status: 400 })
      }
    }

    // Create the deal
    try {
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
      console.error("Error creating deal in database:", error)
      return NextResponse.json({ error: "An error occurred while creating the deal in the database." }, { status: 500 })
    }
  } catch (error) {
    console.error("Unhandled error in POST /api/deals:", error)
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 })
  }
}
