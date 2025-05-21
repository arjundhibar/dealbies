"use client"

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
import {
  Search,
  Menu,
  User,
  LogOut,
  PlusCircle,
  Bell,
  Heart,
  ShoppingBag,
  Flame,
  Tag,
  MessageSquare,
  ChevronDown,
  Grid,
  Plus,
  Sliders,
} from "lucide-react"
import { PostDealForm } from "@/components/post-deal-form"
import { UnifiedAuthForm } from "@/components/unified-auth-form"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppSidebar } from "@/components/app-sidebar"

export function Navbar() {
  const { user, signOut } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isPostDealOpen, setIsPostDealOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState("for-you")
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [view, setView] = useState<"main" | "categories">("main")

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

  // Auth button/link that handles both login and signup for mobile and desktop cases
  const AuthButton = () => {
    if (isMobile) {
      return (
        <Sheet open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="font-medium flex flex-col items-center justify-center gap-1 h-auto py-2"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Account</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader className="mb-4">
              <SheetTitle>Log in or register</SheetTitle>
            </SheetHeader>
            <UnifiedAuthForm onSuccess={handleLoginSuccess} isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} />
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <Button variant="ghost" size="sm" className="font-medium text-md rounded-full" onClick={() => setIsLoginOpen(true)}>
          <User className="h-4 w-4 mr-2" />
          Login or Register
        </Button>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="mb-2">
            <DialogTitle className="mb-4">
              <span className="flex items-center gap-1">
                <Flame className="h-6 w-6 text-hotukdeals-red" />
                <span className="text-xl font-bold">DealHunter</span>
              </span>
            </DialogTitle>
            <DialogTitle>Log in or register</DialogTitle>
            <DialogDescription>Enter your email to continue</DialogDescription>
          </DialogHeader>
          <UnifiedAuthForm onSuccess={handleLoginSuccess} isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} />
        </DialogContent>
      </Dialog>
    )
  }

  // Mobile bottom navigation
  const MobileBottomNav = () => {
    if (!isMobile) return null

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background text-foreground border-t z-50 flex justify-around items-center h-14">
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center gap-1 h-auto py-2 rounded-none flex-1"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs">Menu</span>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center gap-1 h-auto py-2 rounded-none flex-1"
        >
          <Bell className="h-5 w-5" />
          <span className="text-xs">DealAlerts</span>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center gap-1 h-auto py-2 rounded-none flex-1"
          onClick={() => {
            if (user) {
              setIsPostDealOpen(true)
            } else {
              setIsLoginOpen(true)
            }
          }}
        >
          <Plus className="h-5 w-5" />
          <span className="text-xs">Post</span>
        </Button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-col items-center justify-center gap-1 h-auto py-2 rounded-none flex-1"
              >
                <User className="h-5 w-5" />
                <span className="text-xs">Account</span>
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
          <AuthButton />
        )}
      </div>
    )
  }

  return (
    <>
      {/* Sidebar Sheet */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0" hideCloseButton>
          <AppSidebar
            onClose={() => setIsSidebarOpen(false)}
            initialView={view}
            onLoginClick={() => setIsLoginOpen(true)}
          />
        </SheetContent>
      </Sheet>
      <header
        className={cn("sticky top-0 z-40 w-full bg-background text-foreground border-b", isScrolled && "shadow-sm")}
      >
        <div className="container mx-auto">
          {/* Top Navigation Bar */}
          <div className={cn("flex items-center justify-between", isMobile ? "h-16 px-4 py-3" : "h-16 px-4")}>
            {isMobile ? (
              <>
                <div className="flex w-full items-center justify-between gap-4">
                  <Link href="/" className="flex items-center gap-1 shrink-0">
                    <Flame className="h-6 w-6 text-hotukdeals-red" />
                    <span className="text-xl font-bold">DealHunter</span>
                  </Link>
                  <form onSubmit={handleSearch} className="relative flex-1 max-w-[65%]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-full pl-12 pr-4 h-11 rounded-full border-gray-200 bg-gray-50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <Link href="/" className="flex items-center gap-1">
                    <Flame className="h-6 w-6 text-hotukdeals-red" />
                    <span className="text-xl font-bold">DealHunter</span>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    className="border rounded-full flex items-center gap-2"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <Menu className="h-4 w-4" />
                    <span className="font-medium">Menu</span>
                  </Button>
                </div>

                <form onSubmit={handleSearch} className="relative max-w-xl w-full mx-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 h-10 rounded-full border-gray-300"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>

                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1 font-medium text-md rounded-full">
                    <Bell className="h-4 w-4 mr-1" />
                    Create DealAlert
                  </Button>

                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="font-medium">
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
                    <AuthButton />
                  )}

                  <Button
                    className="bg-hotukdeals-red hover:bg-red-600 text-white rounded-full"
                    size="sm"
                    onClick={() => {
                      if (user) {
                        setIsPostDealOpen(true)
                      } else {
                        setIsLoginOpen(true)
                      }
                    }}
                  >
                    <PlusCircle className="mr-1 h-4 w-4 md:hidden" />
                    <span className="hidden md:inline mr-1">Post</span>
                    <span className="md:hidden">Post</span>
                  </Button>

                  {user && (
                    <Dialog open={isPostDealOpen} onOpenChange={setIsPostDealOpen}>
                      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                          <DialogTitle>Post a New Deal</DialogTitle>
                          <DialogDescription>
                            Share a great deal with the community. Fill out the form below with all the details.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-auto pb-6">
                          <PostDealForm onSuccess={handleDealPosted} />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Secondary Navigation - Categories */}
          {isMobile ? (
            <div className="flex overflow-x-auto scrollbar-hide">
              <div className="flex items-center px-4 py-2.5 space-x-5 whitespace-nowrap">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 font-normal text-sm p-0"
                  onClick={() => {
                    setIsSidebarOpen(true)
                    setView("categories")
                  }}
                >
                  <Grid className="h-4 w-4 mr-1" />
                  Categories
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center gap-1 font-normal text-sm p-0">
                  <Tag className="h-4 w-4 mr-1" />
                  Discount codes
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center gap-1 font-normal text-sm p-0" asChild>
                  <Link href="/deals">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Deals
                  </Link>
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center gap-1 font-normal text-sm p-0" asChild>
                  <Link href="/freebies">
                    <Heart className="h-4 w-4 mr-1" />
                    Freebies
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex border-border overflow-x-auto scrollbar-hide">
              <div className="flex items-center px-4 py-2 space-x-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 font-medium"
                  onClick={() => {
                    setIsSidebarOpen(true)
                    setView("categories")
                  }}
                >
                  <Grid className="h-4 w-4 mr-1" />
                  Categories
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 font-medium">
                      <Tag className="h-4 w-4 mr-1" />
                      Discount codes
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem asChild>
                      <Link href="/coupons/popular">Popular</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/coupons/new">New</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/coupons/expiring">Expiring Soon</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="sm" className="flex items-center gap-1 font-medium" asChild>
                  <Link href="/deals">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Deals
                  </Link>
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center gap-1 font-medium" asChild>
                  <Link href="/freebies">
                    <Heart className="h-4 w-4 mr-1" />
                    Freebies
                  </Link>
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center gap-1 font-medium" asChild>
                  <Link href="/discussion">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Discussion
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="flex border-border justify-between items-center px-4">
            <Tabs defaultValue="for-you" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-transparent h-10 p-0">
                <TabsTrigger
                  value="for-you"
                  className={cn(
                    "rounded-none h-10 px-4 data-[state=active]:border-b-2 data-[state=active]:border-hotukdeals-red data-[state=active]:shadow-none",
                    activeTab === "for-you" ? "text-hotukdeals-red font-medium" : "text-gray-600",
                  )}
                >
                  For you
                </TabsTrigger>
                <TabsTrigger
                  value="hottest"
                  className={cn(
                    "rounded-none h-10 px-4 data-[state=active]:border-b-2 data-[state=active]:border-hotukdeals-red data-[state=active]:shadow-none",
                    activeTab === "hottest" ? "text-hotukdeals-red font-medium" : "text-gray-600",
                  )}
                >
                  Hottest
                </TabsTrigger>
                <TabsTrigger
                  value="is-called"
                  className={cn(
                    "rounded-none h-10 px-4 data-[state=active]:border-b-2 data-[state=active]:border-hotukdeals-red data-[state=active]:shadow-none",
                    activeTab === "is-called" ? "text-hotukdeals-red font-medium" : "text-gray-600",
                  )}
                >
                  Is called
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className={cn(
                    "rounded-none h-10 px-4 data-[state=active]:border-b-2 data-[state=active]:border-hotukdeals-red data-[state=active]:shadow-none",
                    activeTab === "new" ? "text-hotukdeals-red font-medium" : "text-gray-600",
                  )}
                >
                  New
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {isMobile ? (
              <div className="flex items-center justify-center w-8 h-8 p-2 rounded-full border border-gray-200 bg-white ml-2">
                <Sliders className="h-4 w-4" />
                {/* <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-hotukdeals-red text-[10px] font-medium text-white">
                  1
                </span> */}
              </div>
            ) : (
                <Button variant="outline" size="sm" className="flex items-center rounded-full gap-1 ml-auto">
                  <Sliders className="h-5 w-5" />
                Filter
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-hotukdeals-red text-[10px] font-medium text-white">
                  1
                </span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Add padding at the bottom to account for the fixed mobile nav */}
      {isMobile && <div className="h-14"></div>}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Mobile Post Deal Form */}
      {isMobile && user && (
        <PostDealForm onSuccess={handleDealPosted} isOpen={isPostDealOpen} onOpenChange={setIsPostDealOpen} />
      )}
    </>
  )
}
