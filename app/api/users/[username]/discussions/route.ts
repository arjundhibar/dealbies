import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    console.log("Fetching discussions for username:", username);

    // First, find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });

    console.log("User found:", user);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch discussions by user ID
    const discussions = await prisma.discussion.findMany({
      where: {
        userId: user.id
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        _count: {
          select: {
            comments: true,
            votes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log("Discussions found:", discussions.length);
    console.log("Discussions data:", discussions);

    // Transform the data to match the expected format
    const formattedDiscussions = discussions.map((discussion: any) => ({
      id: discussion.id,
      title: discussion.title,
      content: discussion.description,
      createdAt: discussion.createdAt.toISOString(),
      upvotes: discussion._count.votes,
      comments: discussion._count.comments,
      category: discussion.category,
      dealCategory: discussion.dealCategory,
      postedBy: discussion.user
    }));

    return NextResponse.json(formattedDiscussions);
  } catch (error) {
    console.error("Error fetching user discussions:", error);
    return NextResponse.json(
      { error: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}
