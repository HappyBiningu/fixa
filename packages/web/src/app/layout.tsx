import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import HeaderClient from '@/components/HeaderClient'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fixa - Hyperlocal Job Marketplace',
  description: 'Connect with skilled workers nearby',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <HeaderClient />
          {children}
        </Providers>
      </body>
    </html>
  )
}

