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
    const { dealId, voteType } = await request.json()

    if (!dealId || !voteType) {
      return NextResponse.json({ error: "Missing dealId or voteType" }, { status: 400 })
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_dealId_couponId_commentId: {
          userId,
          dealId,
          couponId: '',
          commentId: '',
        },
      },
    })

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await prisma.vote.delete({
          where: {
            userId_dealId_couponId_commentId: {
              userId,
              dealId,
              couponId: '',
              commentId: '',
            },
          },
        })
        return NextResponse.json({ action: "removed" }, { status: 200 })
      } else {
        await prisma.vote.update({
          where: {
            userId_dealId_couponId_commentId: {
              userId,
              dealId,
              couponId: '',
              commentId: '',
            },
          },
          data: { voteType },
        })
        return NextResponse.json({ action: "updated" }, { status: 200 })
      }
    } else {
      await prisma.vote.create({
        data: {
          userId,
          dealId,
          voteType,
          couponId: null,
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
