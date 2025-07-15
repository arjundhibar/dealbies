import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma";


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const dealUrl = searchParams.get("url");

    if (!dealUrl) {
        return NextResponse.json({ error: "Missing deal url" }, { status: 400 });
    }
    try {
        const existingDeal = await prisma.deal.findFirst({
            where: { dealUrl },
            select: {
                id: true,
                title: true,
                dealUrl: true,
                createdAt: true,
                imageUrl: true,
                price: true,
                merchant: true,
            }
        })
        if (existingDeal) {
            const deal = { ...existingDeal, image: existingDeal.imageUrl };
            if ('imageUrl' in deal) {
                delete (deal as any).imageUrl;
            }
            return NextResponse.json({ exists: true, deal })
        } else {
            return NextResponse.json({ exists: false })
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to check deal" }, { status: 500 });
    }
}
