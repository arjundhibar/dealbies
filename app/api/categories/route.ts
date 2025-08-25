import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all unique categories from deals
    const dealCategories = await prisma.deal.findMany({
      select: { category: true },
      distinct: ['category']
    })
    
    // Get all unique categories from coupons
    const couponCategories = await prisma.coupon.findMany({
      select: { category: true },
      distinct: ['category']
    })
    
    // Combine and get unique categories
    const allCategories = [...dealCategories, ...couponCategories]
      .map(item => item.category)
      .filter((category, index, arr) => arr.indexOf(category) === index)
      .sort()
    
    return NextResponse.json({
      dealCategories: dealCategories.map(d => d.category),
      couponCategories: couponCategories.map(c => c.category),
      allUniqueCategories: allCategories
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
