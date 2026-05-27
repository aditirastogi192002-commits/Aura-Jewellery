// /products/[slug] — Server Component product detail page
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/supabase/types'
import { formatPrice } from '@/lib/supabase/types'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '@/app/(main)/products/components/AddToCartButton'
import { Shield, Truck, RefreshCw, Award } from 'lucide-react'

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  if (!product) return { title: 'Product Not Found — AURA' }
  return {
    title: `${product.name} — AURA Silver Jewellery`,
    description: product.description,
  }
}

const TRUST_BADGES = [
  { icon: Shield,    label: '925 Sterling Silver',  sub: 'Hallmarked & certified' },
  { icon: Truck,     label: 'Free Shipping',         sub: 'On orders above ₹999' },
  { icon: RefreshCw, label: '30-Day Returns',        sub: 'Hassle-free exchanges' },
  { icon: Award,     label: '1-Year Warranty',       sub: 'Against craft defects' },
]

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const imageUrl = product.images?.[0] ?? null

  return (
    <div className="min-h-screen bg-forest">
      {/* ── Breadcrumb nav ──────────────────────────────────────────── */}
      <nav className="px-6 md:px-10 pt-24 pb-4 flex items-center gap-2 max-w-7xl mx-auto">
        <Link
          href="/"
          className="font-label text-[10px] tracking-widest text-cream-muted uppercase hover:text-gold transition-colors"
        >
          Home
        </Link>
        <span className="text-fern/40 text-xs">/</span>
        <Link
          href="/products"
          className="font-label text-[10px] tracking-widest text-cream-muted uppercase hover:text-gold transition-colors"
        >
          Collection
        </Link>
        <span className="text-fern/40 text-xs">/</span>
        <span className="font-label text-[10px] tracking-widest text-gold uppercase">
          {product.name}
        </span>
      </nav>

      {/* ── Main content ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* ── Left: Image ─────────────────────────────────────────── */}
          <div className="relative">
            <div className="aspect-square relative overflow-hidden bg-emerald">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20">
                  <span className="font-display italic text-cream text-6xl">AURA</span>
                </div>
              )}
              <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/40 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold/40 pointer-events-none" />
            </div>
            <div className="absolute top-6 right-6">
              <span className="font-label uppercase tracking-widest text-[9px] bg-forest/80 backdrop-blur-sm border border-fern/30 text-gold px-3 py-1.5">
                {product.category}
              </span>
            </div>
          </div>

          {/* ── Right: Details ──────────────────────────────────────── */}
          <div className="flex flex-col justify-center">
            <div className="border-b border-fern/20 pb-6 mb-6">
              <h1 className="font-display italic text-cream text-4xl md:text-5xl leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="font-label text-gold text-3xl tracking-wide">
                  {formatPrice(product.price)}
                </span>
                {product.stock > 0 && product.stock <= 10 && (
                  <span className="font-label text-[10px] uppercase tracking-widest text-amber-400 border border-amber-400/40 px-2 py-1">
                    Only {product.stock} left
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="font-label text-[10px] uppercase tracking-widest text-red-400 border border-red-400/40 px-2 py-1">
                    Sold Out
                  </span>
                )}
              </div>
            </div>

            <p className="font-body text-cream-muted leading-relaxed text-base mb-8">
              {product.description}
            </p>

            <div className="flex items-center gap-3 bg-emerald/60 border border-fern/20 px-5 py-3 mb-8">
              <div className="w-1.5 h-10 bg-gold/60 flex-shrink-0" />
              <div>
                <p className="font-label text-gold text-[10px] uppercase tracking-widest mb-0.5">Material</p>
                <p className="font-body text-cream-muted text-sm">
                  925 Sterling Silver — tarnish-resistant, hypoallergenic finish
                </p>
              </div>
            </div>

            <div className="mb-8">
              <AddToCartButton productId={product.id} stock={product.stock} />
            </div>

            <Link
              href="/cart"
              className="text-center font-label uppercase tracking-widest text-xs text-cream-muted hover:text-gold transition-colors duration-300 underline underline-offset-4 decoration-fern/40 hover:decoration-gold/60 mb-10"
            >
              View Bag
            </Link>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-fern/20">
              {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={15} className="text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-label text-cream text-[10px] uppercase tracking-widest leading-tight">{label}</p>
                    <p className="font-body text-cream-muted text-[10px] mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-fern/20 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-label uppercase tracking-widest text-xs text-cream-muted hover:text-gold transition-colors duration-300"
          >
            <span>←</span>
            <span>Back to Collection</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
