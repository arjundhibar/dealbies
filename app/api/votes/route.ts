import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Missing authentication token" }, { status: 401 })
    }

    const supabase = getSupabase(token)
    if (!supabase) {
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
    }

    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) {
      console.error("Token verification error:", error)
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }

    const userId = data.user.id
    const { dealId, couponId, voteType } = await request.json()

    if (!voteType) {
      return NextResponse.json({ error: "Missing voteType" }, { status: 400 })
    }

    if (!dealId && !couponId) {
      return NextResponse.json({ error: "Missing dealId or couponId" }, { status: 400 })
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        userId,
        dealId: dealId || null,
        couponId: couponId || null,
        commentId: null,
      },
    })

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await prisma.vote.delete({
          where: { id: existingVote.id },
        })
        return NextResponse.json({ action: "removed" }, { status: 200 })
      } else {
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { voteType },
        })
        return NextResponse.json({ action: "updated" }, { status: 200 })
      }
    } else {
      await prisma.vote.create({
        data: {
          userId,
          dealId: dealId || null,
          couponId: couponId || null,
          voteType,
          commentId: null,
        },
      })
      return NextResponse.json({ action: "created" }, { status: 201 })
    }
  } catch (error: any) {
    console.error("Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
