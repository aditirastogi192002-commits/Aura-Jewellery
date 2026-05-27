'use client'

import { m } from 'framer-motion'
import { Camera, Globe, ExternalLink } from 'lucide-react'
import { fadeUp, staggerContainer, viewport } from '@/lib/motion'
import AuraLogo from '@/components/AuraLogo'

const SHOP_LINKS   = ['Collections', 'Rings', 'Cuffs', 'Pendants', 'Earrings', 'Bespoke']
const COMPANY_LINKS = ['Our Story', 'Craftsmanship', 'Sustainability', 'Careers', 'Press']

const SOCIAL_ICONS = [
  { Icon: Camera,      label: 'Instagram',  href: '#' },
  { Icon: Globe,       label: 'LinkedIn',   href: '#' },
  { Icon: ExternalLink, label: 'Pinterest', href: '#' },
]

export default function Footer() {
  return (
    <footer id="contact" className="bg-forest border-t border-fern/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* ─── Top Grid ─────────────────────────────────────────────── */}
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14"
        >

          {/* Logo block */}
          <m.div variants={fadeUp} className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <AuraLogo size={30} showWordmark={false} />
              <div className="flex flex-col leading-none">
                <span className="font-label tracking-[0.38em] text-gold text-sm font-semibold">
                  AURA
                </span>
                <span className="font-label uppercase tracking-widest text-gold-dark text-[9px] mt-0.5">
                  Silver Jewellery
                </span>
              </div>
            </div>
            <p className="font-body text-cream-muted text-xs leading-relaxed mb-5 max-w-[180px]">
              Jewellery for the modern woman. Crafted in India. Made to last.
            </p>
            {/* Social icons */}
            <div className="flex gap-4">
              {SOCIAL_ICONS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-cream-muted hover:text-gold transition-colors duration-300"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </m.div>

          {/* Shop links */}
          <m.div variants={fadeUp}>
            <h4 className="font-label uppercase tracking-widest text-cream text-xs mb-5">
              Shop
            </h4>
            <ul className="flex flex-col gap-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body text-cream-muted text-xs hover:text-gold transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </m.div>

          {/* Company links */}
          <m.div variants={fadeUp}>
            <h4 className="font-label uppercase tracking-widest text-cream text-xs mb-5">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body text-cream-muted text-xs hover:text-gold transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </m.div>

          {/* Newsletter */}
          <m.div variants={fadeUp}>
            <h4 className="font-label uppercase tracking-widest text-cream text-xs mb-5">
              Stay in the Loop
            </h4>
            <p className="font-body text-cream-muted text-xs leading-relaxed mb-4">
              New collections, styling tips, and member-only offers.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-moss border border-fern/40 text-cream placeholder-cream-muted/50 text-xs font-body px-4 py-2.5 rounded focus:outline-none focus:border-gold/60 transition-colors duration-300"
              />
              <button
                type="submit"
                className="bg-gold text-forest font-label uppercase tracking-widest text-xs px-4 py-2.5 hover:bg-gold-light transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </m.div>
        </m.div>

        {/* ─── Decorative divider ───────────────────────────────────── */}
        <div className="h-px bg-fern/20 mb-6" />

        {/* ─── Bottom Bar ───────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
          <p className="font-label text-cream-muted text-xs tracking-wide">
            © 2025 AURA Jewellery. All rights reserved.
          </p>
          <p className="font-label text-cream-muted text-xs tracking-wide">
            Made with care in India 🇮🇳
          </p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service'].map((link) => (
              <a
                key={link}
                href="#"
                className="font-label text-cream-muted text-xs tracking-wide hover:text-gold transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
