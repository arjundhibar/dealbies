"use client"

import { useState, useEffect } from "react"
import { DealCard } from "@/components/deal-card"
import { useData } from "@/lib/data-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PostDealForm } from "@/components/post-deal-form"
import type { Deal } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

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
      <div>
        <h1 className="text-xl font-bold text-gray-500">Deals for you</h1>
        <p className="text-gray-500">Specially selected deals based on your interactions on the platform</p>
      </div>

      {/* Deals list */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-background">
              <div className="flex flex-col md:flex-row">
                <Skeleton className="h-48 w-full md:w-48 rounded-t-lg md:rounded-l-lg md:rounded-tr-none" />
                <div className="p-4 space-y-3 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="rounded-lg border bg-background p-8 text-center">
          <h3 className="text-lg font-medium">No deals found</h3>
          <p className="text-muted-foreground mb-4">
            {category
              ? `There are no deals in the ${category} category yet.`
              : "There are no deals yet. Be the first to post one!"}
          </p>
          <Dialog open={isPostDealOpen} onOpenChange={setIsPostDealOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#E86C2A] hover:bg-[#D15E20] text-white" onClick={handlePostDealClick}>
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
        <div className="space-y-4">
          {filteredDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  )
}
