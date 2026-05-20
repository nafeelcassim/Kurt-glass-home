import type { Metadata, Viewport } from 'next'
import { League_Spartan } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const leagueSpartan = League_Spartan({ 
  subsets: ['latin'],
  variable: '--font-league-spartan',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Kurth Glass - High End Glass Since 1970',
  description: 'Premium glass manufacturing and artisan glassware since 1970. Elegant show glasses, decorative pieces, and custom glass solutions.',
  keywords: ['glass', 'glassware', 'show glasses', 'premium glass', 'artisan', 'manufacturing'],
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} bg-background`}>
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
