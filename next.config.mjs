/** @type {import('next').NextConfig} */

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const isDev = process.env.NODE_ENV !== 'production'

// Content Security Policy: only what the site actually loads.
// - Scripts/styles: own origin. 'unsafe-inline' is needed for Next.js' inline bootstrap scripts
//   and for inline style attributes (GSAP animations); dev additionally needs eval + HMR websocket.
// - Images: own origin only (remote logos go through /_next/image).
// - Media: own videos + the hero video on Vercel Blob.
// - Vercel Analytics: served same-origin under /_vercel/insights; va.vercel-scripts.com as fallback.
// ponytail: 'unsafe-inline' scripts; switch to a nonce-based CSP via proxy.ts if stricter XSS hardening is needed.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' https://qjpz0te97ckckvfq.public.blob.vercel-storage.com",
  `connect-src 'self' https://va.vercel-scripts.com${isDev ? ' ws: wss:' : ''}`,
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  // HTTPS only for 2 years (no includeSubDomains/preload: other kurth-glas.ch subdomains are not under our control).
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' }, // legacy browsers; frame-ancestors covers modern ones
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
]

const nextConfig = {
  poweredByHeader: false, // don't advertise the framework

  experimental: {
    // Guarantee per-icon module resolution instead of any barrel-file pull-in.
    optimizePackageImports: ['lucide-react'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default withNextIntl(nextConfig)
