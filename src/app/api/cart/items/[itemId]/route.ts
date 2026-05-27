// PATCH  /api/cart/items/:itemId  → update quantity  { quantity: number }
// DELETE /api/cart/items/:itemId  → remove item
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ── Verify the cart item belongs to the current user ─────────────────────────
async function verifyOwnership(supabase: ReturnType<typeof createClient>, itemId: string, userId: string) {
  const { data } = await supabase
    .from('cart_items')
    .select('id, cart:carts!inner(user_id)')
    .eq('id', itemId)
    .eq('carts.user_id', userId)
    .maybeSingle()
  return !!data
}

export async function PATCH(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const quantity = Number(body.quantity)

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    return NextResponse.json({ error: 'Quantity must be between 1 and 99' }, { status: 400 })
  }

  const owns = await verifyOwnership(supabase, params.itemId, user.id)
  if (!owns) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', params.itemId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: { itemId: string } }
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owns = await verifyOwnership(supabase, params.itemId, user.id)
  if (!owns) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', params.itemId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
