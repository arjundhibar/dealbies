import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Skip middleware for API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check auth condition for protected routes
  const protectedPaths = ["/profile", "/my-deals", "/saved"]
  const isProtectedRoute = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))

  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", req.url)
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is already logged in and tries to access login/signup pages, redirect to home
  if (session && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return res
}

export const config = {
  matcher: ["/profile/:path*", "/my-deals/:path*", "/saved/:path*", "/login", "/signup", "/api/:path*"],
}
