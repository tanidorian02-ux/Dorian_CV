import type { Metadata } from 'next'
import { Syne, DM_Mono, Inter } from 'next/font/google'
import './globals.css'

const syne = Syne({ subsets: ['latin'], weight: ['400','500','600','700','800'], variable: '--font-syne' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400','500'], style: ['normal','italic'], variable: '--font-dm-mono' })
const inter = Inter({ subsets: ['latin'], weight: ['300','400','500'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Dorian Tani — Developer · Animator · Builder',
  description: 'Portfolio de Dorian Tani — Développeur full stack, animateur 2D, builder IA. Belgique.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${dmMono.variable} ${inter.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
