// graphql/schema.ts
import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type User {
    id: String!
    username: String!
    avatarUrl: String!
  }

  type Deal {
    id: String!
    title: String!
    description: String!
    imageUrls: [String!]!
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

  type Query {
    deals(category: String, sort: String): [Deal!]!
    deal(id: ID!): Deal
  }
`
