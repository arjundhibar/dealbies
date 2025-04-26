export interface User {
  id: string
  email: string
  username: string
  avatarUrl?: string
  createdAt: string
}

export interface Deal {
  id: string
  title: string
  description: string
  imageUrl?: string
  price: number
  originalPrice?: number
  merchant: string
  category: string
  dealUrl: string
  expired: boolean
  expiresAt?: string
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
