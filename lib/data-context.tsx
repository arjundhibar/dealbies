"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Deal, Comment, User, Coupon, Discussion } from "./types";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { getSupabase } from "@/lib/supabase";

interface DataContextType {
  deals: Deal[];
  coupons: Coupon[];
  discussions: Discussion[];
  comments: Record<string, Comment[]>;
  savedDeals: string[];
  savedCoupons: string[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentSort: string;
  setCurrentSort: (sort: string) => void;
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
  getDealBySlug: (slug: string) => Promise<Deal | undefined>;
  getCoupon: (id: string) => Promise<Coupon | undefined>;
  getCouponBySlug: (slug: string) => Promise<Coupon | undefined>;
  getDiscussion: (id: string) => Promise<Discussion | undefined>;
  getRelatedDeals: (dealId: string, limit?: number) => Promise<Deal[]>;
  saveDeal: (dealId: string) => Promise<void>;
  unsaveDeal: (dealId: string) => Promise<void>;
  saveCoupon: (couponId: string) => Promise<void>;
  unsaveCoupon: (couponId: string) => Promise<void>;
  isSaved: (dealId: string) => boolean;
  isCouponSaved: (couponId: string) => boolean;
  fetchDeals: (category?: string, sort?: string) => Promise<Deal[]>;
  fetchCoupons: (
    merchant?: string,
    category?: string,
    sort?: string
  ) => Promise<Coupon[]>;
  fetchDiscussions: (
    category?: string,
    dealCategory?: string,
    sort?: string
  ) => Promise<Discussion[]>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  // Initialize with empty arrays instead of mock data
  const [deals, setDeals] = useState<Deal[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [savedDeals, setSavedDeals] = useState<string[]>([]);
  const [savedCoupons, setSavedCoupons] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSort, setCurrentSort] = useState<string>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile when auth user changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setCurrentUser(null);
        return;
      }

