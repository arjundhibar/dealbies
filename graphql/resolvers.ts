// graphql/resolvers.ts
import { prisma } from '@/lib/prisma'
import { getSupabase } from '@/lib/supabase'

export const resolvers = {
    Query: {
        deals: async (_: any, { category, sort = 'newest' }: any) => {
            let orderBy: any = { createdAt: 'desc' }

            if (sort === 'comments') {
                orderBy = [{ comments: { _count: 'desc' } }, { createdAt: 'desc' }]
            }

            const deals = await prisma.deal.findMany({
                where: category ? { category } : undefined,
                orderBy,
                include: {
                    user: { select: { id: true, username: true, avatarUrl: true } },
                    _count: { select: { comments: true } },
                    votes: true,
                    images: true,
                },
            })

            const supabase = getSupabase()
            const {
                data: { session },
            } = await supabase.auth.getSession()

            let currentUserId: string | null = null
            if (session?.user?.email) {
                const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } })
                currentUserId = dbUser?.id || null
            }

            return deals.map((deal : any) => {
                const upVotes = deal.votes.filter((v : any) => v.voteType === 'up').length
                const downVotes = deal.votes.filter((v : any) => v.voteType === 'down').length
                const userVote = deal.votes.find((v : any) => v.userId === currentUserId)?.voteType

                return {
                    id: deal.id,
                    title: deal.title,
                    description: deal.description,
                    imageUrls: deal.images.map((img : any) => img.url),
                    price: deal.price,
                    originalPrice: deal.originalPrice,
                    merchant: deal.merchant,
                    category: deal.category,
                    dealUrl: deal.dealUrl,
                    expired: deal.expired,
                    expiresAt: deal.expiresAt?.toISOString() ?? null,
                    createdAt: deal.createdAt.toISOString(),
                    score: upVotes - downVotes,
                    commentCount: deal._count.comments,
                    postedBy: deal.user,
                    userVote,
                }
            })
        },
    },
}
