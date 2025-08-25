// app/api/admin/verify/route.ts
import { getSupabase } from "@/lib/supabase"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = getSupabase(token)
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user?.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { role: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ role: dbUser.role })
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
