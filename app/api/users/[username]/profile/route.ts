import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: params.username },
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

export async function PUT(request: Request, { params }: { params: { username: string } }) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const supabase = getSupabase()
    
    // Verify the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get the current user from database
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if the user is trying to update their own profile
    if (currentUser.username !== params.username) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    console.log("Profile update request body:", body)
    const { username, email, avatarUrl, password } = body

    console.log("Updating user with data:", {
      username,
      email,
      avatarUrl,
      password: password ? "***" : undefined
    })

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        // Note: Password handling would need to be implemented with proper hashing
        // ...(password && { password: await hashPassword(password) }),
      },
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
      }
    })

    console.log("Updated user from database:", updatedUser)

    const response = {
      ...updatedUser,
      dealsPosted: updatedUser._count.deals,
      votesGiven: updatedUser._count.votes,
      commentsPosted: updatedUser._count.comments,
      _count: undefined
    }

    console.log("Sending response:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "An error occurred while updating the user" }, { status: 500 })
  }
} 