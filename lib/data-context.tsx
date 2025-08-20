"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Deal, Comment, User, Coupon } from "./types";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { getSupabase } from "@/lib/supabase";

interface DataContextType {
  deals: Deal[];
  comments: Record<string, Comment[]>;
  savedDeals: string[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  addDeal: (
    deal: Omit<
      Deal,
      "id" | "createdAt" | "score" | "commentCount" | "postedBy" | "userVote"
    >
  ) => Promise<Deal>;
  addComment: (
    contentId: string,
    content: string,
    parentId?: string,
    isCoupon?: boolean
  ) => Promise<Comment>;
  voteDeal: (dealId: string, voteType: "up" | "down") => Promise<void>;
  voteCoupon: (couponId: string, voteType: "up" | "down") => Promise<void>;
  updateDealVote: (
    dealId: string,
    newScore: number,
    newUserVote: "up" | "down" | undefined
  ) => void;
  updateCouponVote: (
    couponId: string,
    newScore: number,
    newUserVote: "up" | "down" | undefined
  ) => void;
  voteComment: (
    dealId: string,
    commentId: string,
    voteType: "up" | "down"
  ) => Promise<void>;
  getDeal: (id: string) => Promise<Deal | undefined>;
  getCoupon: (id: string) => Promise<Coupon | undefined>;
  getRelatedDeals: (dealId: string, limit?: number) => Promise<Deal[]>;
  saveDeal: (dealId: string) => Promise<void>;
  unsaveDeal: (dealId: string) => Promise<void>;
  isSaved: (dealId: string) => boolean;
  fetchDeals: (category?: string, sort?: string) => Promise<Deal[]>;
  fetchCoupons: (
    merchant?: string,
    category?: string,
    sort?: string
  ) => Promise<Coupon[]>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  // Initialize with empty arrays instead of mock data
  const [deals, setDeals] = useState<Deal[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [savedDeals, setSavedDeals] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile when auth user changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("fetchUserProfile called, user:", user);
      if (!user) {
        console.log("No user found, setting currentUser to null");
        setCurrentUser(null);
        return;
      }

      try {
        console.log("Fetching user profile from API...");
        const response = await fetch(`/api/users/profile`);
        console.log("User profile response status:", response.status);

        if (response.ok) {
          const userData = await response.json();
          console.log("User profile data:", userData);
          setCurrentUser(userData);
        } else {
          console.log("User profile not found, creating new user...");
          // If user doesn't exist in our database yet, create them
          const createResponse = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username:
                user.user_metadata?.username || user.email?.split("@")[0],
            }),
          });

          console.log("Create user response status:", createResponse.status);

