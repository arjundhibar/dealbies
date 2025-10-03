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

    console.log('Fetching image from Cloudflare URL:', image.cloudflareUrl);

    // Fetch the image from Cloudflare
    const response = await fetch(image.cloudflareUrl);
    
    if (!response.ok) {
      console.log('Failed to fetch image from Cloudflare');
      return new NextResponse('Image not available', { status: 404 });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': imageBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
} 