"use client"

import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { NextResponse } from "next/server"
import {ExternalLink} from "lucide-react"

export default function GoogleSignInButton({ className = "" }: { className?: string }) {
  const handleGoogleSignIn = async () => {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({error : "Internal server error!"})
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // Optional, adjust as needed
      },
    })

    if (error) {
      console.error("Google sign-in error:", error.message)
    }
  }

  return (
    <Button
      variant="outline"
      className={className}
      onClick={handleGoogleSignIn}
    >
      <ExternalLink className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  )
}
