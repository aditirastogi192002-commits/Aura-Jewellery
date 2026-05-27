'use client'

import { useEffect, useRef, useState } from 'react'
import { m, useInView } from 'framer-motion'
import { Star } from 'lucide-react'
import { fadeUp, fadeIn, staggerContainer, scaleReveal, viewport } from '@/lib/motion'

// ─── Count-up hook ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!inView) return
    let start: number | null = null
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target, duration])

  return { ref, count }
}

// ─── Stars ──────────────────────────────────────────────────────────────────
function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className="text-gold/80 fill-gold/80"
          strokeWidth={0}
        />
      ))}
    </div>
  )
}

// ─── Testimonials data ──────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:
      "The Commuter Cuff doesn't snag on anything. I've worn it daily for 8 months.",
    name: 'Ananya S.',
    city: 'Mumbai',
  },
  {
    quote:
      'Finally, earrings I can wear from 8am to 8pm without discomfort.',
    name: 'Ritika B.',
    city: 'Delhi',
  },
  {
    quote:
      'The packaging alone felt like a luxury gift. The jewellery even more so.',
    name: 'Meera K.',
    city: 'Hyderabad',
  },
]

// ─── Stats data ─────────────────────────────────────────────────────────────
const STATS = [
  { target: 4200, suffix: '+', label: 'Happy Customers' },
  { target: 98,   suffix: '%', label: 'Would Recommend' },
  { target: 6,    suffix: 'yrs', label: 'Of Craftsmanship' },
]

function StatItem({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, count } = useCountUp(target)
  return (
    <div className="text-center px-6">
      <span
        ref={ref}
        className="font-label font-semibold text-gold text-2xl md:text-3xl tabular-nums"
      >
        {count.toLocaleString()}{suffix}
      </span>
      <p className="font-label uppercase tracking-widest text-cream-muted text-xs mt-1">
        {label}
      </p>
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function SocialProof() {
  return (
    <section id="about" className="bg-emerald py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* ─── Hero Quote ───────────────────────────────────────────── */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-20"
        >
          <span
            className="font-display text-gold leading-none opacity-60 block"
            style={{ fontSize: '80px', lineHeight: 0.8 }}
            aria-hidden
          >
            &ldquo;
          </span>
          <blockquote className="font-display italic text-cream text-2xl md:text-3xl max-w-3xl mx-auto leading-snug mt-4">
            I wore the Executive Ring to three pitch meetings last week. Two clients asked
            where I got it.
          </blockquote>
          <cite className="font-label not-italic uppercase tracking-widest text-cream-muted text-xs block mt-5">
            — Priya M., Founder &amp; CEO, Bengaluru
          </cite>
        </m.div>

        {/* ─── Testimonial Cards ────────────────────────────────────── */}
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {TESTIMONIALS.map(({ quote, name, city }) => (
            <m.div
              key={name}
              variants={scaleReveal}
              className="bg-moss border border-fern/40 rounded-xl p-6 flex flex-col gap-3"
            >
              <Stars />
              <p className="font-body italic text-cream-muted text-sm leading-relaxed flex-1">
                &ldquo;{quote}&rdquo;
              </p>
              <div>
                <p className="font-label uppercase tracking-wide text-cream text-xs">
                  {name}
                </p>
                <p className="font-label text-cream-muted text-xs mt-0.5">
                  {city}
                </p>
              </div>
            </m.div>
          ))}
        </m.div>

        {/* ─── Stats Bar ────────────────────────────────────────────── */}
        <m.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="border border-fern/30 rounded-xl py-8"
        >
          <div className="grid grid-cols-3 divide-x divide-fern/30">
            {STATS.map(({ target, suffix, label }) => (
              <StatItem key={label} target={target} suffix={suffix} label={label} />
            ))}
          </div>
        </m.div>
      </div>
    </section>
  )
}
