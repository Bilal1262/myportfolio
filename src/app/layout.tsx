import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bilal Ahmed - Robotics Engineer',
  description: 'Portfolio showcasing robotics projects, research, and professional experience in robotics engineering and AI.',
  keywords: ['robotics', 'engineering', 'AI', 'machine learning', 'portfolio', 'Bilal Ahmed'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 