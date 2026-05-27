'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, Loader2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/supabase/types'
import AuraLogo from '@/components/AuraLogo'

// ── Types ────────────────────────────────────────────────────────────────────
interface CartProduct {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  category: string
  stock: number
}

interface CartItem {
  id: string
  quantity: number
  product: CartProduct
}

// ── Helpers ──────────────────────────────────────────────────────────────────
async function fetchCart(): Promise<{ cartId: string; items: CartItem[] }> {
  const res = await fetch('/api/cart')
  if (!res.ok) throw new Error('Failed to load cart')
  return res.json()
}

async function updateQty(itemId: string, quantity: number) {
  const res = await fetch(`/api/cart/items/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  })
  if (!res.ok) throw new Error('Failed to update quantity')
}

async function removeItem(itemId: string) {
  const res = await fetch(`/api/cart/items/${itemId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to remove item')
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const [items, setItems]         = useState<CartItem[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [updating, setUpdating]   = useState<string | null>(null)   // itemId being mutated

  // ── Auth guard (middleware handles redirect, this is a UI fallback) ────────
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = '/login?next=/cart'
    })
  }, [])

  const loadCart = useCallback(async () => {
    try {
      setLoading(true)
      const { items: data } = await fetchCart()
      setItems(data)
    } catch {
      setError('Could not load your bag. Please refresh.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadCart() }, [loadCart])

  // ── Quantity change ───────────────────────────────────────────────────────
  async function handleQtyChange(itemId: string, newQty: number) {
    if (newQty < 1) return handleRemove(itemId)
    setUpdating(itemId)
    try {
      await updateQty(itemId, newQty)
      setItems(prev =>
        prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i)
      )
    } catch {
      setError('Failed to update quantity.')
    } finally {
      setUpdating(null)
    }
  }

  // ── Remove item ───────────────────────────────────────────────────────────
  async function handleRemove(itemId: string) {
    setUpdating(itemId)
    try {
      await removeItem(itemId)
      setItems(prev => prev.filter(i => i.id !== itemId))
    } catch {
      setError('Failed to remove item.')
    } finally {
      setUpdating(null)
    }
  }

  // ── Totals ────────────────────────────────────────────────────────────────
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-forest flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AuraLogo size={40} showWordmark={false} />
          <Loader2 size={22} className="animate-spin text-gold" />
          <p className="font-label text-cream-muted text-xs uppercase tracking-widest">Loading your bag…</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-forest">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="relative pt-28 pb-10 px-6 md:px-10 border-b border-fern/20">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald/40 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto flex items-end justify-between relative">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <AuraLogo size={22} showWordmark={false} />
              <span className="font-label tracking-[0.38em] text-gold text-xs group-hover:text-gold-light transition-colors">
                AURA
              </span>
            </Link>
            <h1 className="font-display italic text-cream text-4xl md:text-5xl">
              Your Bag
            </h1>
            {itemCount > 0 && (
              <p className="font-label text-cream-muted text-xs uppercase tracking-widest mt-2">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
          <Link
            href="/products"
            className="hidden md:flex items-center gap-2 font-label uppercase tracking-widest text-xs text-cream-muted hover:text-gold transition-colors duration-300 mb-1"
          >
            <span>← Continue Shopping</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-6">
          <p className="font-label text-xs text-red-400 tracking-wide border border-red-800/40 bg-red-900/20 px-4 py-3">{error}</p>
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────────────── */}
      {!loading && items.length === 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-32 text-center">
          <ShoppingBag size={48} className="text-fern/40 mx-auto mb-6" />
          <h2 className="font-display italic text-cream text-3xl mb-3">Your bag is empty</h2>
          <p className="font-body text-cream-muted text-sm mb-8 max-w-xs mx-auto">
            Discover our sterling silver pieces crafted for the modern working woman.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-label uppercase tracking-widest text-xs text-forest bg-gold px-8 py-3.5 hover:bg-gold-light transition-colors duration-300"
          >
            Shop the Collection
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* ── Cart content ───────────────────────────────────────────── */}
      {items.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-16">

            {/* ── Items list ──────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-0 divide-y divide-fern/20">
              {items.map((item) => {
                const busy = updating === item.id
                const img  = item.product.images?.[0] ?? null

                return (
                  <div
                    key={item.id}
                    className={`flex gap-5 py-6 transition-opacity duration-300 ${busy ? 'opacity-50' : 'opacity-100'}`}
                  >
                    {/* Product image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="relative flex-shrink-0 w-24 h-24 md:w-28 md:h-28 overflow-hidden bg-emerald group"
                    >
                      {img ? (
                        <Image
                          src={img}
                          alt={item.product.name}
                          fill
                          sizes="112px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <AuraLogo size={28} showWordmark={false} />
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-display italic text-cream text-lg leading-tight hover:text-gold transition-colors duration-300"
                        >
                          {item.product.name}
                        </Link>
                        <p className="font-label uppercase tracking-widest text-cream-muted/50 text-[10px] mt-0.5">
                          {item.product.category}
                        </p>
                        <p className="font-label text-gold text-sm mt-1">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* Quantity controls + remove */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-fern/40">
                          <button
                            onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                            disabled={busy}
                            aria-label="Decrease quantity"
                            className="w-8 h-8 flex items-center justify-center text-cream-muted hover:text-gold hover:bg-fern/10 transition-colors duration-200 disabled:opacity-40"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center font-label text-cream text-xs border-x border-fern/40">
                            {busy ? <Loader2 size={11} className="animate-spin" /> : item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                            disabled={busy || item.quantity >= item.product.stock}
                            aria-label="Increase quantity"
                            className="w-8 h-8 flex items-center justify-center text-cream-muted hover:text-gold hover:bg-fern/10 transition-colors duration-200 disabled:opacity-40"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={busy}
                          aria-label="Remove item"
                          className="flex items-center gap-1.5 font-label text-[10px] uppercase tracking-widest text-cream-muted/50 hover:text-red-400 transition-colors duration-200 disabled:opacity-40"
                        >
                          <Trash2 size={11} />
                          Remove
                        </button>

                        {/* Line total */}
                        <span className="ml-auto font-label text-cream text-sm">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Order summary ────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-emerald/50 border border-fern/30 p-6 sticky top-24">
                <h2 className="font-label uppercase tracking-widest text-gold text-xs mb-5 pb-4 border-b border-fern/30">
                  Order Summary
                </h2>

                {/* Line items summary */}
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="font-body text-cream-muted text-xs truncate pr-3 max-w-[60%]">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-label text-cream text-xs">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-fern/30 pt-4 mb-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-label uppercase tracking-widest text-cream-muted text-[10px]">Subtotal</span>
                    <span className="font-label text-cream text-sm">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-label uppercase tracking-widest text-cream-muted text-[10px]">Shipping</span>
                    <span className="font-label text-green-400 text-[10px] uppercase tracking-widest">
                      {subtotal >= 99900 ? 'Free' : formatPrice(9900)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-fern/30 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-label uppercase tracking-widest text-cream text-xs">Total</span>
                    <span className="font-label text-gold text-xl">
                      {formatPrice(subtotal >= 99900 ? subtotal : subtotal + 9900)}
                    </span>
                  </div>
                  {subtotal < 99900 && (
                    <p className="font-body text-cream-muted/60 text-[10px] mt-1.5 text-right">
                      Add {formatPrice(99900 - subtotal)} more for free shipping
                    </p>
                  )}
                </div>

                {/* Checkout button — Phase 5 will wire Razorpay */}
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 font-label uppercase tracking-widest text-sm text-forest bg-gold px-6 py-4 hover:bg-gold-light transition-colors duration-300"
                >
                  Proceed to Checkout
                  <ArrowRight size={14} />
                </Link>

                <Link
                  href="/products"
                  className="mt-4 w-full flex items-center justify-center font-label uppercase tracking-widest text-xs text-cream-muted hover:text-gold transition-colors duration-300"
                >
                  ← Continue Shopping
                </Link>

                {/* Trust badges */}
                <div className="mt-6 pt-5 border-t border-fern/20 space-y-2">
                  {['925 Sterling Silver — Certified', 'Free returns within 30 days', 'Secure checkout'].map((t) => (
                    <p key={t} className="font-label text-[9px] text-cream-muted/50 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gold/40 flex-shrink-0" />
                      {t}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
