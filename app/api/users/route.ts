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

    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Not authenticated or token missing" }, { status: 401 })
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Now use 'user' (supabase user)
    const { username } = await request.json()
    const email = user.email!

    // ✅ Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      const { password: _, ...userWithoutPassword } = existingUser as any
  return NextResponse.json(userWithoutPassword, { status: 200 })
    }

    // ✅ Create user in Neon DB
    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        email,
        username: username || user.user_metadata?.username || email.split("@")[0],
        password: "", // Supabase handles auth
        avatarUrl: `/placeholder.svg?height=40&width=40&text=${(username || email.charAt(0)).toUpperCase()}`,
        createdAt: new Date(),
        updatedAt: new Date(),

      },
    })

    const { password: _, ...userWithoutPassword } = newUser as any
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      // Prisma unique constraint error
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    console.error("Error creating user:", error)
    return NextResponse.json({ error: "An error occurred while creating the user" }, { status: 500 })
  }
}
