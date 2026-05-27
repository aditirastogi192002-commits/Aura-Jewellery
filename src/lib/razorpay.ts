import Razorpay from 'razorpay'

// Server-side only — never import this in client components
// Lazily initialized so env vars are always fresh at call time
export function getRazorpay() {
  const key_id     = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET

  if (!key_id || key_id.includes('XXXX')) {
    throw new Error('RAZORPAY_KEY_ID is not configured in .env.local')
  }
  if (!key_secret || key_secret.includes('PASTE')) {
    throw new Error('RAZORPAY_KEY_SECRET is not configured in .env.local')
  }

  return new Razorpay({ key_id, key_secret })
}
