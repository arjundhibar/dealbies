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
    ]
  },
}

export default nextConfig
