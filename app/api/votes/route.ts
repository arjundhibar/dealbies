import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { dealId, couponId, commentId, voteType } = await request.json()

    // Get user from session
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "You must be logged in to vote" }, { status: 401 })
    }

    // Find user in our database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has already voted
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: user.id,
        dealId,
        couponId,
        commentId,
      },
    })

    if (existingVote) {
      // If same vote type, remove the vote
      if (existingVote.voteType === voteType) {
        await prisma.vote.delete({
          where: { id: existingVote.id },
        })

        return NextResponse.json({ action: "removed" })
      }

      // If different vote type, update the vote
      const updatedVote = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { voteType },
      })

      return NextResponse.json({ action: "updated", vote: updatedVote })
    }

    // Create new vote
    const vote = await prisma.vote.create({
      data: {
        userId: user.id,
        dealId,
        couponId,
        commentId,
        voteType,
      },
    })

    return NextResponse.json({ action: "created", vote }, { status: 201 })
  } catch (error) {
    console.error("Error processing vote:", error)
    return NextResponse.json({ error: "An error occurred while processing the vote" }, { status: 500 })
  }
}
