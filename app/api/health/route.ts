import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Test direct SQL connection
    const sqlResult = await sql`SELECT 1 as result`

    // Test Prisma connection
    const prismaResult = await prisma.$queryRaw`SELECT 1 as result`

    return NextResponse.json({
      status: "ok",
      message: "Database connection successful",
      sqlResult,
      prismaResult,
    })
  } catch (error: any) {
    console.error("Database connection error:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
