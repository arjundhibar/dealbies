"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Loader2 } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export default function GoogleSignInButton({ className = "" }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithGoogle } = useAuth()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await signInWithGoogle()
    setIsLoading(false)
  }

  return (
    <Button variant="outline" className={className} onClick={handleGoogleSignIn} disabled={isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-5 w-5" />}
      Continue with Google
    </Button>
  )
}
