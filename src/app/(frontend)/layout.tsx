import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Inter, Playfair_Display, Montserrat } from 'next/font/google'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

import './styles.css'
import { Providers } from '@/components/providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'La Pradera Country Club',
  description:
    'La Pradera Country Club — Club campestre con instalaciones deportivas, piscinas, bungalos y espacios para toda la familia.',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} ${montserrat.variable}`}>
      <body className="bg-white text-gray-800 font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
