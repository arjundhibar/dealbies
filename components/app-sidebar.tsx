"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FlameIcon as Fire,
  Tag,
  ShoppingBag,
  Smartphone,
  Laptop,
  HomeIcon,
  Car,
  Plane,
  Baby,
  Shirt,
  Search,
  Bell,
  User,
  LogIn,
  PlusCircle,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const categories = [
  { name: "All Deals", icon: Fire, href: "/" },
  { name: "Coupons", icon: Tag, href: "/coupons" },
  { name: "Freebies", icon: ShoppingBag, href: "/freebies" },
]

const popularCategories = [
  { name: "Tech", icon: Smartphone, href: "/category/tech" },
  { name: "Computing", icon: Laptop, href: "/category/computing" },
  { name: "Home", icon: HomeIcon, href: "/category/home" },
  { name: "Auto", icon: Car, href: "/category/auto" },
  { name: "Travel", icon: Plane, href: "/category/travel" },
  { name: "Kids", icon: Baby, href: "/category/kids" },
  { name: "Fashion", icon: Shirt, href: "/category/fashion" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Fire className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold">DealHunter</span>
          </Link>
          <SidebarTrigger className="ml-auto" />
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search deals..." className="pl-8" />
        </div>
        <Button className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Submit Deal
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Deals</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category.name}>
                  <SidebarMenuButton asChild isActive={pathname === category.href} tooltip={category.name}>
                    <Link href={category.href}>
                      <category.icon className="h-4 w-4" />
                      <span>{category.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {popularCategories.map((category) => (
                <SidebarMenuItem key={category.name}>
                  <SidebarMenuButton asChild isActive={pathname === category.href} tooltip={category.name}>
                    <Link href={category.href}>
                      <category.icon className="h-4 w-4" />
                      <span>{category.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Notifications">
              <Link href="/notifications">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Profile">
              <Link href="/profile">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Login">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                <span>Login / Register</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
