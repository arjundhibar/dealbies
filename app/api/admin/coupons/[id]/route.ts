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

    // Delete the coupon
    await prisma.coupon.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting coupon:", error)
    return NextResponse.json({ error: "An error occurred while deleting the coupon" }, { status: 500 })
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

    // Update the coupon
    const updatedCoupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        code: data.code,
        title: data.title,
        description: data.description,
        merchant: data.merchant,
        logoUrl: data.logoUrl || null,
        expiresAt: new Date(data.expiresAt),
        terms: data.terms || null,
      },
    })

    return NextResponse.json(updatedCoupon)
  } catch (error) {
    console.error("Error updating coupon:", error)
    return NextResponse.json({ error: "An error occurred while updating the coupon" }, { status: 500 })
  }
}
