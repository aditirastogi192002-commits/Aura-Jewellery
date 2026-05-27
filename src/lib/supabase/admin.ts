// ─── Supabase Admin Client ────────────────────────────────────────────────────
// Uses SERVICE ROLE key — bypasses Row Level Security
// ONLY use in server-side API routes, NEVER expose to browser

import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
