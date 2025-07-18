// lib/utils/getImageIdFromUrl.ts
export function getImageIdFromUrl(cloudflareUrl: string): string | null {
    const match = cloudflareUrl.match(/imagedelivery\.net\/[^/]+\/([^/]+)\/public/)
    return match ? match[1] : null
}
