"use client"

import {
  Home,
  Tag,
  Grid3X3,
  MessageSquare,
  User,
  X,
  Sun,
  Moon,
  Settings,
  ChevronRight,
  ArrowLeft,
  Smartphone,
  Gamepad,
  ShoppingBasket,
  ShoppingBag,
  Heart,
  Baby,
  Bed,
  Hammer,
  Car,
  Theater,
  Dumbbell,
  Phone,
  Wallet,
  Bell,
  Plane,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { SheetClose } from "@/components/ui/sheet"
import { useTheme } from "next-themes"

interface AppSidebarProps {
  onClose?: () => void
  initialView?: "main" | "categories"
  onLoginClick?: () => void
}

export function AppSidebar({ onClose, initialView = "main", onLoginClick }: AppSidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const [view, setView] = useState<"main" | "categories">(initialView)

  const categories = [
    { name: "Electronics", icon: Smartphone, href: "/category/electronics" },
    { name: "Gaming", icon: Gamepad, href: "/category/gaming" },
    { name: "Groceries", icon: ShoppingBasket, href: "/category/groceries" },
    { name: "Fashion & Accessories", icon: ShoppingBag, href: "/category/fashion" },
    { name: "Beauty & Health", icon: Heart, href: "/category/beauty" },
    { name: "Family & Children", icon: Baby, href: "/category/family" },
    { name: "Home & Living", icon: Bed, href: "/category/home" },
    { name: "Garden & DIY", icon: Hammer, href: "/category/garden" },
    { name: "Car & Motorcycle", icon: Car, href: "/category/car" },
    { name: "Culture & Leisure", icon: Theater, href: "/category/culture" },
    { name: "Sports & Outdoors", icon: Dumbbell, href: "/category/sports" },
    { name: "Telecom & Internet", icon: Phone, href: "/category/telecom" },
    { name: "Money Matters & Insurance", icon: Wallet, href: "/category/money" },
    { name: "Services and Contracts", icon: Bell, href: "/category/services-and-contracts" },
    { name: "To Travel", icon: Plane, href: "/category/to-travel" },
  ]

  if (view === "categories") {
    return (
      <div className="flex flex-col h-full bg-background text-foreground">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Categories</h2>
            <Link href="/categories" className="text-orange-500 text-lg" onClick={onClose}>
              View All
            </Link>
          </div>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>

        <div className="flex flex-col flex-1 overflow-auto p-6 space-y-6">
          <button className="flex items-center text-lg font-medium" onClick={() => setView("main")}>
            <ArrowLeft className="h-6 w-6 mr-3" />
            Back
          </button>

          <div className="space-y-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="flex items-center justify-between py-3 text-base"
                onClick={onClose}
              >
                <div className="flex items-center">
                  <category.icon className="h-6 w-6 mr-3 text-gray-500" />
                  <span>{category.name}</span>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="px-6 py-4 flex items-center justify-between border-b">
        <h2 className="text-2xl font-bold">Menu</h2>
        <SheetClose asChild>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetClose>
      </div>

      <div className="flex flex-col flex-1 overflow-auto p-6 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-1">
          <Link href="/" className="flex items-center py-3 text-base" onClick={onClose}>
            <Home className="h-6 w-6 text-orange-500 mr-3" />
            <span className="text-orange-500 font-medium">Home</span>
          </Link>

          <Link href="/discount-codes" className="flex items-center justify-between py-3 text-base" onClick={onClose}>
            <div className="flex items-center">
              <Tag className="h-6 w-6 mr-3" />
              <span>Discount codes</span>
            </div>
            <ChevronRight className="h-6 w-6 text-muted-foreground" />
          </Link>

          <button
            className="flex items-center justify-between w-full py-3 text-base text-left"
            onClick={() => setView("categories")}
          >
            <div className="flex items-center">
              <Grid3X3 className="h-6 w-6 mr-3" />
              <span>Categories</span>
            </div>
            <ChevronRight className="h-6 w-6 text-muted-foreground" />
          </button>

          <Link href="/discussion" className="flex items-center py-3 text-base" onClick={onClose}>
            <MessageSquare className="h-6 w-6 text-orange-500 mr-3" />
            <span>Discussion</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-border"></div>

        {/* Account Section */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold">Account</h3>

          <button
            className="flex items-center justify-between w-full py-3 text-base text-left"
            onClick={() => {
              if (onClose) onClose()
              // We need to access the navbar's login state
              // This will be passed as a prop
              if (onLoginClick) onLoginClick()
            }}
          >
            <div className="flex items-center">
              <User className="h-6 w-6 mr-3" />
              <span>Login or Register</span>
            </div>
            <ChevronRight className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>

        {/* Appearance Section */}
        <div className="space-y-3">
          <div className="flex items-center py-3 text-base">
            <Settings className="h-6 w-6 mr-3" />
            <span>Appearance</span>
          </div>

          <div className="flex rounded-full border border-border overflow-hidden">
            <button
              onClick={() => setTheme("light")}
              className={cn("flex-1 py-2 px-4 text-center", theme === "light" ? "bg-orange-500 text-white" : "")}
            >
              <Sun className="h-5 w-5 mx-auto" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={cn("flex-1 py-2 px-4 text-center", theme === "dark" ? "bg-orange-500 text-white" : "")}
            >
              <Moon className="h-5 w-5 mx-auto" />
            </button>
            <button
              onClick={() => setTheme("system")}
              className={cn("flex-1 py-2 px-4 text-center", theme === "system" ? "bg-orange-500 text-white" : "")}
            >
              Auto
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
