import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "An error occurred while fetching the user" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
    }

    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { username } = await request.json()

    // Check if user already exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create user in our database
    const user = await prisma.user.create({
      data: {
        id: session.user.id,
        email: session.user.email!,
        username: username || session.user.user_metadata.username || session.user.email!.split("@")[0],
        password: "", // We don't need to store the password as Supabase handles authentication
        avatarUrl: `/placeholder.svg?height=40&width=40&text=${(username || session.user.email!.charAt(0)).toUpperCase()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "An error occurred while creating the user" }, { status: 500 })
  }
}
