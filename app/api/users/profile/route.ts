import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const supabase = createServerComponentClient({ cookies })

    // Get user from session if email not provided
    if (!email) {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
        select: {
          id: true,
          email: true,
          username: true,
          avatarUrl: true,
          createdAt: true,
          _count: {
            select: {
              deals: true,
              votes: true,
              comments: true,
            }
          }
        },
      })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json({
        ...user,
        dealsPosted: user._count.deals,
        votesGiven: user._count.votes,
        commentsPosted: user._count.comments,
        _count: undefined
      })
    }

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            deals: true,
            votes: true,
            comments: true,
          }
        }
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...user,
      dealsPosted: user._count.deals,
      votesGiven: user._count.votes,
      commentsPosted: user._count.comments,
      _count: undefined
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "An error occurred while fetching the user" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { username, avatarUrl } = await request.json()

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          email: { not: session.user.email! },
        },
      })

      if (existingUser) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 })
      }
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email! },
      data: {
        username: username || undefined,
        avatarUrl: avatarUrl || undefined,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
      },
    })

    // Update user metadata in Supabase Auth
    await supabase.auth.updateUser({
      data: {
        username: username || undefined,
        avatar_url: avatarUrl || undefined,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "An error occurred while updating the user" }, { status: 500 })
  }
}
