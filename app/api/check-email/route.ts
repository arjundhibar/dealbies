import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    return NextResponse.json({ exists: !!user }) // true or false
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
