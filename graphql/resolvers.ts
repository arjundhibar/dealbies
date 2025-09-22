// graphql/resolvers.ts
import { prisma } from '@/lib/prisma'
import { getSupabase } from '@/lib/supabase'
import { getImageUrl } from '@/lib/utils'

export const resolvers = {
    Query: {
        deals: async (_: any, { category, sort = 'newest' }: any) => {
            let orderBy: any = { createdAt: 'desc' }

            if (sort === 'comments') {
                orderBy = [{ comments: { _count: 'desc' } }, { createdAt: 'desc' }]
            } else if (sort === 'hottest') {
                orderBy = [{ votes: { _count: 'desc' } }, { createdAt: 'desc' }]
            } else if (sort === 'newest') {
                orderBy = { createdAt: 'desc' }
            }


            // Calculate 72 hours ago for "new" filter
            const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
            
            const deals = await prisma.deal.findMany({
                where: {
                    ...(category ? { 
                        category: { 
                            equals: category, 
                            mode: 'insensitive' 
                        } 
                    } : {}),
                    ...(sort === 'new' ? {
                        createdAt: {
                            gte: seventyTwoHoursAgo
                        }
                    } : {})
                },
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
                    coverImage = cover || deal.images[0];
                }

            return {
                id: deal.id,
                slug: deal.slug,
                title: deal.title,
                description: deal.description,
                imageUrls: deal.images.map((img: any) => getImageUrl(img.slug)),
                coverImage: coverImage ? getImageUrl(coverImage.slug) : null,
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
                                    coverImage = cover || deal.images[0];
            }
        return {
            id: deal.id,
            slug: deal.slug,
            title: deal.title,
            description: deal.description,
            imageUrls: deal.images.map((img: any) => getImageUrl(img.slug)),
            coverImage: coverImage ? getImageUrl(coverImage.slug) : null,
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
    dealBySlug: async (_: any, { slug }: any) => {
        const deal = await prisma.deal.findUnique({
            where: { slug },
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
            const dbUser = await prisma.deal.findFirst({ where: { user: { email: session.user.email } } });
            currentUserId = (dbUser as any)?.userId || null;
        }
        const upVotes = deal.votes.filter((v: any) => v.voteType === 'up').length;
        const downVotes = deal.votes.filter((v: any) => v.voteType === 'down').length;
        const userVote = deal.votes.find((v: any) => v.userId === currentUserId)?.voteType;
        let coverImage = null;
        if (deal.images && deal.images.length > 0) {
            const cover = deal.images.find((img: any) => img.isCover);
            coverImage = cover || deal.images[0];
        }
        return {
            id: deal.id,
            slug: deal.slug,
            title: deal.title,
            description: deal.description,
            imageUrls: deal.images.map((img: any) => getImageUrl(img.slug)),
            coverImage: coverImage ? getImageUrl(coverImage.slug) : null,
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
                whereClause.category = category
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
                    coverImage = cover || coupon.images[0];
                }

                return {
                    id: coupon.id,
                    title: coupon.title,
                    description: coupon.description,
                    imageUrls: coupon.images.map((img: any) => getImageUrl(img.slug)),
                    coverImage: coverImage ? getImageUrl(coverImage.slug) : null,
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
                coverImage = cover || coupon.images[0];
            }
            return {
                id: coupon.id,
                title: coupon.title,
                description: coupon.description,
                imageUrls: coupon.images.map((img: any) => getImageUrl(img.slug)),
                coverImage: coverImage ? getImageUrl(coverImage.slug) : null,
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
        discussions: async (_: any, { category, dealCategory, sort = 'newest' }: any) => {
            let orderBy: any = { createdAt: 'desc' }

            if (sort === 'comments') {
                orderBy = [{ comments: { _count: 'desc' } }, { createdAt: 'desc' }]
            } else if (sort === 'hottest') {
                orderBy = [{ votes: { _count: 'desc' } }, { createdAt: 'desc' }]
            } else if (sort === 'newest') {
                orderBy = { createdAt: 'desc' }
            }

            // Build where clause for filtering
            let whereClause: any = {}
            
            if (category && category !== 'all') {
                whereClause.category = { equals: category, mode: 'insensitive' }
            }
            
            if (dealCategory && dealCategory !== 'all') {
                whereClause.dealCategory = { equals: dealCategory, mode: 'insensitive' }
            }

            const discussions = await prisma.discussion.findMany({
                where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
                orderBy,
                include: {
                    user: { select: { id: true, username: true, avatarUrl: true } },
                    _count: { select: { comments: true } },
                    votes: true,
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

            return discussions.map((discussion: any) => {
                const upVotes = discussion.votes.filter((v: any) => v.voteType === 'up').length
                const downVotes = discussion.votes.filter((v: any) => v.voteType === 'down').length
                const userVote = discussion.votes.find((v: any) => v.userId === currentUserId)?.voteType

                return {
                    id: discussion.id,
                    title: discussion.title,
                    description: discussion.description,
                    category: discussion.category,
                    dealCategory: discussion.dealCategory,
                    createdAt: discussion.createdAt.toISOString(),
                    score: upVotes - downVotes,
                    commentCount: discussion._count.comments,
                    postedBy: discussion.user,
                    userVote,
                }
            })
        },
        discussion: async (_: any, { id }: any) => {
            const discussion = await prisma.discussion.findUnique({
                where: { id },
                include: {
                    user: { select: { id: true, username: true, avatarUrl: true } },
                    _count: { select: { comments: true } },
                    votes: true,
                },
            });
            if (!discussion) return null;
            const supabase = getSupabase();
            const { data: { session } } = await supabase.auth.getSession();
            let currentUserId: string | null = null;
            if (session?.user?.email) {
                const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
                currentUserId = dbUser?.id || null;
            }
            const upVotes = discussion.votes.filter((v: any) => v.voteType === 'up').length;
            const downVotes = discussion.votes.filter((v: any) => v.voteType === 'down').length;
            const userVote = discussion.votes.find((v: any) => v.userId === currentUserId)?.voteType;
            return {
                id: discussion.id,
                title: discussion.title,
                description: discussion.description,
                category: discussion.category,
                dealCategory: discussion.dealCategory,
                createdAt: discussion.createdAt.toISOString(),
                score: upVotes - downVotes,
                commentCount: discussion._count.comments,
                postedBy: discussion.user,
                userVote,
            };
        },
    },
}
