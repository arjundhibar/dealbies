import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "Username parameter is required" }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: { username },
      select: {
        email: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ email: user.email })
  } catch (error) {
    console.error("Error fetching email:", error)
    return NextResponse.json({ error: "An error occurred while fetching the email" }, { status: 500 })
  }
}
