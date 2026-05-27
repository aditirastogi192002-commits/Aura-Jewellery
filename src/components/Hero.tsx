'use client'

import { m } from 'framer-motion'
import { Play, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import AuraLogo from '@/components/AuraLogo'
import { fadeUp, fadeIn, scaleReveal, staggerContainer } from '@/lib/motion'

const HEADLINE_LINE1 = ['Worn', 'at', 'Nine.']
const HEADLINE_LINE2 = ['Noticed', 'at', 'Five.']

const AVATAR_INITIALS = ['PS', 'AK', 'RB', 'MN', 'DV']

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-forest flex flex-col overflow-hidden">

      {/* ─── Background Glows ─────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 600px 500px at 70% 40%, rgba(201,169,110,0.05) 0%, transparent 70%),' +
            'radial-gradient(ellipse 400px 350px at 10% 80%, rgba(76,175,125,0.06) 0%, transparent 60%)',
        }}
      />

      {/* ─── Decorative Vertical Text (desktop) ───────────────────── */}
      <span
        aria-hidden
        className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2 font-display font-black text-cream opacity-[0.03] select-none pointer-events-none"
        style={{
          fontSize: '180px',
          writingMode: 'vertical-rl',
          lineHeight: 1,
          letterSpacing: '0.05em',
        }}
      >
        EMERALD
      </span>

      {/* ─── Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 grid md:grid-cols-[55fr_45fr] gap-10 lg:gap-16 items-center pt-28 pb-20">

        {/* ── Left Column ── */}
        <div className="flex flex-col">

          {/* AURA gem mark — tiny above eyebrow */}
          <m.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="mb-5"
          >
            <AuraLogo size={28} showWordmark={false} />
          </m.div>

          {/* Eyebrow */}
          <m.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="font-label uppercase tracking-ultra text-gold-dark text-xs mb-6"
          >
            New Collection · SS 2025
          </m.p>

          {/* H1 — word-by-word stagger */}
          <m.h1
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="font-display font-normal text-cream mb-6 leading-[1.05]"
            style={{ fontSize: 'clamp(52px, 8vw, 108px)' }}
            aria-label="Worn at Nine. Noticed at Five."
          >
            {/* Line 1 — normal weight */}
            <span className="block">
              {HEADLINE_LINE1.map((word, i) => (
                <m.span
                  key={`l1-${i}`}
                  variants={fadeUp}
                  custom={i}
                  className="inline-block mr-[0.2em]"
                  style={{ transition: `opacity 0s ${0.4 + i * 0.08}s` }}
                >
                  {word}
                </m.span>
              ))}
            </span>
            {/* Line 2 — italic bold */}
            <span className="block italic font-bold">
              {HEADLINE_LINE2.map((word, i) => (
                <m.span
                  key={`l2-${i}`}
                  variants={fadeUp}
                  custom={i}
                  className="inline-block mr-[0.2em]"
                >
                  {word}
                </m.span>
              ))}
            </span>
          </m.h1>

          {/* Sub-headline */}
          <m.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.85 }}
            className="font-body text-cream-muted max-w-md text-base leading-relaxed mb-10"
          >
            Sterling silver crafted for women who lead. Designed to carry you from
            morning brief to evening event.
          </m.p>

          {/* CTA Row */}
          <m.div
            variants={scaleReveal}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.1 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <m.a
              href="#collections"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="font-label uppercase tracking-widest text-sm bg-gold text-forest px-7 py-3.5 hover:bg-gold-light transition-colors duration-300 inline-flex items-center"
            >
              Explore Collection
            </m.a>

            <m.a
              href="#story"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="font-label uppercase tracking-widest text-sm text-cream border border-cream/30 px-7 py-3.5 hover:border-gold hover:text-gold transition-colors duration-300 inline-flex items-center gap-2"
            >
              <Play size={14} className="fill-current" />
              Watch the Story
            </m.a>
          </m.div>

          {/* Social Proof Strip */}
          <m.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.3 }}
            className="flex items-center gap-3"
          >
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {AVATAR_INITIALS.map((init) => (
                <div
                  key={init}
                  className="w-7 h-7 rounded-full bg-moss border-2 border-gold/40 flex items-center justify-center"
                >
                  <span className="font-label text-[9px] text-gold-light leading-none">
                    {init}
                  </span>
                </div>
              ))}
            </div>
            <p className="font-label text-cream-muted text-xs tracking-wide">
              <span className="text-gold font-semibold">4,200+</span> women wearing 9 to 5
            </p>
          </m.div>
        </div>

        {/* ── Right Column — Image Placeholder ── */}
        <m.div
          variants={scaleReveal}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="relative"
        >
          {/* Main image card */}
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-fern/60 -rotate-1">
            {/* Real jewellery image */}
            <Image
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80"
              alt="Woman wearing AURA sterling silver jewellery"
              fill
              priority
              className="object-cover object-center scale-105"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            {/* Colour-grade overlay — deep forest tint for brand cohesion */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-forest/10 to-transparent mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent" />

            {/* Floating Badge — bottom left */}
            <m.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.5 }}
              className="absolute bottom-4 left-4"
              style={{ animation: 'float 3s ease-in-out infinite' }}
            >
              <span className="font-label uppercase tracking-widest text-forest text-xs bg-gold/90 px-3 py-1 rounded-sm inline-block">
                925 Sterling Silver
              </span>
            </m.div>

            {/* Floating Badge — top right */}
            <m.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.6 }}
              className="absolute top-4 right-4"
            >
              <span className="font-label uppercase tracking-widest text-gold text-xs bg-forest/90 border border-gold/50 px-3 py-1 rounded-sm inline-block">
                Handcrafted
              </span>
            </m.div>
          </div>

          {/* Subtle decorative corner accent */}
          <div
            aria-hidden
            className="absolute -bottom-4 -right-4 w-24 h-24 border border-fern/20 rounded-lg -z-10"
          />
        </m.div>
      </div>

      {/* ─── Scroll Indicator ─────────────────────────────────────── */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1.8, duration: 0.8 },
          y: { delay: 2, duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/60"
        aria-hidden
      >
        <ChevronDown size={28} strokeWidth={1.5} />
      </m.div>
    </section>
  )
}
