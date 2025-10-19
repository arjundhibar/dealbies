import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const merchant = searchParams.get("merchant");
    const type = searchParams.get("type"); // "deal" or "coupon"
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    let whereClause: any = {};

    if (merchant) {
      whereClause.merchant = {
        equals: merchant,
        mode: "insensitive",
      };
    }

    if (type) {
      whereClause.type = type;
    }

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt.lte = new Date(endDate);
      }
    }

    // Get click tracking data
    const [clicks, totalCount] = await Promise.all([
      prisma.clickTracking.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.clickTracking.count({
        where: whereClause,
      }),
    ]);

    // Get aggregated statistics
    const stats = await prisma.clickTracking.groupBy({
      by: ["merchant", "type"],
      where: whereClause,
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    // Get daily click counts for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as clicks,
        COUNT(DISTINCT merchant) as merchants
      FROM click_tracking 
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    return NextResponse.json({
      clicks,
      totalCount,
      stats,
      dailyStats,
      pagination: {
        limit,
        offset,
        total: totalCount,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint to manually track clicks (if needed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, type, originalUrl, finalUrl, merchant, userAgent, ipAddress, referer } = body;

    const click = await prisma.clickTracking.create({
      data: {
        slug,
        type,
        originalUrl,
        finalUrl,
        merchant,
        userAgent,
        ipAddress,
        referer,
      },
    });

    return NextResponse.json(click);
  } catch (error) {
    console.error("Error creating click tracking:", error);
    return NextResponse.json(
      { error: "Failed to track click" },
      { status: 500 }
    );
  }
}
