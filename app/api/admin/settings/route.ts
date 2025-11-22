import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"

// GET - Fetch site settings (public, but only admins can update)
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "site-settings" },
    })

    // If settings don't exist, create default ones
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "site-settings",
          siteTitle: "DealHunter - Find the Best Deals & Coupons",
          metaDescription:
            "Discover amazing deals, discounts, and coupons from top retailers. Join our community to share and find the best savings on electronics, fashion, home goods, and more.",
          siteName: "DealHunter",
          ogImage: "/og-image.jpg",
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json(
      { error: "An error occurred while fetching site settings" },
      { status: 500 }
    )
  }
}

// PUT - Update site settings (admin only)
export async function PUT(request: Request) {
  try {
    const data = await request.json()

    // Check if user is authenticated and is an admin
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json(
        { error: "Internal server error (no Supabase instance)" },
        { status: 500 }
      )
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update or create site settings
    const settings = await prisma.siteSettings.upsert({
      where: { id: "site-settings" },
      update: {
        siteTitle: data.siteTitle,
        metaDescription: data.metaDescription,
        siteName: data.siteName || "DealHunter",
        ogImage: data.ogImage || "/og-image.jpg",
      },
      create: {
        id: "site-settings",
        siteTitle: data.siteTitle || "DealHunter - Find the Best Deals & Coupons",
        metaDescription:
          data.metaDescription ||
          "Discover amazing deals, discounts, and coupons from top retailers. Join our community to share and find the best savings on electronics, fashion, home goods, and more.",
        siteName: data.siteName || "DealHunter",
        ogImage: data.ogImage || "/og-image.jpg",
      },
    })

    return NextResponse.json(settings, { status: 200 })
  } catch (error) {
    console.error("Error updating site settings:", error)
    return NextResponse.json(
      { error: "An error occurred while updating site settings" },
      { status: 500 }
    )
  }
}

