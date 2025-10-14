import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const couponId = params.id

    // Get user from session
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "You must be logged in to unsave coupons" }, { status: 401 })
    }

    // Find user in our database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete the saved coupon
    await (prisma as any).savedCoupon.deleteMany({
      where: {
        userId: user.id,
        couponId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unsaving coupon:", error)
    return NextResponse.json({ error: "An error occurred while unsaving the coupon" }, { status: 500 })
  }
}
