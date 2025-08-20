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
                where: category ? { 
                    category: { 
                        equals: category, 
                        mode: 'insensitive' 
                    } 
                } : undefined,
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

            return deals.map((deal: any) => {
                const upVotes = deal.votes.filter((v: any) => v.voteType === 'up').length
                const downVotes = deal.votes.filter((v: any) => v.voteType === 'down').length
                const userVote = deal.votes.find((v: any) => v.userId === currentUserId)?.voteType

                // Find the cover image (isCover) or fallback to first image
                let coverImage = null;
                if (deal.images && deal.images.length > 0) {
                    const cover = deal.images.find((img: any) => img.isCover);
                    coverImage = cover ? cover.url : deal.images[0].url;
                }

                return {
                    id: deal.id,
                    title: deal.title,
                    description: deal.description,
                    imageUrls: deal.images.map((img: any) => img.url),
                    coverImage, // <-- add this field
                    price: deal.price,
                    originalPrice: deal.originalPrice,
                    merchant: deal.merchant,
                    category: deal.category,
                    dealUrl: deal.dealUrl,
                    expired: deal.expired,
                    expiresAt: deal.expiresAt?.toISOString() ?? null,
                    startAt: deal.startAt?.toISOString() ?? null,
                    createdAt: deal.createdAt.toISOString(),
                    score: upVotes - downVotes,
                    commentCount: deal._count.comments,
                    postedBy: deal.user,
                    userVote,
                }
            })
        },
        deal: async (_: any, { id }: any) => {
            const deal = await prisma.deal.findUnique({
                where: { id },
                include: {
                    user: { select: { id: true, username: true, avatarUrl: true } },
                    _count: { select: { comments: true } },
                    votes: true,
                    images: true,
                },
            });
            if (!deal) return null;
            const supabase = getSupabase();
            const { data: { session } } = await supabase.auth.getSession();
            let currentUserId: string | null = null;
            if (session?.user?.email) {
                const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
                currentUserId = dbUser?.id || null;
            }
            const upVotes = deal.votes.filter((v: any) => v.voteType === 'up').length;
            const downVotes = deal.votes.filter((v: any) => v.voteType === 'down').length;
            const userVote = deal.votes.find((v: any) => v.userId === currentUserId)?.voteType;
            let coverImage = null;
            if (deal.images && deal.images.length > 0) {
                const cover = deal.images.find((img: any) => img.isCover);
                coverImage = cover ? cover.url : deal.images[0].url;
            }
            return {
                id: deal.id,
                title: deal.title,
                description: deal.description,
                imageUrls: deal.images.map((img: any) => img.url),
                coverImage,
                price: deal.price,
                originalPrice: deal.originalPrice,
                merchant: deal.merchant,
                category: deal.category,
                dealUrl: deal.dealUrl,
                expired: deal.expired,
                expiresAt: deal.expiresAt?.toISOString() ?? null,
                startAt: deal.startAt?.toISOString() ?? null,
                createdAt: deal.createdAt.toISOString(),
                score: upVotes - downVotes,
                commentCount: deal._count.comments,
                postedBy: deal.user,
                userVote,
            };
        },
        coupons: async (_: any, { merchant, category, sort = 'newest' }: any) => {
            let orderBy: any = { createdAt: 'desc' }

            if (sort === 'comments') {
                orderBy = [{ comments: { _count: 'desc' } }, { createdAt: 'desc' }]
            }

            // Build where clause for filtering
            let whereClause: any = {}
            
            if (merchant) {
                whereClause.merchant = { contains: merchant, mode: 'insensitive' }
            }
            
            if (category) {
                whereClause.category = { equals: category, mode: 'insensitive' }
            }

            const coupons = await prisma.coupon.findMany({
                where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
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

            return coupons.map((coupon: any) => {
                const upVotes = coupon.votes.filter((v: any) => v.voteType === 'up').length
                const downVotes = coupon.votes.filter((v: any) => v.voteType === 'down').length
                const userVote = coupon.votes.find((v: any) => v.userId === currentUserId)?.voteType

                // Find the cover image (isCover) or fallback to first image
                let coverImage = null;
                if (coupon.images && coupon.images.length > 0) {
                    const cover = coupon.images.find((img: any) => img.isCover);
                    coverImage = cover ? cover.url : coupon.images[0].url;
                }

                return {
                    id: coupon.id,
                    title: coupon.title,
                    description: coupon.description,
                    imageUrls: coupon.images.map((img: any) => img.url),
                    coverImage,
                    discountCode: coupon.discountCode,
                    discountType: coupon.discountType,
                    merchant: coupon.merchant,
                    discountValue: coupon.discountValue,
                    availability: coupon.availability,
                    couponUrl: coupon.couponUrl,
                    expired: coupon.expired,
                    expiresAt: coupon.expiresAt?.toISOString() ?? null,
                    startAt: coupon.startAt?.toISOString() ?? null,
                    category: coupon.category,
                    createdAt: coupon.createdAt.toISOString(),
                    score: upVotes - downVotes,
                    commentCount: coupon._count.comments,
                    postedBy: coupon.user,
                    userVote,
                }
            })
        },
        coupon: async (_: any, { id }: any) => {
            const coupon = await prisma.coupon.findUnique({
                where: { id },
                include: {
                    user: { select: { id: true, username: true, avatarUrl: true } },
                    _count: { select: { comments: true } },
                    votes: true,
                    images: true,
                },
            });
            if (!coupon) return null;
            const supabase = getSupabase();
            const { data: { session } } = await supabase.auth.getSession();
            let currentUserId: string | null = null;
            if (session?.user?.email) {
                const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
                currentUserId = dbUser?.id || null;
            }
            const upVotes = coupon.votes.filter((v: any) => v.voteType === 'up').length;
            const downVotes = coupon.votes.filter((v: any) => v.voteType === 'down').length;
            const userVote = coupon.votes.find((v: any) => v.userId === currentUserId)?.voteType;
            let coverImage = null;
            if (coupon.images && coupon.images.length > 0) {
                const cover = coupon.images.find((img: any) => img.isCover);
                coverImage = cover ? cover.url : coupon.images[0].url;
            }
            return {
                id: coupon.id,
                title: coupon.title,
                description: coupon.description,
                imageUrls: coupon.images.map((img: any) => img.url),
                coverImage,
                discountCode: coupon.discountCode,
                discountType: coupon.discountType,
                merchant: coupon.merchant,
                discountValue: coupon.discountValue,
                availability: coupon.availability,
                couponUrl: coupon.couponUrl,
                expired: coupon.expired,
                expiresAt: coupon.expiresAt?.toISOString() ?? null,
                startAt: coupon.startAt?.toISOString() ?? null,
                category: coupon.category,
                createdAt: coupon.createdAt.toISOString(),
                score: upVotes - downVotes,
                commentCount: coupon._count.comments,
                postedBy: coupon.user,
                userVote,
            };
        },
    },
}
