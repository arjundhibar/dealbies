import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { attachAffiliateParams, getMerchantFromUrl } from "@/lib/affiliate-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    // Get client information for tracking
    const userAgent = request.headers.get('user-agent') || null;
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const referer = request.headers.get('referer') || null;
    
    // First try to find a deal with this slug
    let deal = await prisma.deal.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        dealUrl: true,
        expired: true,
        merchant: true,
      },
    });

    if (deal) {
      if (deal.expired) {
        return NextResponse.redirect(new URL(`/deal/${slug}`, request.url));
      }
      
      // Attach affiliate parameters
      const finalUrl = attachAffiliateParams(deal.dealUrl, deal.merchant);
      
      // Track the click in database
      await prisma.clickTracking.create({
        data: {
          slug,
          type: 'deal',
          originalUrl: deal.dealUrl,
          finalUrl,
          merchant: deal.merchant,
          userAgent,
          ipAddress,
          referer,
        },
      });
      
      console.log(`Deal click tracked: ${deal.title} (${deal.merchant})`);
      
      // Redirect to the final URL with affiliate parameters
      return NextResponse.redirect(finalUrl);
    }

    // If not a deal, try to find a coupon with this slug
    let coupon = await prisma.coupon.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        couponUrl: true,
        expired: true,
        merchant: true,
      },
    });

    if (coupon) {
      if (coupon.expired) {
        return NextResponse.redirect(new URL(`/coupon/${slug}`, request.url));
      }
      
      // Attach affiliate parameters
      const finalUrl = attachAffiliateParams(coupon.couponUrl, coupon.merchant || '');
      
      // Track the click in database
      await prisma.clickTracking.create({
        data: {
          slug,
          type: 'coupon',
          originalUrl: coupon.couponUrl,
          finalUrl,
          merchant: coupon.merchant,
          userAgent,
          ipAddress,
          referer,
        },
      });
      
      console.log(`Coupon click tracked: ${coupon.title} (${coupon.merchant})`);
      
      // Redirect to the final URL with affiliate parameters
      return NextResponse.redirect(finalUrl);
    }

    // If neither deal nor coupon found, redirect to 404 or home
    return NextResponse.redirect(new URL("/not-found", request.url));
    
  } catch (error) {
    console.error("Error in redirector:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
