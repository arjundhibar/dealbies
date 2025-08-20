import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if Prisma client is available
    if (!prisma) {
      return NextResponse.json({ error: "Database client not available" }, { status: 500 })
    }

    // Fetch comments for the coupon
    const comments = await prisma.comment.findMany({
      where: {
        couponId: id,
        parentId: null, // Only top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform the data to match the expected format
    const transformedComments = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      postedBy: {
        id: comment.user.id,
        name: comment.user.username,
        avatar: comment.user.avatarUrl,
      },
      score: 0, // Default score for now
      userVote: undefined, // Default user vote for now
      replies: comment.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt.toISOString(),
        postedBy: {
          id: reply.user.id,
          name: reply.user.username,
          avatar: reply.user.avatarUrl,
        },
        score: 0, // Default score for now
        userVote: undefined, // Default user vote for now
        replies: [], // No nested replies for now
      })),
    }))

    return NextResponse.json(transformedComments)
  } catch (error) {
    console.error("Error fetching coupon comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
} 