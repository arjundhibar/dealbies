import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "3", 10)

    // First get the deal to find its category
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      select: { category: true, merchant: true },
    })

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    // Find related deals in the same category or from the same merchant
    const relatedDeals = await prisma.deal.findMany({
      where: {
        id: { not: params.id }, // Exclude the current deal
        OR: [{ category: deal.category }, { merchant: deal.merchant }],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        // include slug for client-side linking
        
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
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })

    const formattedDeals = relatedDeals.map((relatedDeal) => ({
      id: relatedDeal.id,
      slug: (relatedDeal as any).slug,
      title: relatedDeal.title,
      description: relatedDeal.description,
      imageUrls: relatedDeal.images.map(img => img.cloudflareUrl || `/api/images/${img.slug}`),
      price: relatedDeal.price,
      originalPrice: relatedDeal.originalPrice,
      merchant: relatedDeal.merchant,
      category: relatedDeal.category,
      dealUrl: relatedDeal.dealUrl,
      expired: relatedDeal.expired,
      expiresAt: relatedDeal.expiresAt,
      createdAt: relatedDeal.createdAt,
      score: 0, // We don't calculate score for related deals to keep it simple
      commentCount: relatedDeal._count.comments,
      postedBy: {
        id: relatedDeal.user.id,
        name: relatedDeal.user.username,
        avatar: relatedDeal.user.avatarUrl,
      },
    }))

    return NextResponse.json(formattedDeals)
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while fetching related deals" }, { status: 500 })
  }
}
