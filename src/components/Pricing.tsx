'use client'

import { m } from 'framer-motion'
import { Check } from 'lucide-react'
import { fadeUp, scaleReveal, staggerContainer, viewport } from '@/lib/motion'

const PLANS = [
  {
    name: 'Everyday',
    price: '₹1,499–₹2,999',
    badge: null,
    featured: false,
    features: [
      '925 certified silver',
      'Velvet pouch included',
      'Free shipping over ₹2,000',
      '30-day returns',
    ],
    cta: 'Shop Everyday',
    ctaStyle: 'border border-fern/60 text-cream hover:bg-fern/20',
  },
  {
    name: 'Collection',
    price: '₹3,999–₹6,999',
    badge: 'Most Loved',
    featured: true,
    features: [
      'Everything in Everyday',
      'Luxury gift box',
      'Personalised card',
      'Priority dispatch',
      'Dedicated stylist intro',
    ],
    cta: 'Shop Collections',
    ctaStyle: 'bg-gold text-forest hover:bg-gold-light',
  },
  {
    name: 'Bespoke',
    price: 'From ₹9,999',
    badge: null,
    featured: false,
    features: [
      'Everything in Collection',
      '3 design revision rounds',
      'Custom engraving',
      'Certificate of authenticity',
      'Dedicated artisan',
    ],
    cta: 'Start Custom Order',
    ctaStyle: 'border border-gold/50 text-gold hover:bg-gold/10',
  },
]

export default function Pricing() {
  return (
    <section className="bg-forest py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* ─── Header ───────────────────────────────────────────────── */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-16"
        >
          <h2 className="font-display font-normal text-cream text-4xl md:text-5xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="font-body text-cream-muted text-base">
            No markups. No middlemen. Pure silver.
          </p>
        </m.div>

        {/* ─── Pricing Cards ────────────────────────────────────────── */}
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
        >
          {PLANS.map(({ name, price, badge, featured, features, cta, ctaStyle }) => (
            <m.div
              key={name}
              variants={scaleReveal}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className={`relative bg-moss rounded-xl p-8 flex flex-col gap-6 transition-shadow duration-300 ${
                featured
                  ? 'border-2 border-gold/70 shadow-gold-glow-lg'
                  : 'border border-fern/40'
              }`}
            >
              {/* "Most Loved" badge */}
              {badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="font-label uppercase tracking-wider text-forest bg-gold text-xs px-4 py-1.5 rounded-full whitespace-nowrap">
                    {badge}
                  </span>
                </div>
              )}

              {/* Plan name & price */}
              <div className="mt-2">
                <h3 className="font-label uppercase tracking-widest text-cream text-base mb-2">
                  {name}
                </h3>
                <p className="font-display text-gold text-3xl font-normal">
                  {price}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-fern/30" />

              {/* Features list */}
              <ul className="flex flex-col gap-3 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={14} className="text-gold mt-0.5 shrink-0" strokeWidth={2.5} />
                    <span className="font-body text-cream-muted text-sm leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <a
                href="#collections"
                className={`font-label uppercase tracking-widest text-xs px-6 py-3 text-center transition-all duration-300 inline-block ${ctaStyle}`}
              >
                {cta}
              </a>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  )
}
