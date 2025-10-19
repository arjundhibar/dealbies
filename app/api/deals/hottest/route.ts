import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch deals with their vote counts and calculate scores
    const deals = await prisma.deal.findMany({
      where: {
        expired: false, // Only show non-expired deals
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        images: {
          select: {
            slug: true,
            cloudflareUrl: true,
            url: true,
            isCover: true,
          },
        },
        votes: {
          select: {
            voteType: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Start with newest first
      },
      take: 50, // Get more deals to calculate scores properly
    });

    // Calculate scores and format deals
    const dealsWithScores = deals.map((deal) => {
      const upVotes = deal.votes.filter((vote) => vote.voteType === "up").length;
      const downVotes = deal.votes.filter((vote) => vote.voteType === "down").length;
      const score = upVotes - downVotes;

      // Get cover image or first image
      const coverImage = deal.images.find((img) => img.isCover) || deal.images[0];
      const imageUrl = coverImage?.cloudflareUrl || 
                     (coverImage?.slug ? `/api/images/${coverImage.slug}` : 
                     "/placeholder.svg?height=64&width=64&query=product");

      return {
        id: deal.id,
        slug: deal.slug,
        title: deal.title,
        score: score,
        price: deal.price.toString(),
        imageUrl: imageUrl,
        dealUrl: deal.dealUrl,
        merchant: deal.merchant,
        category: deal.category,
        createdAt: deal.createdAt,
        commentCount: deal._count.comments,
        postedBy: {
          id: deal.user.id,
          username: deal.user.username,
          avatarUrl: deal.user.avatarUrl,
        },
      };
    });

    // Sort by score (highest first) and take top 3
    const hottestDeals = dealsWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return NextResponse.json(hottestDeals);
  } catch (error) {
    console.error("Error fetching hottest deals:", error);
    return NextResponse.json(
      { error: "Failed to fetch hottest deals" },
      { status: 500 }
    );
  }
}
