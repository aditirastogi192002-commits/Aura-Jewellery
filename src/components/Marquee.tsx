'use client'

import { m } from 'framer-motion'
import { fadeIn, viewport } from '@/lib/motion'

const MARQUEE_TEXT =
  '925 STERLING SILVER · HANDCRAFTED IN INDIA · NICKEL FREE · LIFETIME WARRANTY · OFFICE TO EVENING · FREE SHIPPING ABOVE ₹2,000 · '

// Repeat 3× so the seamless loop always has content
const CONTENT = MARQUEE_TEXT.repeat(3)

export default function Marquee() {
  return (
    <m.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="bg-gold h-11 flex items-center overflow-hidden select-none"
      aria-label="Brand promises ticker"
    >
      <div className="animate-marquee whitespace-nowrap flex items-center">
        <span className="font-label uppercase tracking-wide-lg text-forest text-xs">
          {CONTENT}
        </span>
        {/* Duplicate for seamless loop */}
        <span className="font-label uppercase tracking-wide-lg text-forest text-xs" aria-hidden>
          {CONTENT}
        </span>
      </div>
    </m.div>
  )
}
