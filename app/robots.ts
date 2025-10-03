// app/robots.ts - Robots.txt generation

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/login',
          '/signup',
          '/profile/',
          '/settings/',
          '/saved/',
          '/my-deals/',
          '/submission/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/login',
          '/signup',
          '/profile/',
          '/settings/',
          '/saved/',
          '/my-deals/',
          '/submission/',
        ],
      },
    ],
    sitemap: 'https://dealbies.com/sitemap.xml',
    host: 'https://dealbies.com',
  }
}
