import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error("Error exchanging code for session:", error.message)
      } else {
        console.log("Successfully exchanged code for session")
      }
    } catch (err) {
      console.error("Exception during code exchange:", err)
    }
  }

  // URL to redirect to after sign in process completes
  // Explicitly redirect to the production URL
  return NextResponse.redirect("https://dealhunter-woad.vercel.app")
}
