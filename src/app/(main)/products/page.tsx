// /products — Server Component product listing page
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/supabase/types'
import { formatPrice } from '@/lib/supabase/types'
import Image from 'next/image'
import Link from 'next/link'
import AuraLogo from '@/components/AuraLogo'

const CATEGORIES = [
  { value: 'all',     label: 'All Pieces' },
  { value: 'ring',    label: 'Rings' },
  { value: 'cuff',    label: 'Cuffs' },
  { value: 'pendant', label: 'Pendants' },
  { value: 'set',     label: 'Sets' },
]

async function getProducts(category?: string): Promise<Product[]> {
  const supabase = createClient()
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const activeCategory = searchParams.category ?? 'all'
  const products = await getProducts(activeCategory)

  return (
    <main className="min-h-screen bg-forest">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="relative pt-28 pb-14 px-6 md:px-10 text-center border-b border-fern/20">
        {/* subtle texture line */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald/40 to-transparent pointer-events-none" />

        <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group">
          <AuraLogo size={28} showWordmark={false} />
          <span className="font-label tracking-[0.38em] text-gold text-sm">AURA</span>
        </Link>

        <h1 className="font-display text-4xl md:text-6xl text-cream italic mb-3">
          The Collection
        </h1>
        <p className="font-body text-cream-muted text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Sterling silver jewellery designed for the modern working woman.
        </p>

        {/* ── Category filter tabs ───────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={cat.value === 'all' ? '/products' : `/products?category=${cat.value}`}
              className={`font-label uppercase tracking-widest text-xs px-5 py-2 border transition-all duration-300 ${
                activeCategory === cat.value
                  ? 'bg-gold text-forest border-gold'
                  : 'border-fern/40 text-cream-muted hover:border-gold hover:text-gold'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Product Grid ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-3xl text-cream-muted italic">No pieces found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

// ── ProductCard ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images?.[0] ?? null

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-emerald">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gold overlay on hover */}
            <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-500" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <AuraLogo size={48} showWordmark={false} />
          </div>
        )}

        {/* Stock badge */}
        {product.stock <= 10 && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-gold/90 text-forest font-label text-[9px] tracking-widest uppercase px-2 py-1">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-forest/60">
            <span className="font-label uppercase tracking-widest text-xs text-cream-muted border border-fern/40 px-4 py-2">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-display italic text-cream text-lg leading-tight group-hover:text-gold transition-colors duration-300">
            {product.name}
          </h2>
          <span className="font-label text-gold text-sm whitespace-nowrap pt-0.5">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="font-label uppercase tracking-widest text-cream-muted/60 text-[10px] mt-1">
          {product.category}
        </p>
        <p className="font-body text-cream-muted text-xs mt-2 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* CTA line */}
      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="font-label uppercase tracking-widest text-gold text-[10px]">View Details</span>
        <span className="text-gold text-xs">→</span>
      </div>
    </Link>
  )
}
