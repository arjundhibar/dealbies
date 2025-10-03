/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Redirect old singular route to plural, preserving slug or id
      { source: '/deal/:slug', destination: '/deals/:slug', permanent: true },
      { source: '/coupon/:slug', destination: '/coupons/:slug', permanent: true },
      
      // Redirect old ID-based URLs to slug-based URLs (these will be handled by the new pages)
      { source: '/deal/:id', destination: '/deals/:id', permanent: true },
      { source: '/coupon/:id', destination: '/coupons/:id', permanent: true },
      
      // Redirect common variations
      { source: '/deals', destination: '/deals', permanent: false },
      { source: '/coupons', destination: '/coupons', permanent: false },
      
      // Redirect old category URLs if needed
      { source: '/category/:category', destination: '/category/:category', permanent: false },
    ]
  },
}

export default nextConfig
