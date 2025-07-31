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
  imageUrls?: { url: string }[];
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
  code: string
  title: string
  description: string
  merchant: string
  logoUrl?: string
  expiresAt: string
  terms?: string
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
