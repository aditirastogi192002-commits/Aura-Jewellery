'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import { scaleReveal, staggerContainer, fadeUp, viewport } from '@/lib/motion'

const COLLECTIONS = [
  {
    id: 'hero',
    name: 'The Executive Ring',
    price: 'From ₹3,499',
    gridArea: 'hero',
    // Silver ring close-up on dark
    img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'AURA Executive Ring — sterling silver',
    gradient: 'from-moss via-emerald to-forest',
  },
  {
    id: 'top-right',
    name: 'The Commuter Cuff',
    price: 'From ₹2,999',
    gridArea: 'top-right',
    // Silver cuff/bracelet
    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'AURA Commuter Cuff — sterling silver bangle',
    gradient: 'from-fern/40 via-moss to-forest',
  },
  {
    id: 'bottom-right',
    name: 'The Meeting Pendant',
    price: 'From ₹2,499',
    gridArea: 'bottom-right',
    // Silver pendant necklace
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'AURA Meeting Pendant — sterling silver necklace',
    gradient: 'from-emerald via-moss to-forest',
  },
  {
    id: 'full',
    name: 'The Friday Set',
    price: 'From ₹5,999',
    gridArea: 'full',
    // Jewellery flatlay / set
    img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1200&q=80',
    imgAlt: 'AURA Friday Set — complete sterling silver collection',
    gradient: 'from-fern/20 via-emerald to-moss',
  },
]

export default function Collections() {
  return (
    <section id="collections" className="bg-forest py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* ─── Section Header (left-aligned) ───────────────────────── */}
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-12"
        >
          <m.p variants={fadeUp} className="font-label uppercase tracking-[0.4em] text-gold text-xs mb-4">
            The Collections
          </m.p>
          <m.h2 variants={fadeUp} className="font-display font-bold italic text-cream text-5xl md:text-6xl leading-tight">
            Four Chapters,<br />One Story
          </m.h2>
        </m.div>

        {/* ─── Mobile Grid (2×2 + full-width) ──────────────────────── */}
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid md:hidden gap-4"
          style={{ gridTemplateColumns: '1fr 1fr' }}
        >
          {/* Executive Ring — tall, spans 2 rows */}
          {COLLECTIONS.slice(0, 3).map(({ id, name, price, img, imgAlt }, i) => (
            <m.div
              key={id}
              variants={scaleReveal}
              className={`relative rounded-xl overflow-hidden group cursor-pointer ${i === 0 ? 'row-span-2' : ''}`}
              style={{ height: i === 0 ? '300px' : '144px' }}
            >
              <m.div
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={img}
                  alt={imgAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 50vw, 200px"
                />
              </m.div>
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="font-display italic text-cream text-base leading-snug">{name}</h3>
                <p className="font-label text-gold text-[10px] tracking-wide mt-0.5">{price}</p>
              </div>
              <div className="absolute inset-0 border border-fern/30 rounded-xl group-hover:border-gold/30 transition-colors duration-500" />
            </m.div>
          ))}
          {/* Friday Set — full width */}
          <m.div
            variants={scaleReveal}
            className="col-span-2 relative rounded-xl overflow-hidden group cursor-pointer"
            style={{ height: '120px' }}
          >
            <m.div
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={COLLECTIONS[3].img}
                alt={COLLECTIONS[3].imgAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </m.div>
            <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="font-display italic text-cream text-base leading-snug">{COLLECTIONS[3].name}</h3>
              <p className="font-label text-gold text-[10px] tracking-wide mt-0.5">{COLLECTIONS[3].price}</p>
            </div>
            <div className="absolute inset-0 border border-fern/30 rounded-xl group-hover:border-gold/30 transition-colors duration-500" />
          </m.div>
        </m.div>

        {/* ─── Desktop Asymmetric Editorial Grid ───────────────────── */}
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="hidden md:grid gap-4"
          style={{
            gridTemplateAreas: `
              "hero    top-right"
              "hero    bottom-right"
              "full    full"
            `,
            gridTemplateColumns: '1.6fr 1fr',
            gridTemplateRows: '240px 240px 180px',
          }}
        >
          {COLLECTIONS.map(({ id, name, price, gridArea, img, imgAlt }) => (
            <m.div
              key={id}
              variants={scaleReveal}
              style={{ gridArea }}
              className="relative rounded-xl overflow-hidden group cursor-pointer"
            >
              <m.div
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={img}
                  alt={imgAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1280px) 60vw, 800px"
                />
              </m.div>
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display italic text-cream text-xl leading-snug">{name}</h3>
                <p className="font-label text-gold text-xs tracking-wide mt-1">{price}</p>
              </div>
              <div className="absolute inset-0 border border-fern/30 rounded-xl group-hover:border-gold/30 transition-colors duration-500" />
            </m.div>
          ))}
        </m.div>

        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-10 text-center"
        >
          <a
            href="/products"
            className="font-label uppercase tracking-widest text-xs text-gold border border-gold/50 px-7 py-3 hover:bg-gold hover:text-forest transition-all duration-300 inline-flex"
          >
            View All Collections
          </a>
        </m.div>
      </div>
    </section>
  )
}
