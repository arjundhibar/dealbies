"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Menu, User, LogOut, PlusCircle, Bell, Heart, ShoppingBag, Flame } from "lucide-react"
import { PostDealForm } from "@/components/post-deal-form"
import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"

export function Navbar() {
  const { user, signOut } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isPostDealOpen, setIsPostDealOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleDealPosted = () => {
    setIsPostDealOpen(false)
  }

  const handleLoginSuccess = () => {
    setIsLoginOpen(false)
  }

  const mainCategories = [
    { name: "All Deals", href: "/", icon: Flame },
    { name: "Vouchers", href: "/coupons", icon: ShoppingBag },
    { name: "Freebies", href: "/freebies", icon: Heart },
  ]

  const popularCategories = [
    { name: "Tech", href: "/category/tech" },
    { name: "Fashion", href: "/category/fashion" },
    { name: "Home", href: "/category/home" },
    { name: "Gaming", href: "/category/gaming" },
    { name: "Travel", href: "/category/travel" },
  ]

  // Login button/link that handles both mobile and desktop cases
  const LoginButton = () => {
    if (isMobile) {
      return (
        <Sheet open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="font-normal">
              Login or Register
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader className="mb-4">
              <SheetTitle>Log In</SheetTitle>
            </SheetHeader>
            <LoginForm onSuccess={handleLoginSuccess} isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} />
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <Button variant="ghost" size="sm" className="font-normal" onClick={() => setIsLoginOpen(true)}>
          Login or Register
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log In</DialogTitle>
            <DialogDescription>Enter your credentials to access your account</DialogDescription>
          </DialogHeader>
          <LoginForm onSuccess={handleLoginSuccess} isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 bg-white border-b",
        isScrolled && "shadow-sm",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="border rounded-md">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <SheetHeader className="pb-6">
                  <SheetTitle className="flex items-center gap-2">
                    <Flame className="h-6 w-6 text-hotukdeals-red" />
                    <span className="text-xl font-bold">DealHunter</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="mb-4">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search deals..."
                      className="pl-8 pr-4"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                </div>

                <nav className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Main</h3>
                    <div className="space-y-1">
                      {mainCategories.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                            pathname === item.href ? "bg-hotukdeals-red text-white" : "hover:bg-muted",
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
                    <div className="space-y-1">
                      {popularCategories.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm font-medium",
                            pathname === item.href ? "bg-hotukdeals-red text-white" : "hover:bg-muted",
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <Link
                        href="/categories"
                        className="block rounded-md px-3 py-2 text-sm font-medium text-hotukdeals-red hover:bg-muted"
                      >
                        View all categories
                      </Link>
                    </div>
                  </div>

                  {user ? (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Account</h3>
                      <div className="space-y-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          href="/my-deals"
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          My Deals
                        </Link>
                        <Link
                          href="/saved"
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                        >
                          <Heart className="h-4 w-4" />
                          Saved Deals
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                        >
                          <LogOut className="h-4 w-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        onClick={() => setIsLoginOpen(true)}
                        className="block w-full rounded-md bg-hotukdeals-red px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-600"
                      >
                        Log In
                      </Button>
                      <Link
                        href="/signup"
                        className="block w-full rounded-md border border-hotukdeals-red px-3 py-2 text-center text-sm font-medium text-hotukdeals-red hover:bg-red-50"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-1">
              <Flame className="h-6 w-6 text-hotukdeals-red" />
              <span className="text-xl font-bold">DealHunter</span>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="relative hidden md:block max-w-xl w-full mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 h-10 rounded-full border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1">
              <Bell className="h-4 w-4 mr-1" />
              Create DealAlert
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="font-normal">
                    <User className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">
                      {user.user_metadata?.username || user.email?.split("@")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-deals">My Deals</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/saved">Saved Deals</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LoginButton />
            )}

            <Dialog open={isPostDealOpen} onOpenChange={setIsPostDealOpen}>
              <DialogTrigger asChild>
                <Button className="bg-hotukdeals-red hover:bg-red-600 text-white rounded-full" size="sm">
                  <PlusCircle className="mr-1 h-4 w-4" />
                  <span>Post</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Post a New Deal</DialogTitle>
                  <DialogDescription>
                    Share a great deal with the community. Fill out the form below with all the details.
                  </DialogDescription>
                </DialogHeader>
                <PostDealForm onSuccess={handleDealPosted} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  )
}
