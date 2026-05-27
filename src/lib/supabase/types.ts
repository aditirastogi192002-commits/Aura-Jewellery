// ─── Supabase Database Types ──────────────────────────────────────────────────
// Manually typed to match the SQL schema in supabase/schema.sql
// Run `npx supabase gen types typescript` to auto-generate once CLI is set up

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface Profile {
  id: string           // matches auth.users.id (uuid)
  name: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number        // in paise (₹3499 → 349900)
  images: string[]
  category: string     // 'ring' | 'cuff' | 'pendant' | 'set'
  stock: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Cart {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  items?: CartItem[]   // joined
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product    // joined
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total: number        // in paise
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  razorpay_signature: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]  // joined
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number  // snapshot in paise
  product?: Product          // joined
}

// ─── Helper: paise → formatted rupees ────────────────────────────────────────
export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`
}
