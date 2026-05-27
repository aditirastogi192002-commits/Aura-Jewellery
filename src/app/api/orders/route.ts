// GET /api/orders — authenticated user's full order history
import { createClient } from '@/lib/supabase/server'
import { NextResponse }  from 'next/server'

export async function GET() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      total,
      razorpay_order_id,
      razorpay_payment_id,
      created_at,
      items:order_items (
        id,
        quantity,
        price_at_purchase,
        product:products ( id, name, slug, images, category )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(orders ?? [])
}
