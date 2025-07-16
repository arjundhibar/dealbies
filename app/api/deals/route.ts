import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"


// Helper function to check if Prisma is initialized
async function isPrismaInitialized() {
  try {
    await prisma.$connect()
    console.log("Prisma is connected")
    return true
  } catch (err) {
    console.error("❌ Prisma failed to connect:", err)
    return false
  }
}

function extractMerchant(url: string): string {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace(/^www\./, '')
  } catch {
    return 'unknown-merchant'
  }
}

// export async function GET(request: Request) {
//   try {
//     // Check if Prisma is initialized
//     if (!(await isPrismaInitialized())) {
//       return NextResponse.json({ error: "Database connection not available. Please try again later." }, { status: 503 })
//     }

//     const { searchParams } = new URL(request.url)
//     const category = searchParams.get("category")
//     const sort = searchParams.get("sort") || "newest"

//     let orderBy: any = { createdAt: "desc" }

//     if (sort === "hottest") {
//       // For hottest, we'll sort later after calculating scores
//       orderBy = { createdAt: "desc" }
//     } else if (sort === "comments") {
//       orderBy = [{ comments: { _count: "desc" } }, { createdAt: "desc" }]
//     }

//     const deals = await prisma.deal.findMany({
//       where: category ? { category } : undefined,
//       orderBy,
//       include: {
//         user: {
//           select: {
//             id: true,
//             username: true,
//             avatarUrl: true,
//           },
//         },
//         _count: {
//           select: {
//             comments: true,
//           },
//         },
//         votes: true,
//       },
//     })

//     // Get current user for vote status
//     const supabase = getSupabase()
//     let currentUserId: string | null = null

//     if (supabase) {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession()
//       if (session?.user) {
//         const user = await prisma.user.findUnique({
//           where: { email: session.user.email! },
//         })
//         currentUserId = user?.id || null
//       }
//     }

//     // Calculate score for each deal
//     const dealsWithScore = deals.map((deal) => {
//       const upVotes = deal.votes.filter((vote) => vote.voteType === "up").length
//       const downVotes = deal.votes.filter((vote) => vote.voteType === "down").length
//       const score = upVotes - downVotes

//       // Get user's vote if logged in
//       let userVote = undefined
//       if (currentUserId) {
//         const userVoteObj = deal.votes.find((vote) => vote.userId === currentUserId)
//         if (userVoteObj) {
//           userVote = userVoteObj.voteType
//         }
//       }

//       return {
//         id: deal.id,
//         title: deal.title,
//         description: deal.description,
//         imageUrl: deal.imageUrl,
//         price: deal.price,
//         originalPrice: deal.originalPrice,
//         merchant: deal.merchant,
//         category: deal.category,
//         dealUrl: deal.dealUrl,
//         expired: deal.expired,
//         expiresAt: deal.expiresAt,
//         createdAt: deal.createdAt,
//         score,
//         commentCount: deal._count.comments,
//         postedBy: {
//           id: deal.user.id,
//           name: deal.user.username,
//           avatar: deal.user.avatarUrl,
//         },
//         userVote,
//       }
//     })

//     // If sorting by hottest, sort by score
//     if (sort === "hottest") {
//       dealsWithScore.sort((a, b) => b.score - a.score || (b.createdAt > a.createdAt ? 1 : -1))
//     }

//     return NextResponse.json(dealsWithScore)
//   } catch (error) {
//     console.error("Error fetching deals:", error)
//     return NextResponse.json({ error: "An error occurred while fetching deals" }, { status: 500 })
//   }
// }





export async function POST(request: Request) {
  try {
    console.log("▶️ Start /api/deals handler")
    if (!(await isPrismaInitialized())) {
      return NextResponse.json({ error: 'Database connection not available.' }, { status: 503 })
    }

    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 400 })
    }

    const body = await request.json()
    const {
      title,
      description,
      price,
      originalPrice,
      category,
      dealUrl,
      expiresAt,
      startAt,
      discountCode,
      availability,
      postageCosts,
      shippingFrom,
      imageUrls,
      coverImageIndex = 0,
    } = body

    // extract merchant from dealUrl
    const merchant = extractMerchant(dealUrl)
    console.log("📦 Payload received:", body)

    if (!title || !description || !category || !dealUrl || !price || !imageUrls || imageUrls.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // const supabase = getSupabase()
    // const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    // if (!token) {
    //   return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 })
    // }

    // const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    // if (userError || !user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // let dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
    // if (!dbUser) {
    //   return NextResponse.json({ error: 'User not found in database' }, { status: 403 })
    // }

    const parsedPrice = parseFloat(price)
    const parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : null
    const parsedPostageCosts = postageCosts ? parseFloat(postageCosts) : null

    const deal = await prisma.deal.create({
      data: {
        title,
        description,
        price: parsedPrice,
        originalPrice: parsedOriginalPrice,
        merchant,
        category,
        dealUrl,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        startAt: startAt ? new Date(startAt) : null,
        discountCode: discountCode || null,
        availability: availability.toUpperCase() || null,
        postageCosts: parsedPostageCosts,
        shippingFrom: shippingFrom || null,
        userId: "dc60fdb9-df0d-40a4-ae45-d74589d00b10",
        images: {
          create: imageUrls.map((url: string, index: number) => ({
            url,
            isCover: index === coverImageIndex,
          })),
        },
      },
    })

    return NextResponse.json({ success: true, dealId: deal.id }, { status: 201 })
  } catch (err) {
    console.error("🔥 Deal POST Error:", err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}


