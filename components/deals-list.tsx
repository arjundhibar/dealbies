"use client"

import { useState, useEffect } from "react"
import { DealCard } from "@/components/deal-card"
import { useData } from "@/lib/data-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Filter, ChevronDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PostDealForm } from "@/components/post-deal-form"
import type { Deal } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DealsListProps {
  category?: string
  initialSort?: string
}

export function DealsList({ category, initialSort = "newest" }: DealsListProps) {
  const { fetchDeals, isLoading } = useData()
  const { user } = useAuth()
  const [sort, setSort] = useState(initialSort)
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([])
  const [isPostDealOpen, setIsPostDealOpen] = useState(false)
  const [view, setView] = useState<"grid" | "list">("grid")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const deals = await fetchDeals(category, sort)
        setFilteredDeals(deals)
      } catch (error) {
        console.error("Error loading deals:", error)
      }
    }

    loadDeals()
  }, [category, sort, fetchDeals])

  const handleDealPosted = async () => {
    setIsPostDealOpen(false)
    // Refetch deals to update the list
    try {
      const deals = await fetchDeals(category, sort)
      setFilteredDeals(deals)
      toast({
        title: "Success!",
        description: "Your deal has been posted and is now visible in the list.",
      })
    } catch (error) {
      console.error("Error refreshing deals:", error)
    }
  }

  const handlePostDealClick = () => {
    if (!user) {
      router.push("/login?redirect=/")
      toast({
        title: "Login required",
        description: "You need to be logged in to post a deal.",
      })
      return
    }
    setIsPostDealOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{category ? `${category} Deals` : "Latest Deals"}</h1>

        <div className="flex flex-wrap items-center gap-2">
          <Dialog open={isPostDealOpen} onOpenChange={setIsPostDealOpen}>
            <DialogTrigger asChild>
              <Button className="bg-hotukdeals-red hover:bg-red-600 text-white" onClick={handlePostDealClick}>
                <Plus className="mr-2 h-4 w-4" />
                Post Deal
              </Button>
            </DialogTrigger>
            {user && (
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Post a New Deal</DialogTitle>
                  <DialogDescription>
                    Share a great deal with the community. Fill out the form below with all the details.
                  </DialogDescription>
                </DialogHeader>
                <PostDealForm onSuccess={handleDealPosted} />
              </DialogContent>
            )}
          </Dialog>
        </div>
      </div>

      {/* Filters and sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-white p-3">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => router.push("/")}>All Deals</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/category/tech")}>Tech</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/category/fashion")}>Fashion</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/category/home")}>Home</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/category/gaming")}>Gaming</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="hottest">Hottest</SelectItem>
              <SelectItem value="comments">Most Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="grid" value={view} onValueChange={(v) => setView(v as "grid" | "list")}>
          <TabsList className="h-9">
            <TabsTrigger value="grid" className="px-3">
              Grid
            </TabsTrigger>
            <TabsTrigger value="list" className="px-3">
              List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Deals grid */}
      {isLoading ? (
        <div className="deal-card-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <h3 className="text-lg font-medium">No deals found</h3>
          <p className="text-muted-foreground mb-4">
            {category
              ? `There are no deals in the ${category} category yet.`
              : "There are no deals yet. Be the first to post one!"}
          </p>
          <Dialog open={isPostDealOpen} onOpenChange={setIsPostDealOpen}>
            <DialogTrigger asChild>
              <Button className="bg-hotukdeals-red hover:bg-red-600 text-white" onClick={handlePostDealClick}>
                <Plus className="mr-2 h-4 w-4" />
                Post a Deal
              </Button>
            </DialogTrigger>
            {user && (
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Post a New Deal</DialogTitle>
                  <DialogDescription>
                    Share a great deal with the community. Fill out the form below with all the details.
                  </DialogDescription>
                </DialogHeader>
                <PostDealForm onSuccess={handleDealPosted} />
              </DialogContent>
            )}
          </Dialog>
        </div>
      ) : (
        <div className={view === "grid" ? "deal-card-grid" : "space-y-4"}>
          {filteredDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  )
}
