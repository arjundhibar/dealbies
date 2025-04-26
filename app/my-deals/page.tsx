"use client"

import { useState, useEffect } from "react"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { DealCard } from "@/components/deal-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import type { Deal } from "@/lib/types"

export default function MyDealsPage() {
  const { currentUser, deals } = useData()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userDeals, setUserDeals] = useState<Deal[]>([])
  const [activeDeals, setActiveDeals] = useState<Deal[]>([])
  const [expiredDeals, setExpiredDeals] = useState<Deal[]>([])

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      router.push("/")
      return
    }

    // Simulate loading
    setLoading(true)
    setTimeout(() => {
      if (currentUser) {
        const userPostedDeals = deals.filter((deal) => deal.postedBy.id === currentUser.id)

        // Split into active and expired
        const active = userPostedDeals.filter((deal) => !deal.expired)
        const expired = userPostedDeals.filter((deal) => deal.expired)

        setUserDeals(userPostedDeals)
        setActiveDeals(active)
        setExpiredDeals(expired)
      }
      setLoading(false)
    }, 500)
  }, [currentUser, deals, router])

  // Redirect if not logged in
  if (!currentUser) {
    return null
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">My Deals</h1>
        <Button onClick={() => router.push("/")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Post New Deal
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">
            Active Deals {!loading && <span className="ml-2 text-xs">({activeDeals.length})</span>}
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired Deals {!loading && <span className="ml-2 text-xs">({expiredDeals.length})</span>}
          </TabsTrigger>
          <TabsTrigger value="all">
            All Deals {!loading && <span className="ml-2 text-xs">({userDeals.length})</span>}
          </TabsTrigger>
        </TabsList>

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
        ) : (
          <>
            <TabsContent value="active">
              {activeDeals.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeDeals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border p-8 text-center">
                  <h3 className="text-lg font-medium">No active deals</h3>
                  <p className="text-muted-foreground mb-4">You don't have any active deals at the moment.</p>
                  <Button onClick={() => router.push("/")}>Post a Deal</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="expired">
              {expiredDeals.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {expiredDeals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border p-8 text-center">
                  <h3 className="text-lg font-medium">No expired deals</h3>
                  <p className="text-muted-foreground">You don't have any expired deals.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all">
              {userDeals.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {userDeals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border p-8 text-center">
                  <h3 className="text-lg font-medium">No deals found</h3>
                  <p className="text-muted-foreground mb-4">You haven't posted any deals yet.</p>
                  <Button onClick={() => router.push("/")}>Post Your First Deal</Button>
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
