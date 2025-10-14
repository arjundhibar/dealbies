import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    console.log("GET /api/users/saved-coupons called")
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
      return NextResponse.json({ error: "You must be logged in to view saved coupons" }, { status: 401 })
    }

    // Find user in our database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get saved coupons
    const savedCoupons = await (prisma as any).savedCoupon.findMany({
      where: { userId: user.id },
      include: {
        coupon: {
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
    const formattedCoupons = savedCoupons.map((saved: any) => {
      const coupon = saved.coupon
      const upVotes = coupon.votes.filter((vote: any) => vote.voteType === "up").length
      const downVotes = coupon.votes.filter((vote: any) => vote.voteType === "down").length
      const score = upVotes - downVotes
      const userVote = coupon.votes[0]?.voteType

      return {
        id: coupon.id,
        slug: coupon.slug,
        title: coupon.title,
        description: coupon.description,
        imageUrl: (coupon as any).imageUrl, 
        discountCode: coupon.discountCode,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        availability: coupon.availability,
        merchant: coupon.merchant,
        couponUrl: coupon.couponUrl,
        expired: coupon.expired,
        expiresAt: coupon.expiresAt,
        category: coupon.category,
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

    return NextResponse.json(formattedCoupons)
  } catch (error) {
    console.error("Error fetching saved coupons:", error)
    return NextResponse.json({ error: "An error occurred while fetching saved coupons" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log("POST /api/users/saved-coupons called")
    const { couponId } = await request.json()
    console.log("Request body couponId:", couponId)

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
      return NextResponse.json({ error: "You must be logged in to save coupons" }, { status: 401 })
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

    // Check if coupon exists
    console.log("Looking for coupon with id:", couponId)
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
    })

    console.log("Found coupon:", coupon?.id)

    if (!coupon) {
      console.log("Coupon not found")
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 })
    }

    // Check if already saved
    console.log("Checking if coupon is already saved")
    const existingSave = await (prisma as any).savedCoupon.findFirst({
      where: {
        userId: user.id,
        couponId,
      },
    })

    console.log("Existing save found:", !!existingSave)

    if (existingSave) {
      console.log("Coupon already saved, returning 400")
      return NextResponse.json({ error: "Coupon already saved" }, { status: 400 })
    }

    // Save the coupon
    console.log("Creating saved coupon record")
    const savedCoupon = await (prisma as any).savedCoupon.create({
      data: {
        userId: user.id,
        couponId,
      },
    })

    console.log("Saved coupon created:", savedCoupon.id)
    return NextResponse.json(savedCoupon, { status: 201 })
  } catch (error) {
    console.error("Error saving coupon:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json({ error: "An error occurred while saving the coupon" }, { status: 500 })
  }
}
