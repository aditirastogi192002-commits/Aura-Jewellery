'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import Image           from 'next/image'
import Link            from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  CheckCircle2, Package, Loader2, ChevronDown, ChevronUp,
  ShoppingBag, ArrowRight, Clock
} from 'lucide-react'
import { formatPrice }  from '@/lib/supabase/types'
import type { OrderStatus } from '@/lib/supabase/types'

// ── Types ────────────────────────────────────────────────────────────────────
interface OrderProduct { id: string; name: string; slug: string; images: string[]; category: string }
interface OrderItem    { id: string; quantity: number; price_at_purchase: number; product: OrderProduct }
interface Order {
  id: string
  status: OrderStatus
  total: number
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  created_at: string
  items: OrderItem[]
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  PENDING:   { label: 'Pending',   color: 'text-amber-400  border-amber-400/40  bg-amber-400/10',  dot: 'bg-amber-400' },
  PAID:      { label: 'Confirmed', color: 'text-green-400  border-green-400/40  bg-green-400/10',  dot: 'bg-green-400' },
  SHIPPED:   { label: 'Shipped',   color: 'text-sky-400    border-sky-400/40    bg-sky-400/10',    dot: 'bg-sky-400'   },
  DELIVERED: { label: 'Delivered', color: 'text-gold       border-gold/40       bg-gold/10',       dot: 'bg-gold'      },
  CANCELLED: { label: 'Cancelled', color: 'text-red-400    border-red-400/40    bg-red-400/10',    dot: 'bg-red-400'   },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ── Inner component (needs useSearchParams → must be wrapped in Suspense) ────
function OrdersContent() {
  const searchParams = useSearchParams()
  const justPaid = searchParams.get('success') === 'true'

  const [orders,   setOrders]   = useState<Order[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders')
      if (!res.ok) throw new Error('Failed to load orders')
      const data: Order[] = await res.json()
      setOrders(data)
      // Auto-expand the latest order on success redirect
      if (justPaid && data.length > 0) {
        setExpanded(new Set([data[0].id]))
      }
    } catch {
      setError('Could not load your orders. Please refresh.')
    } finally {
      setLoading(false)
    }
  }, [justPaid])

  useEffect(() => { loadOrders() }, [loadOrders])

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-forest flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={28} className="animate-spin text-gold" />
          <p className="font-label text-cream-muted text-xs uppercase tracking-widest">Loading orders…</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-forest">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="relative pt-28 pb-10 px-6 md:px-10 border-b border-fern/20">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald/40 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <h1 className="font-display italic text-cream text-4xl md:text-5xl">My Orders</h1>
          {orders.length > 0 && (
            <p className="font-label text-cream-muted text-xs uppercase tracking-widest mt-2">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">

        {/* ── Success banner ──────────────────────────────────────── */}
        {justPaid && (
          <div className="flex items-start gap-4 bg-green-900/30 border border-green-600/30 px-5 py-4 mb-8">
            <CheckCircle2 size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-label text-green-400 text-xs uppercase tracking-widest">Payment successful</p>
              <p className="font-body text-cream-muted text-sm mt-0.5">
                Your order has been confirmed. We&apos;ll get your jewellery ready to ship.
              </p>
            </div>
          </div>
        )}

        {error && (
          <p className="font-label text-xs text-red-400 border border-red-800/40 bg-red-900/20 px-4 py-3 mb-6">{error}</p>
        )}

        {/* ── Empty state ──────────────────────────────────────────── */}
        {orders.length === 0 && !loading && (
          <div className="text-center py-28">
            <ShoppingBag size={48} className="text-fern/30 mx-auto mb-6" />
            <h2 className="font-display italic text-cream text-3xl mb-3">No orders yet</h2>
            <p className="font-body text-cream-muted text-sm mb-8 max-w-xs mx-auto">
              Your order history will appear here after your first purchase.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-label uppercase tracking-widest text-xs text-forest bg-gold px-8 py-3.5 hover:bg-gold-light transition-colors duration-300"
            >
              Shop the Collection <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* ── Order list ───────────────────────────────────────────── */}
        <div className="space-y-4">
          {orders.map((order) => {
            const cfg       = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING
            const isOpen    = expanded.has(order.id)
            const thumbs    = order.items.slice(0, 4)
            const extraCount = order.items.length - 4

            return (
              <div key={order.id} className="border border-fern/25 bg-emerald/20 overflow-hidden">

                {/* ── Order header row ──────────────────────────── */}
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-fern/5 transition-colors duration-200 text-left"
                >
                  {/* Thumbnails strip */}
                  <div className="flex -space-x-2 flex-shrink-0">
                    {thumbs.map((item, i) => {
                      const img = item.product?.images?.[0]
                      return (
                        <div
                          key={item.id}
                          className="relative w-10 h-10 rounded-sm overflow-hidden border border-fern/30 bg-emerald flex-shrink-0"
                          style={{ zIndex: thumbs.length - i }}
                        >
                          {img ? (
                            <Image src={img} alt={item.product.name} fill sizes="40px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={14} className="text-fern/40" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                    {extraCount > 0 && (
                      <div className="w-10 h-10 rounded-sm bg-forest border border-fern/30 flex items-center justify-center flex-shrink-0">
                        <span className="font-label text-[9px] text-cream-muted">+{extraCount}</span>
                      </div>
                    )}
                  </div>

                  {/* Order meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-label text-cream text-xs uppercase tracking-widest">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      {/* Status badge */}
                      <span className={`inline-flex items-center gap-1.5 font-label text-[9px] uppercase tracking-widest border px-2 py-0.5 ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <p className="font-body text-cream-muted text-xs flex items-center gap-1.5">
                        <Clock size={10} className="opacity-50" />
                        {formatDate(order.created_at)}
                      </p>
                      <p className="font-body text-cream-muted text-xs">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>

                  {/* Total + chevron */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-label text-gold text-sm">{formatPrice(order.total)}</span>
                    {isOpen
                      ? <ChevronUp size={14} className="text-cream-muted" />
                      : <ChevronDown size={14} className="text-cream-muted" />
                    }
                  </div>
                </button>

                {/* ── Expanded order details ────────────────────── */}
                {isOpen && (
                  <div className="border-t border-fern/20 px-5 py-5 space-y-0 divide-y divide-fern/10">

                    {/* Items */}
                    {order.items.map((item) => {
                      const img = item.product?.images?.[0]
                      return (
                        <div key={item.id} className="flex gap-4 py-4">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-emerald group"
                          >
                            {img ? (
                              <Image
                                src={img} alt={item.product.name}
                                fill sizes="56px"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={16} className="text-fern/30" />
                              </div>
                            )}
                          </Link>

                          <div className="flex-1 min-w-0 flex justify-between items-start">
                            <div>
                              <Link
                                href={`/products/${item.product.slug}`}
                                className="font-display italic text-cream text-base leading-tight hover:text-gold transition-colors duration-300"
                              >
                                {item.product.name}
                              </Link>
                              <p className="font-label uppercase tracking-widest text-cream-muted/40 text-[9px] mt-0.5">
                                {item.product.category} · Qty {item.quantity}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                              <p className="font-label text-cream text-xs">{formatPrice(item.price_at_purchase * item.quantity)}</p>
                              {item.quantity > 1 && (
                                <p className="font-body text-cream-muted/40 text-[10px] mt-0.5">
                                  {formatPrice(item.price_at_purchase)} each
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Order summary footer */}
                    <div className="pt-4 space-y-1.5">
                      <div className="flex justify-between font-label text-[10px] uppercase tracking-widest text-cream-muted">
                        <span>Order total</span>
                        <span className="text-gold text-sm">{formatPrice(order.total)}</span>
                      </div>
                      {order.razorpay_payment_id && (
                        <div className="flex justify-between font-label text-[10px] uppercase tracking-widest text-cream-muted/50">
                          <span>Payment ID</span>
                          <span className="font-mono text-[9px] normal-case tracking-normal">
                            {order.razorpay_payment_id}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Continue shopping ──────────────────────────────────── */}
        {orders.length > 0 && (
          <div className="mt-10 pt-8 border-t border-fern/20 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-label uppercase tracking-widest text-xs text-cream-muted hover:text-gold transition-colors duration-300"
            >
              ← Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

// ── Page export with Suspense (required for useSearchParams) ─────────────────
export default function OrdersPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-forest flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-gold" />
      </main>
    }>
      <OrdersContent />
    </Suspense>
  )
}
