"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useData } from "@/lib/data-context"
import { DealCard } from "@/components/deal-card"
import { CouponCard } from "@/components/coupon-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import type { Deal, Coupon } from "@/lib/types"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { deals, coupons } = useData()
  const [loading, setLoading] = useState(true)
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([])
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([])
  const [activeTab, setActiveTab] = useState("deals")

  useEffect(() => {
    if (!query) return

    // Simulate loading
    setLoading(true)
    setTimeout(() => {
      const lowerQuery = query.toLowerCase()

      // Filter deals
      const matchedDeals = deals.filter(
        (deal) =>
          deal.title.toLowerCase().includes(lowerQuery) ||
          deal.description.toLowerCase().includes(lowerQuery) ||
          deal.merchant.toLowerCase().includes(lowerQuery) ||
          deal.category.toLowerCase().includes(lowerQuery),
      )

      // Filter coupons
      const matchedCoupons = coupons.filter(
        (coupon) =>
          coupon.title.toLowerCase().includes(lowerQuery) ||
          coupon.description.toLowerCase().includes(lowerQuery) ||
          coupon.merchant.toLowerCase().includes(lowerQuery) ||
          coupon.code.toLowerCase().includes(lowerQuery),
      )

      setFilteredDeals(matchedDeals)
      setFilteredCoupons(matchedCoupons)
      setLoading(false)

      // Set active tab based on results
      if (matchedDeals.length === 0 && matchedCoupons.length > 0) {
        setActiveTab("coupons")
      }
    }, 500) // Simulate network delay
  }, [query, deals, coupons])

  if (!query) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Search for deals and coupons</h2>
          <p className="text-muted-foreground">Use the search bar in the header to find deals and coupons.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Search results for: <span className="text-primary">"{query}"</span>
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="deals">
            Deals {!loading && <span className="ml-2 text-xs">({filteredDeals.length})</span>}
          </TabsTrigger>
          <TabsTrigger value="coupons">
            Coupons {!loading && <span className="ml-2 text-xs">({filteredCoupons.length})</span>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deals">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
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
          ) : filteredDeals.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border p-8 text-center">
              <h3 className="text-lg font-medium">No deals found</h3>
              <p className="text-muted-foreground">Try searching with different keywords.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="coupons">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
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
          ) : filteredCoupons.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border p-8 text-center">
              <h3 className="text-lg font-medium">No coupons found</h3>
              <p className="text-muted-foreground">Try searching with different keywords.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
