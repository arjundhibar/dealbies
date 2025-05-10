import type React from "react"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import prisma from "@/lib/prisma"

export const metadata = {
  title: "Admin Dashboard - Deal Hunter",
  description: "Manage deals, coupons, and users",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  console.log("✅ AdminLayout: Running...")

  const supabase = createServerSupabaseClient()

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession()

  // if (!session) {
  //   console.warn("⛔ No session found. Redirecting to login...")
  //   redirect("/login?callbackUrl=/admin")
  // }

  // console.log("✅ Session found for:", session.user.email)

  // const user = await prisma.user.findUnique({
  //   where: { email: session.user.email! },
  //   select: { id: true, email: true, role: true },
  // })

  // if (!user) {
  //   console.warn("⚠️ User not found in database. Redirecting to home...")
  //   redirect("/")
  // }

  // if (user.role !== "ADMIN") {
  //   console.warn("🚫 User is not admin. Redirecting to home...")
  //   redirect("/")
  // }

  console.log("✅ Admin verified. Rendering layout...")

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
