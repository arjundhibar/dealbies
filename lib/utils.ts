import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { formatDistanceToNow } from "date-fns"

export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, {
    addSuffix: true,
  }).replace(/^about /, '')
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`
}

export function calculateDiscount(originalPrice: number, price: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate SEO-friendly image URL that will be handled by our API route
 * @param slug - The image slug from the database
 * @returns SEO-friendly URL that will redirect to Cloudflare
 */
export function getImageUrl(slug: string): string {
  if (!slug) return '/placeholder.svg';
  return `/api/images/${slug}`;
}