      try {
        const response = await fetch(`/api/users/profile`);

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        } else {
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

          if (createResponse.ok) {
            const newUser = await createResponse.json();
            setCurrentUser(newUser);
          } else {
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
      if (!user) {
        setSavedDeals([]);
        return;
      }

      try {
        const response = await fetch(`/api/users/saved-deals`);

        if (response.ok) {
          const data = await response.json();

          // The API returns full deal objects, so we need to extract the deal IDs
          const dealIds = data.map((deal: any) => deal.id);

          setSavedDeals(dealIds);
        } else {
          const errorText = await response.text();
        }
      } catch (error) {}
    };

    fetchSavedDeals();
  }, [user]);

  // Fetch user's saved coupons when user changes
  useEffect(() => {
    const fetchSavedCoupons = async () => {
      if (!user) {
        setSavedCoupons([]);
        return;
      }

      try {
        const response = await fetch(`/api/users/saved-coupons`);

        if (response.ok) {
          const data = await response.json();

          // The API returns full coupon objects, so we need to extract the coupon IDs
          const couponIds = data.map((coupon: any) => coupon.id);

          setSavedCoupons(couponIds);
        } else {
          const errorText = await response.text();
        }
      } catch (error) {}
    };

    fetchSavedCoupons();
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
                slug
                title
                description
                imageUrls {
                  url
                  slug
                }
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

        const result = (data?.deals || []).map((deal: any) => ({
          ...deal,
          imageUrl: deal.imageUrls?.[0]?.url || "",
          postedBy: {
            id: deal.postedBy.id,
            name: deal.postedBy.username,
            avatar: "",
          },
        }));
        setDeals(result);
        return result;
      } catch (error) {
        // Use toast but don't make it a dependency to prevent infinite loops
        if (toast) {
          toast({
            title: "Error",
            description:
              "Failed to load deals. Please try refreshing the page.",
            variant: "destructive",
          });
        }
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [] // Empty dependency array to prevent recreation
  );

  const fetchCoupons = useCallback(
    async (
      merchant?: string,
      category?: string,
      sort?: string
    ): Promise<Coupon[]> => {
      setIsLoading(true);
      try {
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
                slug
                title
                description
                imageUrls {
                  url
                  slug
                }
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

        const result = (data?.coupons || []).map((coupon: any) => ({
          ...coupon,
          imageUrl: coupon.imageUrls?.[0]?.url || "",
          postedBy: {
            id: coupon.postedBy.id,
            name: coupon.postedBy.username,
            avatar: "",
          },
        }));
        return result;
      } catch (error) {
        // Use toast but don't make it a dependency to prevent infinite loops
        if (toast) {
          toast({
            title: "Error",
            description:
              "Failed to load coupons. Please try refreshing the page.",
            variant: "destructive",
          });
        }
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [] // Empty dependency array to prevent recreation
  );

  const fetchDiscussions = useCallback(
    async (
      category?: string,
      dealCategory?: string,
      sort?: string
    ): Promise<Discussion[]> => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            query GetDiscussions($category: String, $dealCategory: String, $sort: String) {
              discussions(category: $category, dealCategory: $dealCategory, sort: $sort) {
                id
                title
                description
                category
                dealCategory
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
            variables: { category, dealCategory, sort },
          }),
        });

        const { data } = await response.json();

        const result = (data?.discussions || []).map((discussion: any) => ({
          ...discussion,
          postedBy: {
            id: discussion.postedBy.id,
            name: discussion.postedBy.username,
            avatar: "",
          },
        }));
        setDiscussions(result);
        return result;
      } catch (error) {
        // Use toast but don't make it a dependency to prevent infinite loops
        if (toast) {
          toast({
            title: "Error",
            description:
              "Failed to load discussions. Please try refreshing the page.",
            variant: "destructive",
          });
        }
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [] // Empty dependency array to prevent recreation
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
        throw new Error(
          errorData.error ||
            `Failed to create deal: ${response.status} ${response.statusText}`
        );
      }

      const newDeal = await response.json();
      setDeals((prevDeals) => [newDeal, ...prevDeals]);
      return newDeal;
    } catch (error: any) {
      throw new Error(error.message || "Failed to create deal");
    }
  };

  const addComment = async (
    contentId: string,
    content: string,
    parentId?: string,
    isCoupon: boolean = false
  ): Promise<Comment> => {
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
    } catch (error) {}

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
    } catch (error) {}
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
                slug
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
                imageUrls {
                  url
                  slug
                }
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

  const getDealBySlug = useCallback(
    async (slug: string): Promise<Deal | undefined> => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            query GetDealBySlug($slug: String!) {
              dealBySlug(slug: $slug) {
                id
                slug
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
                imageUrls {
                  url
                  slug
                }
              }
            }
          `,
            variables: { slug },
          }),
        });
        const { data } = await response.json();
        const deal = data?.dealBySlug;
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
                slug
                title
                description
                imageUrls {
                  url
                  slug
                }
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
          imageUrl: coupon.imageUrls?.[0]?.url || "",
          postedBy: {
            id: coupon.postedBy.id,
            name: coupon.postedBy.username,
            avatar: "",
          },
        };
      } catch (error) {
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

  const getCouponBySlug = useCallback(
    async (slug: string): Promise<Coupon | undefined> => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            query GetCouponBySlug($slug: String!) {
              couponBySlug(slug: $slug) {
                id
                slug
                title
                description
                imageUrls {
                  url
                  slug
                }
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
            variables: { slug },
          }),
        });
        const { data } = await response.json();
        const coupon = data?.couponBySlug;
        if (!coupon) return undefined;
        return {
          ...coupon,
          imageUrl: coupon.imageUrls?.[0]?.url || "",
          postedBy: {
            id: coupon.postedBy.id,
            name: coupon.postedBy.username,
            avatar: "",
          },
        };
      } catch (error) {
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

  const getDiscussion = useCallback(
    async (id: string): Promise<Discussion | undefined> => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            query GetDiscussion($id: ID!) {
              discussion(id: $id) {
                id
                title
                description
                category
                dealCategory
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
        const discussion = data?.discussion;
        if (!discussion) return undefined;
        return {
          ...discussion,
          postedBy: {
            id: discussion.postedBy.id,
            name: discussion.postedBy.username,
            avatar: "",
          },
        };
      } catch (error) {
        toast({
          title: "Error",
          description:
            "Failed to load discussion. Please try refreshing the page.",
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

  const saveCoupon = async (couponId: string): Promise<void> => {
    console.log("saveCoupon called with couponId:", couponId);
    console.log("currentUser:", currentUser);

    if (!currentUser) throw new Error("You must be logged in to save coupons");

    console.log("Making API call to save coupon...");
    const response = await fetch("/api/users/saved-coupons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        couponId,
      }),
    });

    console.log("Save coupon response status:", response.status);
    console.log(
      "Save coupon response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Save coupon error response text:", errorText);

      let error;
      try {
        error = JSON.parse(errorText);
      } catch (e) {
        error = { message: errorText };
      }

      console.error("Save coupon parsed error:", error);
      throw new Error(error.message || "Failed to save coupon");
    }

    const responseData = await response.json();
    console.log("Save coupon success response:", responseData);

    console.log("Coupon saved successfully, updating state");
    setSavedCoupons((prev) => {
      const newState = [...prev, couponId];
      console.log("New saved coupons state:", newState);
      return newState;
    });
  };

  const unsaveCoupon = async (couponId: string): Promise<void> => {
    console.log("unsaveCoupon called with couponId:", couponId);
    console.log("currentUser:", currentUser);

    if (!currentUser)
      throw new Error("You must be logged in to unsave coupons");

    console.log("Making API call to unsave coupon...");
    const response = await fetch(`/api/users/saved-coupons/${couponId}`, {
      method: "DELETE",
    });

    console.log("Unsave coupon response status:", response.status);
    console.log(
      "Unsave coupon response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Unsave coupon error response text:", errorText);

      let error;
      try {
        error = JSON.parse(errorText);
      } catch (e) {
        error = { message: errorText };
      }

      console.error("Unsave coupon parsed error:", error);
      throw new Error(error.message || "Failed to unsave coupon");
    }

    const responseData = await response.json();
    console.log("Unsave coupon success response:", responseData);

    console.log("Coupon unsaved successfully, updating state");
    setSavedCoupons((prev) => {
      const newState = prev.filter((id) => id !== couponId);
      console.log("New saved coupons state:", newState);
      return newState;
    });
  };

  const isCouponSaved = (couponId: string): boolean => {
    const saved = savedCoupons.includes(couponId);
    console.log(`isCouponSaved check for couponId ${couponId}:`, saved);
    console.log("Current savedCoupons array:", savedCoupons);
    return saved;
  };

  return (
    <DataContext.Provider
      value={React.useMemo(
        () => ({
          deals,
          coupons,
          discussions,
          comments,
          savedDeals,
          savedCoupons,
          currentUser,
          setCurrentUser,
          currentSort,
          setCurrentSort,
          addDeal,
          addComment,
          voteDeal,
          voteCoupon,

          updateDealVote,
          updateCouponVote,

          voteComment,
          getDeal,
          getDealBySlug,
          getCoupon,
          getCouponBySlug,
          getDiscussion,
          getRelatedDeals,
          saveDeal,
          unsaveDeal,
          saveCoupon,
          unsaveCoupon,
          isSaved,
          isCouponSaved,
          fetchDeals,
          fetchCoupons,
          fetchDiscussions,
          isLoading,
        }),
        [
          deals,
          coupons,
          discussions,
          comments,
          savedDeals,
          savedCoupons,
          currentUser,
          currentSort,
          setCurrentSort,
          addDeal,
          addComment,
          voteDeal,
          voteCoupon,

          updateDealVote,
          updateCouponVote,

          voteComment,
          getDeal,
          getDealBySlug,
          getCoupon,
          getCouponBySlug,
          getDiscussion,
          getRelatedDeals,
          saveDeal,
          unsaveDeal,
          saveCoupon,
          unsaveCoupon,
          isSaved,
          isCouponSaved,
          fetchDeals,
          fetchCoupons,
          fetchDiscussions,
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
