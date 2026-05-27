'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { fadeUp, staggerContainer, viewport } from '@/lib/motion'

const FAQS = [
  {
    q: 'Is your silver genuinely 925? How do I verify?',
    a: 'Every piece we sell is stamped with a 925 hallmark — the internationally recognised standard for sterling silver. You can verify authenticity by looking for the tiny "925" mark on the inner side of rings and bracelets, or on the clasp of necklaces. We also include a certificate of purity with every Collection and Bespoke order.',
  },
  {
    q: 'Will it tarnish? How should I care for it?',
    a: 'Sterling silver naturally tarnishes over time when exposed to air and moisture, but 9 to 5 pieces are treated with a protective coating that significantly slows this process. Store your jewellery in the provided velvet pouch, keep it away from perfume and lotions, and wipe gently with a soft cloth after wearing. If tarnish does appear, our Lifetime Polish Promise means we\'ll restore it free of charge.',
  },
  {
    q: 'Do you ship across India? What about international orders?',
    a: 'Yes — we offer free shipping across India on all orders above ₹2,000. For orders below that threshold, a flat ₹99 shipping fee applies. International shipping is available to select countries (UAE, UK, USA, Singapore, Australia) starting from ₹699. Estimated delivery is 3–5 business days for domestic and 7–14 days for international.',
  },
  {
    q: 'What is your return and exchange policy?',
    a: 'We offer hassle-free 30-day returns and exchanges on all Everyday and Collection pieces, provided they are unworn and in original packaging. Bespoke and engraved pieces are non-returnable due to their custom nature, but we\'ll work with you to ensure you\'re satisfied before production begins.',
  },
  {
    q: 'Can I get a piece resized or engraved?',
    a: 'Ring resizing is available for most styles within 2 sizes up or down, at a flat fee of ₹299. Engraving can be added to rings, cuffs, and pendants — up to 20 characters. Both services are available at checkout or by contacting us directly. Bespoke orders include engraving as standard.',
  },
  {
    q: 'How does the Lifetime Polish Promise actually work?',
    a: 'Simple: any 9 to 5 piece, any time, gets a full professional clean and polish — on us. Just ship the piece to our studio (we\'ll send you a prepaid label), and we\'ll return it looking showroom-fresh within 7 business days. There\'s no limit on how many times you can use this service. It\'s our way of committing to a piece that lasts a lifetime.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-fern/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 gap-4 text-left"
        aria-expanded={open}
      >
        <span className="font-label uppercase tracking-wide text-cream text-sm">
          {q}
        </span>
        <m.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="shrink-0 text-gold"
        >
          <Plus size={18} strokeWidth={1.5} />
        </m.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="font-body text-cream-muted text-sm leading-relaxed pb-5 max-w-2xl">
              {a}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  return (
    <section className="bg-emerald py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-10">

        {/* ─── Header ───────────────────────────────────────────────── */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-14"
        >
          <p className="font-label uppercase tracking-[0.4em] text-gold text-xs mb-5">
            FAQ
          </p>
          <h2 className="font-display font-normal text-cream text-4xl md:text-5xl">
            Questions, Answered
          </h2>
        </m.div>

        {/* ─── Accordion ────────────────────────────────────────────── */}
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {FAQS.map((item) => (
            <m.div key={item.q} variants={fadeUp}>
              <FAQItem {...item} />
            </m.div>
          ))}
        </m.div>

        {/* ─── Bottom CTA ───────────────────────────────────────────── */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mt-14"
        >
          <p className="font-body text-cream-muted text-sm mb-4">
            Still have questions? We&apos;d love to help.
          </p>
          <a
            href="mailto:hello@ninetofivejewellery.in"
            className="font-label uppercase tracking-widest text-xs text-gold border border-gold/50 px-6 py-3 hover:bg-gold hover:text-forest transition-all duration-300 inline-block"
          >
            Contact Us
          </a>
        </m.div>
      </div>
    </section>
  )
}
