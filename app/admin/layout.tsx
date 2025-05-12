import type React from "react";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Admin Dashboard - Deal Hunter",
  description: "Manage deals, coupons, and users",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  console.log("✅ AdminLayout: Running...");

  const supabase = createServerSupabaseClient();

  // Get the session from Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, redirect to login
  if (!session) {
    console.warn("⛔ No session found. Redirecting to login...");
    redirect("/login?callbackUrl=/admin");
  }

  // Check user role in your database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true, email: true, role: true },
  });

  // If user is not found in the database or is not an admin, redirect to home
  if (!user || user.role !== "ADMIN") {
    console.warn("🚫 User is not an admin. Redirecting to home...");
    redirect("/");
  }

  console.log("✅ Admin verified. Rendering layout...");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
