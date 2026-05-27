// POST /api/checkout/verify
// 1. Verifies Razorpay HMAC signature
// 2. Saves order + order_items in Supabase
// 3. Clears the cart
import { createClient }  from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse }   from 'next/server'
import crypto             from 'crypto'

interface VerifyBody {
  razorpay_order_id:   string
  razorpay_payment_id: string
  razorpay_signature:  string
}

export async function POST(request: Request) {
  const supabase = createClient()

  // ── Auth ────────────────────────────────────────────────────────────────
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body: VerifyBody = await request.json()
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 })
  }

  // ── Verify HMAC signature ────────────────────────────────────────────────
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSig !== razorpay_signature) {
    return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
  }

  // ── Load cart ────────────────────────────────────────────────────────────
  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 })

  const { data: cartItems, error: cartErr } = await supabase
    .from('cart_items')
    .select('id, quantity, product:products ( id, price )')
    .eq('cart_id', cart.id)

  if (cartErr || !cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const totalPaise = cartItems.reduce((sum, item) => {
    const product = (item.product as unknown) as { id: string; price: number } | null
    return sum + (product?.price ?? 0) * item.quantity
  }, 0)

  // ── Create order in DB (use admin client to bypass RLS insert policies) ──
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id:             user.id,
      status:              'PAID',
      total:               totalPaise,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    })
    .select('id')
    .single()

  if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 })

  // ── Create order_items ───────────────────────────────────────────────────
  const orderItems = cartItems.map((item) => {
    const product = (item.product as unknown) as { id: string; price: number } | null
    return {
      order_id:           order.id,
      product_id:         product!.id,
      quantity:           item.quantity,
      price_at_purchase:  product!.price,
    }
  })

  const { error: itemsErr } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems)

  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 })

  // ── Clear cart ───────────────────────────────────────────────────────────
  await supabaseAdmin.from('cart_items').delete().eq('cart_id', cart.id)

  return NextResponse.json({ success: true, orderId: order.id })
}
