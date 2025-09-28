export interface User {
  id: string
  email: string
  username: string
  avatarUrl?: string
  createdAt: string
  dealsPosted?: number
  votesGiven?: number
  commentsPosted?: number
}

export interface Deal {
  id: string
  slug?: string
  title: string
  description: string
  price: number
  originalPrice?: number
  merchant: string
  category: string
  dealUrl: string
  expired: boolean
  startAt?: string | null;
  expiresAt?: string | null;
  createdAt: string
  score: number
  commentCount: number
  postedBy: {
    id: string
    name: string
    avatar?: string
  }
  userVote?: "up" | "down"
  imageUrls?: { url: string; slug?: string }[];
}

export interface Comment {
  id: string
  content: string
  createdAt: string
  postedBy: {
    id: string
    name: string
    avatar?: string
  }
  score: number
  userVote?: "up" | "down"
  replies?: Comment[]
}

export interface Coupon {
  id: string
  slug?: string
  title: string
  description: string
  merchant: string
  discountCode: string
  discountType: string
  discountValue?: number
  availability: string
  couponUrl: string
  expired: boolean
  expiresAt?: string
  startAt?: string
  category: string
  createdAt: string
  score: number
  commentCount: number
  postedBy: {
    id: string
    name: string
    avatar?: string
  }
  userVote?: "up" | "down"
  imageUrls?: { url: string; slug?: string }[];
}

export interface Discussion {
  id: string
  title: string
  description: string
  category: string
  dealCategory?: string
  createdAt: string
  score: number
  commentCount: number
  postedBy: {
    id: string
    name: string
    avatar?: string
  }
  userVote?: "up" | "down"
}
