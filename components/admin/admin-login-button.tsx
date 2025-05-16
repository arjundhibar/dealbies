"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function AdminLoginButton() {
  const router = useRouter()

  return (
    <Button variant="outline" onClick={() => router.push("/admin/login")}>
      Admin Login
    </Button>
  )
}
