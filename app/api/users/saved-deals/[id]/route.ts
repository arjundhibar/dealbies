import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const dealId = params.id

    // Get user from session
    const supabase = createServerComponentClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "You must be logged in to unsave deals" }, { status: 401 })
    }

    // Find user in our database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete the saved deal
    await prisma.savedDeal.deleteMany({
      where: {
        userId: user.id,
        dealId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unsaving deal:", error)
    return NextResponse.json({ error: "An error occurred while unsaving the deal" }, { status: 500 })
  }
}
