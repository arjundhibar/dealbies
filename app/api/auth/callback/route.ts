import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  console.log("Auth callback received with code:", !!code)

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error("Error exchanging code for session:", error)
      // Return to home page even if there's an error
      return NextResponse.redirect(new URL("/", request.url))
    }
  }
  
  // Redirect to the appropriate URL based on environment
  const redirectUrl = "https://dealhunter-woad.vercel.app" 

  console.log("Redirecting to:", redirectUrl)

  return NextResponse.redirect(redirectUrl)
}
