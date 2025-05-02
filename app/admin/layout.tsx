import type React from "react"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { getSupabase } from "@/lib/supabase"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export const metadata = {
  title: "Admin Dashboard - Deal Hunter",
  description: "Manage deals, coupons, and users",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check if user is authenticated and is an admin
    const supabase = getSupabase()
    if (!supabase) {
        return NextResponse.json({error : "Internal Server error!"})
    }
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    console.log("Admin layout: No session found, redirecting to login");
    redirect("/login?callbackUrl=/admin")
  }

  console.log("Admin layout: Session found for user:", session.user.email);

  // Check if user is an admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true, email: true, role: true },
  })

  console.log("Admin layout: User data:", user);

  if (user?.role !== "ADMIN") {
    console.log("Admin layout: User is not an admin, redirecting to homepage");
    redirect("/")
  }

  console.log("Admin layout: User is admin, rendering admin layout");
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
