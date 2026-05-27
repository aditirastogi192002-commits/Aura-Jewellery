// POST /api/checkout/create-order
// Creates a Razorpay order from the user's current cart
import { createClient } from '@/lib/supabase/server'
import { getRazorpay }  from '@/lib/razorpay'
import { NextResponse }  from 'next/server'

export async function POST() {
  const supabase = createClient()

  // ── Auth ────────────────────────────────────────────────────────────────
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // ── Fetch cart + items ───────────────────────────────────────────────────
  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!cart) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })

  const { data: items, error: itemsErr } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      product:products ( id, name, price, stock )
    `)
    .eq('cart_id', cart.id)

  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 })
  if (!items || items.length === 0) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })

  // ── Validate stock & compute total ───────────────────────────────────────
  type ProductSnap = { id: string; name: string; price: number; stock: number }

  for (const item of items) {
    const product = (item.product as unknown) as ProductSnap | null
    if (!product) continue
    if (item.quantity > product.stock) {
      return NextResponse.json(
        { error: `"${product.name}" only has ${product.stock} in stock` },
        { status: 400 }
      )
    }
  }

  const totalPaise = items.reduce((sum, item) => {
    const product = (item.product as unknown) as { price: number } | null
    return sum + (product?.price ?? 0) * item.quantity
  }, 0)

  if (totalPaise <= 0) return NextResponse.json({ error: 'Invalid cart total' }, { status: 400 })

  // ── Create Razorpay order ────────────────────────────────────────────────
  try {
    const razorpay = getRazorpay()
    console.log('[create-order] key_id prefix:', process.env.RAZORPAY_KEY_ID?.slice(0, 14))
    const rzpOrder = await razorpay.orders.create({
      amount:   totalPaise,        // already in paise
      currency: 'INR',
      receipt:  `rcpt_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        userId: user.id,
        cartId: cart.id,
      },
    })

    return NextResponse.json({
      razorpayOrderId: rzpOrder.id,
      amount:          rzpOrder.amount,   // paise
      currency:        rzpOrder.currency,
      keyId:           process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (err: unknown) {
    // Surface the real Razorpay error (e.g. bad credentials, network issue)
    let message = 'Razorpay error'
    if (err instanceof Error) {
      message = err.message
    } else if (typeof err === 'object' && err !== null && 'error' in err) {
      const rzpErr = (err as { error?: { description?: string } }).error
      message = rzpErr?.description ?? JSON.stringify(err)
    }
    console.error('[create-order]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
