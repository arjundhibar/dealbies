"use client"

import { useState, useEffect } from "react"
import { CouponCard } from "@/components/coupon-card"
import { useData } from "@/lib/data-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { PostCouponForm } from "@/components/post-coupon-form"
import type { Coupon } from "@/lib/types"

interface CouponsListProps {
  merchant?: string
  initialSort?: string
}

export function CouponsList({ merchant, initialSort = "newest" }: CouponsListProps) {
  const { fetchCoupons, isLoading, currentUser } = useData()
  const [sort, setSort] = useState(initialSort)
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([])
  const [isPostCouponOpen, setIsPostCouponOpen] = useState(false)

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const coupons = await fetchCoupons(merchant, sort)
        setFilteredCoupons(coupons)
      } catch (error) {
        console.error("Error loading coupons:", error)
      }
    }

    loadCoupons()
  }, [merchant, sort, fetchCoupons])

  const handleCouponPosted = async () => {
    setIsPostCouponOpen(false)
    // Refetch coupons to update the list
    const coupons = await fetchCoupons(merchant, sort)
    setFilteredCoupons(coupons)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">{merchant ? `${merchant} Coupons` : "Coupons & Vouchers"}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[150px] sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="hottest">Hottest</SelectItem>
              <SelectItem value="expiring">Expiring Soon</SelectItem>
            </SelectContent>
          </Select>

          {currentUser && (
            <Dialog open={isPostCouponOpen} onOpenChange={setIsPostCouponOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-2">
                  <Plus className="h-4 w-4 mr-1" /> Post Coupon
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Post a New Coupon</DialogTitle>
                  <DialogDescription>
                    Share a great coupon with the community. Fill out the form below with all the details.
                  </DialogDescription>
                </DialogHeader>
                <PostCouponForm onSuccess={handleCouponPosted} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border">
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <h3 className="text-lg font-medium">No coupons found</h3>
          <p className="text-muted-foreground mb-4">
            {merchant
              ? `There are no coupons for ${merchant} yet.`
              : "There are no coupons yet. Be the first to post one!"}
          </p>
          {currentUser && (
            <Dialog open={isPostCouponOpen} onOpenChange={setIsPostCouponOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Post a Coupon
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Post a New Coupon</DialogTitle>
                  <DialogDescription>
                    Share a coupon code with the community. Fill out the form below with all the details.
                  </DialogDescription>
                </DialogHeader>
                <PostCouponForm onSuccess={handleCouponPosted} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}
    </div>
  )
}
