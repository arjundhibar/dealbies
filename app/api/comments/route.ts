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

    // Get user from authorization header
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
    }

    // Get authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Invalid authorization header" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Verify the token
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    // Find user in our database
    let dbUser
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })
    } catch (error) {
      return NextResponse.json({ error: "Database error when finding user" }, { status: 500 })
    }

    if (!dbUser) {
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
    } catch (error) {
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
    return NextResponse.json({ error: "An error occurred while creating the comment" }, { status: 500 })
  }
}
