import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get the username from query params
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Looking for user with username:", username);

    // First get the user ID from username using Prisma
    const userProfile = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });

    console.log("👤 User profile found:", userProfile);

    if (!userProfile) {
      console.log("❌ User not found");
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Count comments posted by this user
    const commentsCount = await prisma.comment.count({
      where: { userId: userProfile.id }
    });

    console.log("💬 Comments count:", commentsCount);

    return NextResponse.json({ count: commentsCount });
  } catch (error) {
    console.error("❌ Error fetching comments count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
