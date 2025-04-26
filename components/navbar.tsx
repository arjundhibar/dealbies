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
} from "lucide-react"
import { PostDealForm } from "@/components/post-deal-form"
import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
            <Button
              variant="ghost"
              size="sm"
              className="font-medium flex flex-col items-center justify-center gap-1 h-auto py-2"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Log in</span>
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
        <Button variant="ghost" size="sm" className="font-medium" onClick={() => setIsLoginOpen(true)}>
          <User className="h-4 w-4 mr-2" />
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

  // Mobile bottom navigation
  const MobileBottomNav = () => {
    if (!isMobile) return null

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex justify-around items-center h-14">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center gap-1 h-auto py-2 rounded-none flex-1"
            >
              <Menu className="h-5 w-5" />
              <span className="text-xs">Menu</span>
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

        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center gap-1 h-auto py-2 rounded-none flex-1"
        >
          <Bell className="h-5 w-5" />
          <span className="text-xs">DealAlerts</span>
        </Button>

        <Dialog open={isPostDealOpen} onOpenChange={setIsPostDealOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center gap-1 h-auto py-2 rounded-none flex-1"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs">Post</span>
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
          <LoginButton />
        )}
      </div>
    )
  }

  return (
    <>
      <header className={cn("sticky top-0 z-40 w-full bg-white border-b", isScrolled && "shadow-sm")}>
        <div className="container mx-auto">
          {/* Top Navigation Bar */}
          <div className={cn("flex h-16 items-center justify-between px-4", isMobile && "h-14")}>
            {isMobile ? (
              <>
                <Link href="/" className="flex items-center gap-1">
                  <Flame className="h-6 w-6 text-hotukdeals-red" />
                  <span className="text-xl font-bold">DealHunter</span>
                </Link>
                <form onSubmit={handleSearch} className="relative max-w-[200px] w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 h-9 rounded-full border-gray-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </>
            ) : (
              <>
                  <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-1">
                    <Flame className="h-6 w-6 text-hotukdeals-red" />
                    <span className="text-xl font-bold">DealHunter</span>
                  </Link>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="border rounded-full flex items-center gap-2">
                        <Menu className="h-4 w-4" />
                        <span className="font-medium">Menu</span>
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

                  {/* <Link href="/" className="flex items-center gap-1">
                    <Flame className="h-6 w-6 text-hotukdeals-red" />
                    <span className="text-xl font-bold">DealHunter</span>
                  </Link> */}
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
                  <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1 font-medium">
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
                    <LoginButton />
                  )}

                  <Dialog open={isPostDealOpen} onOpenChange={setIsPostDealOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-hotukdeals-red hover:bg-red-600 text-white rounded-full" size="sm">
                        <PlusCircle className="mr-1 h-4 w-4 md:hidden" />
                        <span className="hidden md:inline mr-1">Post</span>
                        <span className="md:hidden">Post</span>
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
              </>
            )}
          </div>

          {/* Secondary Navigation - Categories */}
          <div className={cn("flex border-t border-gray-100 overflow-x-auto scrollbar-hide", isMobile && "text-sm")}>
            <div className="flex items-center px-4 py-2 space-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 font-medium">
                    <Grid className="h-4 w-4 mr-1" />
                    Categories
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {popularCategories.map((category) => (
                    <DropdownMenuItem key={category.name} asChild>
                      <Link href={category.href}>{category.name}</Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/categories" className="text-hotukdeals-red">
                      View all categories
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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

          {/* Tabs Navigation */}
          <div className="flex border-t border-gray-100 justify-between items-center px-4">
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

            <Button variant="outline" size="sm" className="flex items-center gap-1 ml-auto">
              Filter
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-hotukdeals-red text-[10px] font-medium text-white">
                1
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Add padding at the bottom to account for the fixed mobile nav */}
      {isMobile && <div className="h-14"></div>}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </>
  )
}
