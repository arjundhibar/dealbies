import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "An error occurred while fetching the user" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const supabase = getSupabase(token);
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Supabase user fetch error:", error);
    return new Response("Invalid Supabase token", { status: 401 });
  }

  const body = await req.json();
  const email = user.email!;
  const username = body.username || user.user_metadata?.username || email.split("@")[0];

  const existing = await prisma.user.findUnique({ where: { id: user.id } });
  if (existing) return new Response("User already exists", { status: 200 });

  const newUser = await prisma.user.create({
    data: {
      id: user.id,
      email,
      username,
    },
  });

  return Response.json({ user: newUser });
}
