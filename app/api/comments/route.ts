import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    // Check if Prisma client is available
    if (!prisma) {
      return NextResponse.json({ error: "Database client not available" }, { status: 500 })
    }

    const { content, dealId, couponId, parentId } = await request.json()

    // Get user from session
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "You must be logged in to post a comment" }, { status: 401 })
    }

    // Find user in our database
    let user
    try {
      user = await prisma.user.findUnique({
        where: { email: session.user.email! },
      })
    } catch (error) {
      console.error("Error finding user:", error)
      return NextResponse.json({ error: "Database error when finding user" }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create comment
    let comment
    try {
      comment = await prisma.comment.create({
        data: {
          content,
          dealId,
          couponId,
          parentId,
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
    } catch (error) {
      console.error("Error creating comment:", error)
      return NextResponse.json({ error: "Database error when creating comment" }, { status: 500 })
    }

    return NextResponse.json(
      {
        ...comment,
        score: 0,
        postedBy: {
          id: comment.user.id,
          name: comment.user.username,
          avatar: comment.user.avatarUrl,
        },
        user: undefined,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "An error occurred while creating the comment" }, { status: 500 })
  }
}
