"use client"

import { useState, useEffect } from "react"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { DealCard } from "@/components/deal-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { Deal } from "@/lib/types"

export default function SavedDealsPage() {
  const { currentUser, deals, savedDeals } = useData()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userSavedDeals, setUserSavedDeals] = useState<Deal[]>([])
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (!currentUser && !redirecting) {
      setRedirecting(true)
      router.push("/login")
    }
  }, [currentUser, router, redirecting])

  useEffect(() => {
    let isMounted = true // Add a flag to track component mount status

    // Simulate loading
    setLoading(true)
    const timer = setTimeout(() => {
      if (isMounted) {
        const savedDealsList = deals.filter((deal) => savedDeals.includes(deal.id))
        setUserSavedDeals(savedDealsList)
        setLoading(false)
      }
    }, 500)

    return () => {
      clearTimeout(timer) // Clear the timeout if the component unmounts
      isMounted = false // Set the flag to false when the component unmounts
    }
  }, [deals, savedDeals])

  if (!currentUser) {
    return null
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Saved Deals</h1>

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
      ) : userSavedDeals.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userSavedDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center">
          <h3 className="text-lg font-medium">No saved deals</h3>
          <p className="text-muted-foreground mb-4">You haven't saved any deals yet.</p>
          <Button onClick={() => router.push("/")}>Browse Deals</Button>
        </div>
      )}
    </div>
  )
}
