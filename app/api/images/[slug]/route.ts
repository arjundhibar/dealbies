import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  // Find the image by slug
  const image = await prisma.dealImage.findUnique({
    where: { slug },
  });

  if (!image || !image.cloudflareUrl) {
    // Optionally, serve a placeholder image if not found
    return NextResponse.redirect("/placeholder.jpg", 302);
  }

  // Redirect to the actual Cloudflare image URL
  return NextResponse.redirect(image.cloudflareUrl, 302);
} 