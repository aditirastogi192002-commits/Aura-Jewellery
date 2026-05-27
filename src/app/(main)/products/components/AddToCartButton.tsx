'use client'

import { useState } from 'react'
import { ShoppingBag, Loader2, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  productId: string
  stock: number
}

export default function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  async function handleAddToCart() {
    setState('loading')
    setErrorMsg('')

    const supabase = createClient()

    // ── Check auth ─────────────────────────────────────────────────────────
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push(`/login?next=/products`)
      return
    }

    try {
      // ── Get or create cart ──────────────────────────────────────────────
      const { data: existingCart, error: cartErr } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (cartErr) throw cartErr

      let cartId: string
      if (existingCart) {
        cartId = existingCart.id
      } else {
        const { data: newCart, error: createErr } = await supabase
          .from('carts')
          .insert({ user_id: user.id })
          .select('id')
          .single()
        if (createErr) throw createErr
        cartId = newCart.id
      }

      // ── Check if item already in cart ───────────────────────────────────
      const { data: existing, error: existErr } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cartId)
        .eq('product_id', productId)
        .maybeSingle()

      if (existErr) throw existErr

      if (existing) {
        // Increment quantity
        const { error: updateErr } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + 1 })
          .eq('id', existing.id)
        if (updateErr) throw updateErr
      } else {
        // Insert new item
        const { error: insertErr } = await supabase
          .from('cart_items')
          .insert({ cart_id: cartId, product_id: productId, quantity: 1 })
        if (insertErr) throw insertErr
      }

      setState('success')
      setTimeout(() => setState('idle'), 2500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add to cart'
      setErrorMsg(msg)
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  const outOfStock = stock === 0

  return (
    <div className="space-y-2">
      <button
        onClick={handleAddToCart}
        disabled={outOfStock || state === 'loading' || state === 'success'}
        className={`w-full flex items-center justify-center gap-3 font-label uppercase tracking-widest text-sm px-8 py-4 transition-all duration-300 disabled:cursor-not-allowed ${
          outOfStock
            ? 'bg-fern/20 text-cream-muted/40 border border-fern/20 cursor-not-allowed'
            : state === 'success'
            ? 'bg-green-800/60 text-green-300 border border-green-600/40'
            : state === 'error'
            ? 'bg-red-900/40 text-red-300 border border-red-600/40'
            : 'bg-gold text-forest hover:bg-gold-light border border-gold'
        }`}
      >
        {state === 'loading' && <Loader2 size={16} className="animate-spin" />}
        {state === 'success' && <Check size={16} />}
        {(state === 'idle' || state === 'error') && !outOfStock && <ShoppingBag size={16} />}

        {outOfStock
          ? 'Sold Out'
          : state === 'loading'
          ? 'Adding…'
          : state === 'success'
          ? 'Added to Bag'
          : state === 'error'
          ? 'Try Again'
          : 'Add to Bag'}
      </button>

      {state === 'error' && errorMsg && (
        <p className="font-label text-[10px] text-red-400 tracking-wide text-center">{errorMsg}</p>
      )}
    </div>
  )
}
