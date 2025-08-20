import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase } from "@/lib/supabase"
import slugify from "slugify"
import { getImageIdFromUrl } from "@/lib/getImageIdFromUrl";

// Helper function to check if Prisma is initialized
async function isPrismaInitialized() {
  try {
    await prisma.$connect()
    console.log("Prisma is connected")
    return true
  } catch (err) {
    console.error("❌ Prisma failed to connect:", err)
    return false
  }
}

function extractMerchant(url: string): string {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace(/^www\./, '')
  } catch {
    return 'unknown-merchant'
  }
}

export async function POST(request: Request) {
  try {
    console.log("▶️ Start /api/deals handler")
    if (!(await isPrismaInitialized())) {
      return NextResponse.json({ error: 'Database connection not available.' }, { status: 503 })
    }

    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 400 })
    }

    const body = await request.json()
    const {
      title,
      description,
      price,
      originalPrice,
      category,
      dealUrl,
      expiresAt,
      startAt,
      discountCode,
      availability,
      postageCosts,
      shippingFrom,
      imageUrls,
      coverImageIndex = 0,
    } = body

    // extract merchant from dealUrl
    const merchant = extractMerchant(dealUrl)
    console.log("📦 Payload received:", body)

    if (!title || !description || !category || !dealUrl || !price || !imageUrls || imageUrls.length === 0) {
      return NextResponse.json({ error: 'Missing required fields', title, description, category, dealUrl, price, imageUrls }, { status: 400 })
    }

    const supabase = getSupabase()
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 })
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized user not found' }, { status: 401 })
    }

    let dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 403 })
    }
    const slug = slugify(title, { lower: true, strict: true });
    // const imageId = getImageIdFromCloudflareResponse();
    const parsedPrice = parseFloat(price)
    const parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : null
    const parsedPostageCosts = postageCosts ? parseFloat(postageCosts) : null
   
    const deal = await prisma.deal.create({
      data: {
        title,
        slug,
        description,
        price: parsedPrice,
        originalPrice: parsedOriginalPrice,
        merchant,
        category,
        dealUrl,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        startAt: startAt ? new Date(startAt) : null,
        discountCode: discountCode || null,
        availability: availability.toUpperCase() || null,
        postageCosts: parsedPostageCosts,
        shippingFrom: shippingFrom || null,
        userId: user.id,
        images: {
          create: imageUrls.map((img: any, index: number) => ({
            url: img.url, // SEO-friendly URL
            cloudflareUrl: img.cloudflareUrl, // Actual Cloudflare URL
            slug: img.slug,
            isCover: img.isCover ?? index === coverImageIndex,
          })),
        },
      },
      include: { images: true },
    })

    return NextResponse.json({ success: true, dealId: deal.id }, { status: 201 })
  } catch (err) {
    console.error("🔥 Deal POST Error:", err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}


