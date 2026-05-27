import type { Metadata } from 'next'
import { Playfair_Display, Josefin_Sans, Lora } from 'next/font/google'
import './globals.css'
import Providers    from '@/components/Providers'
import CustomCursor from '@/components/CustomCursor'

// ─── Fonts ────────────────────────────────────────────────────────────────────
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
})

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-label',
  display: 'swap',
  preload: true,
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
})

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'AURA — Sterling Silver Jewellery for the Modern Working Woman',
  description:
    'Handcrafted 925 sterling silver jewellery designed to carry you from morning brief to evening event. Nickel-free, tarnish-resistant, lifetime polish promise.',
  keywords: [
    'AURA jewellery',
    'sterling silver jewellery',
    'office jewellery',
    'work jewellery India',
    '925 silver',
    'handcrafted jewellery',
  ],
  openGraph: {
    title: 'AURA Silver Jewellery',
    description: 'Worn at Nine. Noticed at Five.',
    type: 'website',
  },
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${josefin.variable} ${lora.variable}`}
    >
      <body className="bg-forest text-cream antialiased">
        <Providers>
          <CustomCursor />
          {children}
        </Providers>
      </body>
    </html>
  )
}
