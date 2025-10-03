// app/sitemap.ts - Dynamic sitemap generation

import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dealbies.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/coupons`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submission/add`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  try {
    // Dynamic pages - Deals
    const deals = await prisma.deal.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      where: {
        expired: false,
      },
    })

    const dealPages = deals.map((deal) => ({
      url: `${baseUrl}/deals/${deal.slug}`,
      lastModified: deal.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Dynamic pages - Coupons
    const coupons = await prisma.coupon.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      where: {
        expired: false,
      },
    })

    const couponPages = coupons.map((coupon) => ({
      url: `${baseUrl}/coupons/${coupon.slug}`,
      lastModified: coupon.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Dynamic pages - Categories
    const categories = [
      'electronics',
      'fashion',
      'home',
      'sports',
      'gaming',
      'beauty',
      'automotive',
      'groceries',
      'family',
      'garden',
      'car',
      'culture',
      'telecom',
      'money',
      'services-and-contracts',
      'to-travel'
    ]

    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/category/${category}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [
      ...staticPages,
      ...dealPages,
      ...couponPages,
      ...categoryPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