          if (createResponse.ok) {
            const newUser = await createResponse.json();
            console.log("New user created:", newUser);
            setCurrentUser(newUser);
          } else {
            console.log("Failed to create user, setting temporary user object");
            // If we can't create the user, set a temporary user object
            setCurrentUser({
              id: user.id,
              email: user.email || "",
              username:
                user.user_metadata?.username ||
                user.email?.split("@")[0] ||
                "User",
              avatarUrl: user.user_metadata?.avatar_url,
              createdAt: new Date().toISOString(),
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Set a temporary user object if there's an error
        setCurrentUser({
          id: user.id,
          email: user.email || "",
          username:
            user.user_metadata?.username || user.email?.split("@")[0] || "User",
          avatarUrl: user.user_metadata?.avatar_url,
          createdAt: new Date().toISOString(),
        });
      }
    };

    fetchUserProfile();
  }, [user]);

  // Fetch user's saved deals when user changes
  useEffect(() => {
    const fetchSavedDeals = async () => {
      console.log("fetchSavedDeals called, user:", user);
      if (!user) {
        console.log("No user found, setting savedDeals to empty array");
        setSavedDeals([]);
        return;
      }

      try {
        console.log("Fetching saved deals from API...");
        const response = await fetch(`/api/users/saved-deals`);
        console.log("Saved deals response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Saved deals API response:", data);
          // The API returns full deal objects, so we need to extract the deal IDs
          const dealIds = data.map((deal: any) => deal.id);
          console.log("Extracted deal IDs:", dealIds);
          setSavedDeals(dealIds);
        } else {
          console.error(
            "Failed to fetch saved deals, status:",
            response.status
          );
          const errorText = await response.text();
          console.error("Error response:", errorText);
        }
      } catch (error) {
        console.error("Error fetching saved deals:", error);
      }
    };

    fetchSavedDeals();
  }, [user]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const dealsResponse = await fetch("/api/deals");
        if (dealsResponse.ok) {
          const dealsData = await dealsResponse.json();
          setDeals(dealsData);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast({
          title: "Error",
          description: "Failed to load deals. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [toast]);

  const fetchDeals = useCallback(
    async (category?: string, sort?: string): Promise<Deal[]> => {
      setIsLoading(true);
      try {
        console.log(
          "DataContext - fetchDeals called with category:",
          category,
          "sort:",
          sort
        );

        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            query GetDeals($category: String, $sort: String) {
              deals(category: $category, sort: $sort) {
                id
                title
                description
                imageUrls
                price
                originalPrice
                merchant
                category
                dealUrl
                expired
                expiresAt
                startAt
                createdAt
                score
                commentCount
                postedBy {
                  id
                  username
                }
                userVote
              }
            } 
          `,
            variables: { category, sort },
          }),
        });

        const { data } = await response.json();
        console.log("DataContext - GraphQL response for deals:", data);

        const result = (data?.deals || []).map((deal: any) => ({
          ...deal,
          imageUrl: deal.imageUrls?.[0] || "",
          postedBy: {
            id: deal.postedBy.id,
            name: deal.postedBy.username,
            avatar: "",
          },
        }));
        console.log("DataContext - Processed deals result:", result);
        setDeals(result);
        return result;
      } catch (error) {
        console.error("Error fetching deals:", error);
        toast({
          title: "Error",
          description: "Failed to load deals. Please try refreshing the page.",
          variant: "destructive",
        });
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const fetchCoupons = useCallback(
    async (
      merchant?: string,
      category?: string,
      sort?: string
    ): Promise<Coupon[]> => {
      setIsLoading(true);
      try {
        console.log(
          "DataContext - fetchCoupons called with merchant:",
          merchant,
          "category:",
          category,
          "sort:",
          sort
        );

        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            query GetCoupons($merchant: String, $category: String, $sort: String) {
              coupons(merchant: $merchant, category: $category, sort: $sort) {
                id
                title
                description
                imageUrls
                discountCode
                discountType
                merchant
                discountValue
                availability
                couponUrl
                expired
                expiresAt
                startAt
                category
                createdAt
                score
                commentCount
                postedBy {
                  id
                  username
                }
                userVote
              }
            } 
          `,
            variables: { merchant, category, sort },
          }),
        });

        const { data } = await response.json();
        console.log("DataContext - GraphQL response for coupons:", data);

        const result = (data?.coupons || []).map((coupon: any) => ({
          ...coupon,
          imageUrl: coupon.imageUrls?.[0] || "",
          postedBy: {
            id: coupon.postedBy.id,
            name: coupon.postedBy.username,
            avatar: "",
          },
        }));
        console.log("DataContext - Processed coupons result:", result);
        return result;
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast({
          title: "Error",
          description:
            "Failed to load coupons. Please try refreshing the page.",
          variant: "destructive",
        });
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const addDeal = async (
    dealData: Omit<
      Deal,
      "id" | "createdAt" | "score" | "commentCount" | "postedBy" | "userVote"
    >
  ): Promise<Deal> => {
    if (!currentUser) {
      throw new Error("You must be logged in to post a deal");
    }

    // Ensure the user is properly registered in our database
    if (!currentUser.id || !currentUser.email) {
      throw new Error(
        "Your account is not properly registered. Please try logging out and back in."
      );
    }
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("Missing authentication token. Please log in again.");
    }
    try {
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dealData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Deal creation failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          dealData,
          currentUser,
        });
        throw new Error(
          errorData.error ||
            `Failed to create deal: ${response.status} ${response.statusText}`
        );
      }

      const newDeal = await response.json();
      setDeals((prevDeals) => [newDeal, ...prevDeals]);
      return newDeal;
    } catch (error: any) {
      console.error("Error creating deal:", {
        error,
        dealData,
        currentUser,
      });
      throw new Error(error.message || "Failed to create deal");
    }
  };

  const addComment = async (
    contentId: string,
    content: string,
    parentId?: string,
    isCoupon: boolean = false
  ): Promise<Comment> => {
    console.log("currentUser in addComment:", currentUser);
    if (!currentUser) throw new Error("You must be logged in to comment");

    // Get the current session from Supabase (same approach as voteDeal)
    const supabase = getSupabase();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      throw new Error("Missing authentication token");
    }

    const requestBody = isCoupon
      ? { couponId: contentId, content, parentId }
      : { dealId: contentId, content, parentId };

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to post comment");
    }

    const newComment = await response.json();

    // Refresh comments instead of manually updating the state
    // This ensures we get the proper nested structure
    try {
      const endpoint = isCoupon
        ? `/api/coupons/${contentId}/comments`
        : `/api/deals/${contentId}/comments`;
      const commentsResponse = await fetch(endpoint);
      if (commentsResponse.ok) {
        const updatedComments = await commentsResponse.json();
        setComments((prev) => ({
          ...prev,
          [contentId]: updatedComments,
        }));
      }
    } catch (error) {
      console.error("Error refreshing comments:", error);
    }

    // Update comment count on the deal/coupon if it's in our global state
    if (!isCoupon) {
      setDeals((prevDeals) =>
        prevDeals.map((deal) =>
          deal.id === contentId
            ? { ...deal, commentCount: deal.commentCount + 1 }
            : deal
        )
      );
    }
    // Note: We don't have a global coupons state yet, so we can't update coupon comment counts

    return newComment;
  };

  const voteDeal = useCallback(
    async (dealId: string, voteType: "up" | "down"): Promise<void> => {
      if (!currentUser) throw new Error("You must be logged in to vote");

      // Get the current session from Supabase
      const supabase = getSupabase();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("Missing authentication token");
      }

      // Get current deal state for optimistic update
      const currentDeal = deals.find((d) => d.id === dealId);
      if (!currentDeal) throw new Error("Deal not found");

      // Simple optimistic update - just apply the vote change
      const currentScore = currentDeal.score;
      const currentUserVote = currentDeal.userVote;

      // If clicking the same vote type, remove it
      if (currentUserVote === voteType) {
        // Remove vote
        const optimisticScore =
          voteType === "up" ? currentScore - 1 : currentScore + 1;
        const optimisticUserVote = undefined;

        // Apply optimistic update
        setDeals((prevDeals) =>
          prevDeals.map((deal) => {
            if (deal.id !== dealId) return deal;
            return {
              ...deal,
              score: optimisticScore,
              userVote: optimisticUserVote,
            };
          })
        );
      } else {
        // Add or change vote
        const optimisticScore =
          voteType === "up" ? currentScore + 1 : currentScore - 1;
        const optimisticUserVote = voteType;

        // Apply optimistic update
        setDeals((prevDeals) =>
          prevDeals.map((deal) => {
            if (deal.id !== dealId) return deal;
            return {
              ...deal,
              score: optimisticScore,
              userVote: optimisticUserVote,
            };
          })
        );
      }

      console.log(
        "Attempting to vote for deal:",
        dealId,
        "Vote Type:",
        voteType
      );
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          dealId,
          voteType,
        }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setDeals((prevDeals) =>
          prevDeals.map((deal) => {
            if (deal.id !== dealId) return deal;
            return { ...deal, score: currentScore, userVote: currentUserVote };
          })
        );
        const error = await response.json();
        throw new Error(error.message || "Failed to vote");
      }

      const result = await response.json();

      // Update with actual server response
      setDeals((prevDeals) =>
        prevDeals.map((deal) => {
          if (deal.id !== dealId) return deal;

          // Calculate new score based on the action
          let newScore = deal.score;
          let newUserVote = deal.userVote;

          if (result.action === "removed") {
            newScore = voteType === "up" ? deal.score - 1 : deal.score + 1;
            newUserVote = undefined;
          } else if (result.action === "updated") {
            newScore = voteType === "up" ? deal.score + 2 : deal.score - 2;
            newUserVote = voteType;
          } else if (result.action === "created") {
            newScore = voteType === "up" ? deal.score + 1 : deal.score - 1;
            newUserVote = voteType;
          }

          return { ...deal, score: newScore, userVote: newUserVote };
        })
      );
    },
    [currentUser, deals]
  );

  // Helper function to update a single deal's vote state
  const updateDealVote = useCallback(
    (
      dealId: string,
      newScore: number,
      newUserVote: "up" | "down" | undefined
    ) => {
      setDeals((prevDeals) =>
        prevDeals.map((deal) => {
          if (deal.id !== dealId) return deal;
          return { ...deal, score: newScore, userVote: newUserVote };
        })
      );
    },
    []
  );

  const voteCoupon = useCallback(
    async (couponId: string, voteType: "up" | "down"): Promise<void> => {
      if (!currentUser) throw new Error("You must be logged in to vote");

      // Get the current session from Supabase
      const supabase = getSupabase();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("Missing authentication token");
      }

      console.log(
        "Attempting to vote for coupon:",
        couponId,
        "Vote Type:",
        voteType
      );
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          couponId,
          voteType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to vote");
      }

      const result = await response.json();
      console.log("Vote result:", result);
    },
    [currentUser]
  );

  // Helper function to update a single coupon's vote state
  const updateCouponVote = useCallback(
    (
      couponId: string,
      newScore: number,
      newUserVote: "up" | "down" | undefined
    ) => {
      // Since we don't have a global coupons state, this function will be used by the coupon page
      // to update its local state. The coupon page will handle the state update itself.
      console.log("updateCouponVote called:", {
        couponId,
        newScore,
        newUserVote,
      });
    },
    []
  );

  const voteComment = async (
    dealId: string,
    commentId: string,
    voteType: "up" | "down"
  ): Promise<void> => {
    if (!currentUser) throw new Error("You must be logged in to vote");

    const response = await fetch("/api/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentId,
        voteType,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to vote");
    }

    // Instead of manually updating the comment state, refresh the comments
    try {
      const commentsResponse = await fetch(`/api/deals/${dealId}/comments`);
      if (commentsResponse.ok) {
        const updatedComments = await commentsResponse.json();
        setComments((prev) => ({
          ...prev,
          [dealId]: updatedComments,
        }));
      }
    } catch (error) {
      console.error("Error refreshing comments after vote:", error);
    }
  };

  const getDeal = useCallback(
    async (id: string): Promise<Deal | undefined> => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            query GetDeal($id: ID!) {
              deal(id: $id) {
                id
                title
                description
                price
                originalPrice
                merchant
                category
                dealUrl
                expired
                expiresAt
                startAt
                createdAt
                score
                commentCount
                postedBy {
                  id
                  username
                }
                userVote
                imageUrls
              }
            }
          `,
            variables: { id },
          }),
        });
        const { data } = await response.json();
        const deal = data?.deal;
        if (!deal) return undefined;
        return {
          ...deal,
          imageUrl: deal.imageUrls?.[0] || "",
          postedBy: {
            id: deal.postedBy.id,
            name: deal.postedBy.username,
            avatar: "",
          },
        };
      } catch (error) {
        console.error("Error fetching deal:", error);
        toast({
          title: "Error",
          description: "Failed to load deal. Please try refreshing the page.",
          variant: "destructive",
        });
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const getCoupon = useCallback(
    async (id: string): Promise<Coupon | undefined> => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            query GetCoupon($id: ID!) {
              coupon(id: $id) {
                id
                title
                description
                imageUrls
                discountCode
                discountType
                discountValue
                availability
                merchant
                couponUrl
                expired
                expiresAt
                startAt
                category
                createdAt
                score
                commentCount
                postedBy {
                  id
                  username
                }
                userVote
              }
            }
          `,
            variables: { id },
          }),
        });
        const { data } = await response.json();
        const coupon = data?.coupon;
        if (!coupon) return undefined;
        return {
          ...coupon,
          imageUrl: coupon.imageUrls?.[0] || "",
          postedBy: {
            id: coupon.postedBy.id,
            name: coupon.postedBy.username,
            avatar: "",
          },
        };
      } catch (error) {
        console.error("Error fetching coupon:", error);
        toast({
          title: "Error",
          description: "Failed to load coupon. Please try refreshing the page.",
          variant: "destructive",
        });
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const getRelatedDeals = useCallback(
    async (dealId: string, limit = 3): Promise<Deal[]> => {
      try {
        const response = await fetch(
          `/api/deals/${dealId}/related?limit=${limit}`
        );
        if (response.ok) {
          return await response.json();
        }
        return [];
      } catch (error) {
        console.error("Error fetching related deals:", error);
        return [];
      }
    },
    []
  );

  const saveDeal = async (dealId: string): Promise<void> => {
    console.log("saveDeal called with dealId:", dealId);
    console.log("currentUser:", currentUser);

    if (!currentUser) throw new Error("You must be logged in to save deals");

    console.log("Making API call to save deal...");
    const response = await fetch("/api/users/saved-deals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dealId,
      }),
    });

    console.log("Save deal response status:", response.status);
    console.log(
      "Save deal response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Save deal error response text:", errorText);

      let error;
      try {
        error = JSON.parse(errorText);
      } catch (e) {
        error = { message: errorText };
      }

      console.error("Save deal parsed error:", error);
      throw new Error(error.message || "Failed to save deal");
    }

    const responseData = await response.json();
    console.log("Save deal success response:", responseData);

    console.log("Deal saved successfully, updating state");
    setSavedDeals((prev) => {
      const newState = [...prev, dealId];
      console.log("New saved deals state:", newState);
      return newState;
    });
  };

  const unsaveDeal = async (dealId: string): Promise<void> => {
    console.log("unsaveDeal called with dealId:", dealId);
    console.log("currentUser:", currentUser);

    if (!currentUser) throw new Error("You must be logged in to unsave deals");

    console.log("Making API call to unsave deal...");
    const response = await fetch(`/api/users/saved-deals/${dealId}`, {
      method: "DELETE",
    });

    console.log("Unsave deal response status:", response.status);
    console.log(
      "Unsave deal response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Unsave deal error response text:", errorText);

      let error;
      try {
        error = JSON.parse(errorText);
      } catch (e) {
        error = { message: errorText };
      }

      console.error("Unsave deal parsed error:", error);
      throw new Error(error.message || "Failed to unsave deal");
    }

    const responseData = await response.json();
    console.log("Unsave deal success response:", responseData);

    console.log("Deal unsaved successfully, updating state");
    setSavedDeals((prev) => {
      const newState = prev.filter((id) => id !== dealId);
      console.log("New saved deals state:", newState);
      return newState;
    });
  };

  const isSaved = (dealId: string): boolean => {
    const saved = savedDeals.includes(dealId);
    console.log(`isSaved check for dealId ${dealId}:`, saved);
    console.log("Current savedDeals array:", savedDeals);
    return saved;
  };

  return (
    <DataContext.Provider
      value={React.useMemo(
        () => ({
          deals,
          comments,
          savedDeals,
          currentUser,
          setCurrentUser,
          addDeal,
          addComment,
          voteDeal,
          voteCoupon,
          updateDealVote,
          updateCouponVote,
          voteComment,
          getDeal,
          getCoupon,
          getRelatedDeals,
          saveDeal,
          unsaveDeal,
          isSaved,
          fetchDeals,
          fetchCoupons,
          isLoading,
        }),
        [
          deals,
          comments,
          savedDeals,
          currentUser,
          addDeal,
          addComment,
          voteDeal,
          voteCoupon,
          updateDealVote,
          updateCouponVote,
          voteComment,
          getDeal,
          getCoupon,
          getRelatedDeals,
          saveDeal,
          unsaveDeal,
          isSaved,
          fetchDeals,
          fetchCoupons,
          isLoading,
        ]
      )}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
