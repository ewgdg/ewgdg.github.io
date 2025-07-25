import type { Metadata, Viewport } from 'next'
import ClientProviders from './client-providers'

// Import global styles
import '@/components/layouts/layout.css'
import 'typeface-roboto'

export const metadata: Metadata = {
  title: 'Xian\'s Page',
  description: 'Personal portfolio website',
  manifest: '/manifest.json',
  icons: {
    icon: '/img/icon.png',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}