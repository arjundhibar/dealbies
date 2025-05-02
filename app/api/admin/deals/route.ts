import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Check if user is authenticated and is an admin
      const supabase = getSupabase()
      if (!supabase) {
          return NextResponse.json({error : "Internal server error (no Supabase instance)"}, {status : 500})
      }
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Create the deal
    const deal = await prisma.deal.create({
      data: {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        merchant: data.merchant,
        category: data.category,
        dealUrl: data.dealUrl,
        imageUrl: data.imageUrl || null,
        expired: data.expired || false,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        userId: user.id,
      },
    })

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    console.error("Error creating deal:", error)
    return NextResponse.json({ error: "An error occurred while creating the deal" }, { status: 500 })
  }
}
