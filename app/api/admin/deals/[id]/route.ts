import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
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
      select: { role: true },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete the deal
    try {
      await prisma.deal.delete({
        where: { id: params.id },
      })
    } catch (err) {
      console.error("Prisma deletion error:", err)
      return NextResponse.json({ error: "Deal not found or already deleted" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting deal:", error)
    return NextResponse.json({ error: "An error occurred while deleting the deal" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
      select: { role: true },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update the deal
    const updatedDeal = await prisma.deal.update({
      where: { id: params.id },
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
      },
    })

    return NextResponse.json(updatedDeal)
  } catch (error) {
    console.error("Error updating deal:", error)
    return NextResponse.json({ error: "An error occurred while updating the deal" }, { status: 500 })
  }
}
