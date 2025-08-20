import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSupabase } from "@/lib/supabase";
import slugify from "slugify";

async function isPrismaInitialized() {
  try {
    await prisma.$connect();
    console.log("Prisma is connected");
    return true;
  } catch (err) {
    console.error("❌ Prisma failed to connect:", err);
    return false;
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
    console.log("▶️ Start /api/coupons handler");

    if (!(await isPrismaInitialized())) {
      return NextResponse.json({ error: "Database connection not available." }, { status: 503 });
    }

    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 });
    }

    const body = await request.json();
    const {
      title,
      description,
      discountCode,
      discountType,
      discountValue,
      availability,
      couponUrl,
      expiresAt,
      startAt,
      category,
      imageUrls,
      coverImageIndex = 0,
    } = body;

    const merchant = extractMerchant(couponUrl)
    // Validate required fields
    if (
      !title ||
      !description ||
      !discountCode ||
      !discountType ||
      !availability ||
      !couponUrl ||
      !category ||
      !imageUrls ||
      imageUrls.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          title,
          description,
          discountCode,
          discountType,
          availability,
          couponUrl,
          category,
          imageUrls,
        },
        { status: 400 }
      );
    }

    // Supabase Auth check
    const supabase = getSupabase();
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized user not found" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found in database" }, { status: 403 });
    }

    // Create slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Parse discountValue if present
    const parsedDiscountValue = discountValue ? parseFloat(discountValue) : null;

    const coupon = await prisma.coupon.create({
      data: {
        title,
        slug,
        description,
        discountCode,
        discountType: discountType.toLowerCase(),
        discountValue: parsedDiscountValue,
        merchant,
        availability: availability.toUpperCase(),
        couponUrl,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        startAt: startAt ? new Date(startAt) : null,
        category,
        userId: user.id,
        images: {
          create: imageUrls.map((img: any, index: number) => ({
            url: img.url,
            cloudflareUrl: img.cloudflareUrl,
            slug: img.slug,
            isCover: img.isCover ?? index === coverImageIndex,
          })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json({ success: true, couponId: coupon.id }, { status: 201 });
  } catch (err) {
    console.error("🔥 Coupon POST Error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
