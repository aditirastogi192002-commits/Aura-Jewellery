'use client'

import { m } from 'framer-motion'
import { Shield, Zap, RefreshCw } from 'lucide-react'
import { fadeUp, staggerContainer, viewport } from '@/lib/motion'

const FEATURES = [
  {
    number: '01',
    Icon: Shield,
    title: 'Pure 925 Silver',
    description:
      'Every piece carries a 925 hallmark. Hypoallergenic, tarnish-resistant, and built to last decades — not just seasons.',
  },
  {
    number: '02',
    Icon: Zap,
    title: 'Desk-to-Dinner Design',
    description:
      'Secure clasps, low-profile settings, and ergonomic weights. Made for movement, crafted for presence.',
  },
  {
    number: '03',
    Icon: RefreshCw,
    title: 'Lifetime Polish Promise',
    description:
      'Ship any piece back to us, anytime. We restore it to showroom finish at no cost. That\'s our promise.',
  },
]

export default function Features() {
  return (
    <section id="craftsmanship" className="bg-emerald py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* ─── Section Header ───────────────────────────────────────── */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-16"
        >
          <p className="font-label uppercase tracking-[0.4em] text-gold text-xs mb-5">
            Why 9 to 5
          </p>
          <h2 className="font-display font-normal text-cream text-5xl md:text-6xl leading-tight mb-8">
            Jewellery That Works<br className="hidden md:block" />
            <span className="italic"> As Hard As You Do</span>
          </h2>

          {/* Decorative rule with diamond */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 max-w-[160px] bg-fern/40" />
            <span className="text-gold text-xs">◆</span>
            <div className="h-px flex-1 max-w-[160px] bg-fern/40" />
          </div>
        </m.div>

        {/* ─── Feature Cards ────────────────────────────────────────── */}
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {FEATURES.map(({ number, Icon, title, description }) => (
            <m.div
              key={title}
              variants={fadeUp}
              whileHover={{
                borderColor: 'rgba(201,169,110,0.5)',
                boxShadow: '0 0 40px rgba(201,169,110,0.06)',
              }}
              className="relative bg-moss border border-fern/50 rounded-xl p-8 overflow-hidden transition-colors duration-300"
            >
              {/* Large card number — decorative */}
              <span
                aria-hidden
                className="absolute top-2 right-4 font-display font-black text-cream opacity-[0.04] select-none leading-none"
                style={{ fontSize: '96px' }}
              >
                {number}
              </span>

              {/* Icon */}
              <Icon size={32} className="text-gold mb-5" strokeWidth={1.5} />

              {/* Title */}
              <h3 className="font-label uppercase tracking-wide text-cream text-lg mb-3">
                {title}
              </h3>

              {/* Description */}
              <p className="font-body text-cream-muted text-sm leading-relaxed">
                {description}
              </p>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  )
}
