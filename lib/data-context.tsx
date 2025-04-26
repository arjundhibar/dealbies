"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Deal, Comment, User, Coupon } from "./types"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface DataContextType {
  deals: Deal[]
  comments: Record<string, Comment[]>
  savedDeals: string[]
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  addDeal: (deal: Omit<Deal, "id" | "createdAt" | "score" | "commentCount" | "postedBy" | "userVote">) => Promise<Deal>
  addComment: (dealId: string, content: string, parentId?: string) => Promise<Comment>
  voteDeal: (dealId: string, voteType: "up" | "down") => Promise<void>
  voteComment: (dealId: string, commentId: string, voteType: "up" | "down") => Promise<void>
  getDeal: (id: string) => Promise<Deal | undefined>
  getRelatedDeals: (dealId: string, limit?: number) => Promise<Deal[]>
  saveDeal: (dealId: string) => Promise<void>
  unsaveDeal: (dealId: string) => Promise<void>
  isSaved: (dealId: string) => boolean
  fetchDeals: (category?: string, sort?: string) => Promise<Deal[]>
  fetchCoupons: (merchant?: string, sort?: string) => Promise<Coupon[]>
  isLoading: boolean
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  // Initialize with empty arrays instead of mock data
  const [deals, setDeals] = useState<Deal[]>([])
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [savedDeals, setSavedDeals] = useState<string[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch user profile when auth user changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setCurrentUser(null)
        return
      }

      try {
        const response = await fetch(`/api/users/profile`)
        if (response.ok) {
          const userData = await response.json()
          setCurrentUser(userData)
        } else {
          // If user doesn't exist in our database yet, create them
          const createResponse = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: user.user_metadata?.username || user.email?.split("@")[0],
            }),
          })

          if (createResponse.ok) {
            const newUser = await createResponse.json()
            setCurrentUser(newUser)
          } else {
            // If we can't create the user, set a temporary user object
            setCurrentUser({
              id: user.id,
              email: user.email || "",
              username: user.user_metadata?.username || user.email?.split("@")[0] || "User",
              avatarUrl: user.user_metadata?.avatar_url,
              createdAt: new Date().toISOString(),
            })
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        // Set a temporary user object if there's an error
        setCurrentUser({
          id: user.id,
          email: user.email || "",
          username: user.user_metadata?.username || user.email?.split("@")[0] || "User",
          avatarUrl: user.user_metadata?.avatar_url,
          createdAt: new Date().toISOString(),
        })
      }
    }

    fetchUserProfile()
  }, [user])

  // Fetch user's saved deals when user changes
  useEffect(() => {
    const fetchSavedDeals = async () => {
      if (!user) {
        setSavedDeals([])
        return
      }

      try {
        const response = await fetch(`/api/users/saved-deals`)
        if (response.ok) {
          const data = await response.json()
          setSavedDeals(data.map((item: any) => item.dealId || item.id))
        }
      } catch (error) {
        console.error("Error fetching saved deals:", error)
      }
    }

    fetchSavedDeals()
  }, [user])

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      try {
        const dealsResponse = await fetch("/api/deals")
        if (dealsResponse.ok) {
          const dealsData = await dealsResponse.json()
          setDeals(dealsData)
        }
      } catch (error) {
        console.error("Error fetching initial data:", error)
        toast({
          title: "Error",
          description: "Failed to load deals. Please try refreshing the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [toast])

  const fetchDeals = useCallback(
    async (category?: string, sort?: string): Promise<Deal[]> => {
      setIsLoading(true)
      try {
        let url = "/api/deals"
        const params = new URLSearchParams()

        if (category) params.append("category", category)
        if (sort) params.append("sort", sort)

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setDeals(data)
          return data
        }
        return []
      } catch (error) {
        console.error("Error fetching deals:", error)
        toast({
          title: "Error",
          description: "Failed to load deals. Please try refreshing the page.",
          variant: "destructive",
        })
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const fetchCoupons = useCallback(
    async (merchant?: string, sort?: string): Promise<Coupon[]> => {
      setIsLoading(true)
      try {
        let url = "/api/coupons"
        const params = new URLSearchParams()

        if (merchant) params.append("merchant", merchant)
        if (sort) params.append("sort", sort)

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          return data
        }
        return []
      } catch (error) {
        console.error("Error fetching coupons:", error)
        toast({
          title: "Error",
          description: "Failed to load coupons. Please try refreshing the page.",
          variant: "destructive",
        })
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const addDeal = async (
    dealData: Omit<Deal, "id" | "createdAt" | "score" | "commentCount" | "postedBy" | "userVote">,
  ): Promise<Deal> => {
    if (!currentUser) {
      throw new Error("You must be logged in to post a deal")
    }

    // Ensure the user is properly registered in our database
    if (!currentUser.id || !currentUser.email) {
      throw new Error("Your account is not properly registered. Please try logging out and back in.")
    }

    try {
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dealData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Deal creation failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          dealData,
          currentUser
        })
        throw new Error(errorData.error || `Failed to create deal: ${response.status} ${response.statusText}`)
      }

      const newDeal = await response.json()
      setDeals((prevDeals) => [newDeal, ...prevDeals])
      return newDeal
    } catch (error: any) {
      console.error("Error creating deal:", {
        error,
        dealData,
        currentUser
      })
      throw new Error(error.message || "Failed to create deal")
    }
  }

  const addComment = async (dealId: string, content: string, parentId?: string): Promise<Comment> => {
    if (!currentUser) throw new Error("You must be logged in to comment")

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dealId,
        content,
        parentId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to post comment")
    }

    const newComment = await response.json()

    // Refresh comments instead of manually updating the state
    // This ensures we get the proper nested structure
    try {
      const commentsResponse = await fetch(`/api/deals/${dealId}/comments`)
      if (commentsResponse.ok) {
        const updatedComments = await commentsResponse.json()
        setComments((prev) => ({
          ...prev,
          [dealId]: updatedComments,
        }))
      }
    } catch (error) {
      console.error("Error refreshing comments:", error)
    }

    // Update comment count on the deal
    setDeals((prevDeals) =>
      prevDeals.map((deal) => (deal.id === dealId ? { ...deal, commentCount: deal.commentCount + 1 } : deal)),
    )

    return newComment
  }

  const voteDeal = async (dealId: string, voteType: "up" | "down"): Promise<void> => {
    if (!currentUser) throw new Error("You must be logged in to vote")

    const response = await fetch("/api/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dealId,
        voteType,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to vote")
    }

    const result = await response.json()

    // Update the deal in state
    setDeals((prevDeals) =>
      prevDeals.map((deal) => {
        if (deal.id !== dealId) return deal

        // Calculate new score based on the action
        let newScore = deal.score
        let newUserVote = deal.userVote

        if (result.action === "removed") {
          newScore = voteType === "up" ? deal.score - 1 : deal.score + 1
          newUserVote = undefined
        } else if (result.action === "updated") {
          newScore = voteType === "up" ? deal.score + 2 : deal.score - 2
          newUserVote = voteType
        } else if (result.action === "created") {
          newScore = voteType === "up" ? deal.score + 1 : deal.score - 1
          newUserVote = voteType
        }

        return { ...deal, score: newScore, userVote: newUserVote }
      }),
    )
  }

  const voteComment = async (dealId: string, commentId: string, voteType: "up" | "down"): Promise<void> => {
    if (!currentUser) throw new Error("You must be logged in to vote")

    const response = await fetch("/api/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentId,
        voteType,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to vote")
    }

    // Instead of manually updating the comment state, refresh the comments
    try {
      const commentsResponse = await fetch(`/api/deals/${dealId}/comments`)
      if (commentsResponse.ok) {
        const updatedComments = await commentsResponse.json()
        setComments((prev) => ({
          ...prev,
          [dealId]: updatedComments,
        }))
      }
    } catch (error) {
      console.error("Error refreshing comments after vote:", error)
    }
  }

  const getDeal = async (id: string): Promise<Deal | undefined> => {
    try {
      const response = await fetch(`/api/deals/${id}`)
      if (response.ok) {
        return await response.json()
      }
      return undefined
    } catch (error) {
      console.error("Error fetching deal:", error)
      toast({
        title: "Error",
        description: "Failed to load deal details. Please try refreshing the page.",
        variant: "destructive",
      })
      return undefined
    }
  }

  const getRelatedDeals = async (dealId: string, limit = 3): Promise<Deal[]> => {
    try {
      const response = await fetch(`/api/deals/${dealId}/related?limit=${limit}`)
      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (error) {
      console.error("Error fetching related deals:", error)
      return []
    }
  }

  const saveDeal = async (dealId: string): Promise<void> => {
    if (!currentUser) throw new Error("You must be logged in to save deals")

    const response = await fetch("/api/users/saved-deals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dealId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to save deal")
    }

    setSavedDeals((prev) => [...prev, dealId])
  }

  const unsaveDeal = async (dealId: string): Promise<void> => {
    if (!currentUser) throw new Error("You must be logged in to unsave deals")

    const response = await fetch(`/api/users/saved-deals/${dealId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to unsave deal")
    }

    setSavedDeals((prev) => prev.filter((id) => id !== dealId))
  }

  const isSaved = (dealId: string): boolean => {
    return savedDeals.includes(dealId)
  }

  return (
    <DataContext.Provider
      value={{
        deals,
        comments,
        savedDeals,
        currentUser,
        setCurrentUser,
        addDeal,
        addComment,
        voteDeal,
        voteComment,
        getDeal,
        getRelatedDeals,
        saveDeal,
        unsaveDeal,
        isSaved,
        fetchDeals,
        fetchCoupons,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
