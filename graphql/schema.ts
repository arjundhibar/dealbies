// graphql/schema.ts
import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type User {
    id: String!
    username: String!
    avatarUrl: String!
  }

  type ImageUrl {
    url: String!
    slug: String!
  }

  type Deal {
    id: String!
    slug: String!
    title: String!
    description: String!
    imageUrls: [ImageUrl!]!
    price: Float!
    originalPrice: Float
    merchant: String!
    category: String!
    dealUrl: String!
    expired: Boolean!
    expiresAt: String
    startAt: String
    createdAt: String!
    score: Int!
    commentCount: Int!
    postedBy: User!
    userVote: String
  }

  type Coupon {
    id: String!
    slug: String!
    title: String!
    description: String!
    imageUrls: [ImageUrl!]!
    discountCode: String!
    discountType: String!
    discountValue: Float
    merchant: String!
    availability: String!
    couponUrl: String!
    expired: Boolean!
    expiresAt: String
    startAt: String
    category: String!
    createdAt: String!
    score: Int!
    commentCount: Int!
    postedBy: User!
    userVote: String
  }

  type Discussion {
    id: String!
    title: String!
    description: String!
    category: String!
    dealCategory: String
    createdAt: String!
    score: Int!
    commentCount: Int!
    postedBy: User!
    userVote: String
  }

  type Query {
    deals(category: String, sort: String): [Deal!]!
    deal(id: ID!): Deal
    dealBySlug(slug: String!): Deal
    coupons(merchant: String, category: String, sort: String): [Coupon!]!
    coupon(id: ID!): Coupon
    couponBySlug(slug: String!): Coupon
    discussions(category: String, dealCategory: String, sort: String): [Discussion!]!
    discussion(id: ID!): Discussion
  }
`