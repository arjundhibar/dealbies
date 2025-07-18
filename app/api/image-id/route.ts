import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
        return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const image = await prisma.dealImage.findFirst({
        where: { slug },
        select: { imageId: true },
    });

    if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ imageId: image.imageId });
}
