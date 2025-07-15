// app/api/graphql/route.ts
import { createYoga, createSchema } from 'graphql-yoga'
import { typeDefs } from '@/graphql/schema'
import { resolvers } from '@/graphql/resolvers'

// This is a server-only file (App Router)
const yoga = createYoga({
    schema: createSchema({
        typeDefs,
        resolvers,
    }),
    graphqlEndpoint: '/api/graphql',
    fetchAPI: { Request, Response }, // Required for Next.js App Router
})

export { yoga as GET, yoga as POST }
