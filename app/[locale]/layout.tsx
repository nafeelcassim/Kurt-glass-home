import type { Metadata, Viewport } from 'next'
import { League_Spartan } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import '../globals.css'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'

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



export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {

    // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${leagueSpartan.variable} bg-background`}>
      <body className="bg-background text-foreground font-sans antialiased">
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
