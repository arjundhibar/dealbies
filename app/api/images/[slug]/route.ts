import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { slug?: string } }) {
  const slug = params?.slug;
  if (!slug || typeof slug !== "string") {
    return NextResponse.redirect("/placeholder.jpg", 302);
  }
  const image = await prisma.dealImage.findUnique({ where: { slug } });
  if (!image || !image.cloudflareUrl) {
    return NextResponse.redirect("/placeholder.jpg", 302);
  }
  return NextResponse.redirect(image.cloudflareUrl, 302);
} 