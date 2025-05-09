"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Skeleton } from "@/components/ui/skeleton"

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const syncUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.access_token || !session.user) {
        router.push("/login?error=session")
        return
      }

      const email = session.user.email
      const username = session.user.user_metadata?.username || email?.split("@")[0]

      // 🔁 Call your POST API to create user in Neon
      await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ username }),
      })

      router.push("/")
    }

    syncUser()
  }, [router, supabase])

  return <Skeleton/>
}
