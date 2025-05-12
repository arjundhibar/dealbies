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
    })

    return NextResponse.json({ exists: !!user })
  } catch (error) {
    console.error("Error checking username:", error)
    return NextResponse.json({ error: "An error occurred while checking the username" }, { status: 500 })
  }
}
