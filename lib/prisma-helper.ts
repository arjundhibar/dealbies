import type { Prisma } from "@prisma/client"

// Helper function to convert Prisma Decimal to JavaScript number
export function decimalToNumber(decimal: Prisma.Decimal | null): number | null {
  if (decimal === null) return null
  return typeof decimal.toNumber === "function" ? decimal.toNumber() : Number(decimal)
}

// Helper function to format a Prisma Deal for the form
export function formatDealForForm(deal: any) {
  return {
    ...deal,
    price: decimalToNumber(deal.price) ?? 0,
    originalPrice: decimalToNumber(deal.originalPrice),
  }
}
