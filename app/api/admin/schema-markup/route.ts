import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSupabase } from "@/lib/supabase";

// GET - Fetch schema markup settings (public, but only admins can update)
export async function GET() {
  try {
    let settings = await prisma.schemaMarkupSettings.findUnique({
      where: { id: "schema-markup-settings" },
    });

    // If settings don't exist, create default ones
    if (!settings) {
      settings = await prisma.schemaMarkupSettings.create({
        data: {
          id: "schema-markup-settings",
          dealsSchema: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Offer",
          }),
          couponsSchema: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Coupon",
          }),
          articlesSchema: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
          }),
          storesSchema: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
          }),
          faqSchema: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
          }),
          enabled: true,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching schema markup settings:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching schema markup settings" },
      { status: 500 }
    );
  }
}

// PUT - Update schema markup settings (admin only)
export async function PUT(request: Request) {
  try {
    const data = await request.json();

    // Check if user is authenticated and is an admin
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Internal server error (no Supabase instance)" },
        { status: 500 }
      );
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate JSON schemas
    const validateJSON = (jsonString: string | null | undefined): boolean => {
      if (!jsonString) return true;
      try {
        JSON.parse(jsonString);
        return true;
      } catch {
        return false;
      }
    };

    if (data.dealsSchema && !validateJSON(data.dealsSchema)) {
      return NextResponse.json(
        { error: "Invalid JSON in dealsSchema" },
        { status: 400 }
      );
    }
    if (data.couponsSchema && !validateJSON(data.couponsSchema)) {
      return NextResponse.json(
        { error: "Invalid JSON in couponsSchema" },
        { status: 400 }
      );
    }
    if (data.articlesSchema && !validateJSON(data.articlesSchema)) {
      return NextResponse.json(
        { error: "Invalid JSON in articlesSchema" },
        { status: 400 }
      );
    }
    if (data.storesSchema && !validateJSON(data.storesSchema)) {
      return NextResponse.json(
        { error: "Invalid JSON in storesSchema" },
        { status: 400 }
      );
    }
    if (data.faqSchema && !validateJSON(data.faqSchema)) {
      return NextResponse.json(
        { error: "Invalid JSON in faqSchema" },
        { status: 400 }
      );
    }

    // Update or create schema markup settings
    const settings = await prisma.schemaMarkupSettings.upsert({
      where: { id: "schema-markup-settings" },
      update: {
        dealsSchema: data.dealsSchema !== undefined ? data.dealsSchema : undefined,
        couponsSchema: data.couponsSchema !== undefined ? data.couponsSchema : undefined,
        articlesSchema: data.articlesSchema !== undefined ? data.articlesSchema : undefined,
        storesSchema: data.storesSchema !== undefined ? data.storesSchema : undefined,
        faqSchema: data.faqSchema !== undefined ? data.faqSchema : undefined,
        enabled: data.enabled !== undefined ? data.enabled : true,
      },
      create: {
        id: "schema-markup-settings",
        dealsSchema: data.dealsSchema || JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Offer",
        }),
        couponsSchema: data.couponsSchema || JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Coupon",
        }),
        articlesSchema: data.articlesSchema || JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
        }),
        storesSchema: data.storesSchema || JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
        }),
        faqSchema: data.faqSchema || JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
        }),
        enabled: data.enabled !== undefined ? data.enabled : true,
      },
    });

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Error updating schema markup settings:", error);
    return NextResponse.json(
      { error: "An error occurred while updating schema markup settings" },
      { status: 500 }
    );
  }
}

