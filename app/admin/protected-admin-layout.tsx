import type React from "react"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    // Get the user session server-side
    const supabase = createServerComponentClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session, redirect to login
    if (!session) {
      redirect("/")
      return null
    }

    // Check if the user is an admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    })


    // If not an admin, redirect to home
    if (!user || user.role !== "ADMIN") {
      redirect("/")
      return null
    }

    // User is authenticated and is an admin, render the children
    return <>{children}</>
  } catch (error) {
    // In case of error, redirect to home
    redirect("/")
    return null
  }
}
