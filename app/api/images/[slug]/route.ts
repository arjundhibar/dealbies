import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('Image route called with slug:', params.slug);

    // First try to find a deal image
    let dealImage = await prisma.dealImage.findUnique({
      where: { slug: params.slug },
      select: { cloudflareUrl: true, url: true }
    });

    // If not found, try to find a coupon image
    let couponImage = null;
    if (!dealImage) {
      couponImage = await prisma.couponImage.findUnique({
        where: { slug: params.slug },
        select: { cloudflareUrl: true, url: true }
      });
    }

    const image = dealImage || couponImage;

    if (!image) {
      console.log('No image found for slug:', params.slug);
      return new NextResponse('Image not found', { status: 404 });
    }

    if (!image.cloudflareUrl) {
      console.log('No Cloudflare URL found for slug:', params.slug);
      return new NextResponse('Image source not available', { status: 404 });
    }

    console.log('Redirecting to Cloudflare URL:', image.cloudflareUrl);

    // Redirect to the Cloudflare URL
    return NextResponse.redirect(image.cloudflareUrl);
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
} 