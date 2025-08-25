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

    // Create the coupon
    const coupon = await prisma.coupon.create({
      data: {
        code: data.code,
        title: data.title,
        description: data.description,
        merchant: data.merchant,
        logoUrl: data.logoUrl || null,
        expiresAt: new Date(data.expiresAt),
        terms: data.terms || null,
        userId: user.id,
      },
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while creating the coupon" }, { status: 500 })
  }
}
