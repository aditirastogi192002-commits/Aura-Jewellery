'use client'

import { useEffect, useState, useCallback } from 'react'
import Image            from 'next/image'
import Link             from 'next/link'
import Script           from 'next/script'
import { useRouter }    from 'next/navigation'
import { Loader2, ShieldCheck, Lock, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice }  from '@/lib/supabase/types'

// ── Razorpay window type ─────────────────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: Record<string, any>) => { open(): void }
  }
}

// ── Cart types (mirrors /api/cart response) ──────────────────────────────────
interface CartProduct { id: string; name: string; slug: string; price: number; images: string[]; stock: number }
interface CartItem    { id: string; quantity: number; product: CartProduct }

export default function CheckoutPage() {
  const router = useRouter()

  const [items,       setItems]       = useState<CartItem[]>([])
  const [userEmail,   setUserEmail]   = useState('')
  const [userName,    setUserName]    = useState('')
  const [loading,     setLoading]     = useState(true)
  const [paying,      setPaying]      = useState(false)
  const [scriptReady, setScriptReady] = useState(false)
  const [error,       setError]       = useState('')

  // ── Auth + load cart ──────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login?next=/checkout'); return }

    setUserEmail(user.email ?? '')
    setUserName(user.user_metadata?.name ?? user.email?.split('@')[0] ?? '')

    const res = await fetch('/api/cart')
    if (!res.ok) { setError('Could not load cart.'); setLoading(false); return }
    const { items: data } = await res.json()

    if (!data || data.length === 0) { router.push('/cart'); return }
    setItems(data)
    setLoading(false)
  }, [router])

  useEffect(() => { loadData() }, [loadData])

  // ── Totals ────────────────────────────────────────────────────────────────
  const subtotal  = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const shipping  = subtotal >= 99900 ? 0 : 9900
  const total     = subtotal + shipping
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  // ── Pay handler ───────────────────────────────────────────────────────────
  async function handlePay() {
    if (!scriptReady) { setError('Payment gateway not ready. Please wait…'); return }
    setPaying(true)
    setError('')

    try {
      // 1 — Create Razorpay order on server
      const orderRes = await fetch('/api/checkout/create-order', { method: 'POST' })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error ?? 'Could not create order')

      const { razorpayOrderId, amount, currency, keyId } = orderData

      // 2 — Open Razorpay modal
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key:         keyId,
          amount,
          currency,
          order_id:    razorpayOrderId,
          name:        'AURA Jewellery',
          description: `${itemCount} item${itemCount > 1 ? 's' : ''}`,
          image:       '/favicon.ico',
          prefill: {
            name:  userName,
            email: userEmail,
          },
          theme: { color: '#C9A96E' },   // gold
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
          handler: async (response: {
            razorpay_order_id:   string
            razorpay_payment_id: string
            razorpay_signature:  string
          }) => {
            try {
              // 3 — Verify on server
              const verifyRes = await fetch('/api/checkout/verify', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(response),
              })
              const verifyData = await verifyRes.json()
              if (!verifyRes.ok) throw new Error(verifyData.error ?? 'Verification failed')
              resolve()
              // 4 — Redirect to orders
              router.push('/orders?success=true')
            } catch (e) {
              reject(e)
            }
          },
        })
        rzp.open()
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment failed'
      if (msg !== 'Payment cancelled') setError(msg)
    } finally {
      setPaying(false)
    }
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-forest flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-gold" />
      </main>
    )
  }

  return (
    <>
      {/* Razorpay script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />

      <main className="min-h-screen bg-forest">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="relative pt-28 pb-10 px-6 md:px-10 border-b border-fern/20">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald/40 to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto relative">
            <Link href="/cart" className="inline-flex items-center gap-2 font-label text-xs uppercase tracking-widest text-cream-muted hover:text-gold transition-colors mb-5">
              <ArrowLeft size={12} />
              Back to Bag
            </Link>
            <h1 className="font-display italic text-cream text-4xl md:text-5xl">Checkout</h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* ── Left: Order summary ─────────────────────────────── */}
            <div className="lg:col-span-3 space-y-0 divide-y divide-fern/20">
              <h2 className="font-label uppercase tracking-widest text-gold text-xs pb-4">
                Order Summary · {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </h2>

              {items.map((item) => {
                const img = item.product.images?.[0] ?? null
                return (
                  <div key={item.id} className="flex gap-4 py-5">
                    <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden bg-emerald">
                      {img && (
                        <Image src={img} alt={item.product.name} fill sizes="64px" className="object-cover" />
                      )}
                      {/* Qty badge */}
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gold text-forest font-label text-[9px] font-semibold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <p className="font-display italic text-cream text-base leading-tight">{item.product.name}</p>
                        <p className="font-label uppercase tracking-widest text-cream-muted/50 text-[9px] mt-0.5">{item.product.stock > 0 ? 'In stock' : 'Limited'}</p>
                      </div>
                      <p className="font-label text-cream text-sm">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                )
              })}

              {/* Pricing breakdown */}
              <div className="pt-5 space-y-2">
                <div className="flex justify-between font-label text-xs text-cream-muted uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-cream">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-label text-xs text-cream-muted uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : 'text-cream'}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-label text-sm text-gold uppercase tracking-widest border-t border-fern/20 pt-3 mt-1">
                  <span>Total</span>
                  <span className="text-xl">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* ── Right: Payment panel ────────────────────────────── */}
            <div className="lg:col-span-2">
              <div className="bg-emerald/50 border border-fern/30 p-6 sticky top-24">
                <h2 className="font-label uppercase tracking-widest text-gold text-xs mb-5 pb-4 border-b border-fern/30">
                  Payment
                </h2>

                {/* Account info */}
                <div className="mb-6 space-y-1">
                  <p className="font-label text-[10px] uppercase tracking-widest text-cream-muted">Paying as</p>
                  <p className="font-body text-cream text-sm truncate">{userName}</p>
                  <p className="font-body text-cream-muted text-xs truncate">{userEmail}</p>
                </div>

                {/* Amount */}
                <div className="bg-forest/50 border border-fern/20 px-5 py-4 mb-6 text-center">
                  <p className="font-label text-[10px] uppercase tracking-widest text-cream-muted mb-1">Amount Due</p>
                  <p className="font-display italic text-gold text-3xl">{formatPrice(total)}</p>
                </div>

                {error && (
                  <p className="font-label text-[10px] text-red-400 tracking-wide border border-red-800/40 bg-red-900/20 px-3 py-2 mb-4">
                    {error}
                  </p>
                )}

                {/* Pay button */}
                <button
                  onClick={handlePay}
                  disabled={paying || !scriptReady}
                  className="w-full flex items-center justify-center gap-3 font-label uppercase tracking-widest text-sm text-forest bg-gold px-6 py-4 hover:bg-gold-light transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {paying ? (
                    <><Loader2 size={15} className="animate-spin" /> Processing…</>
                  ) : !scriptReady ? (
                    <><Loader2 size={15} className="animate-spin" /> Loading…</>
                  ) : (
                    <><Lock size={14} /> Pay {formatPrice(total)}</>
                  )}
                </button>

                {/* Trust */}
                <div className="mt-5 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-cream-muted/50">
                    <ShieldCheck size={13} className="text-green-500/70" />
                    <span className="font-label text-[9px] uppercase tracking-widest">
                      Secured by Razorpay
                    </span>
                  </div>
                  <p className="font-label text-[9px] text-cream-muted/40 uppercase tracking-widest text-center">
                    UPI · Cards · Net Banking · Wallets
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
