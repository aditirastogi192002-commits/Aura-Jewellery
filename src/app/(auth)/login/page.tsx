'use client'

// ─── Login Page ───────────────────────────────────────────────────────────────

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ── Inner form — uses useSearchParams (must be inside Suspense) ───────────────
function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const next         = searchParams.get('next') || '/'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <p className="font-label uppercase tracking-[0.4em] text-gold text-xs mb-3">
          Welcome back
        </p>
        <h1 className="font-display italic font-bold text-cream text-3xl leading-tight">
          Sign in to<br />your account
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label uppercase tracking-widest text-cream-muted text-[10px]">
            Email
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="bg-forest/60 border border-fern/40 text-cream placeholder-cream-muted/40
                       font-body text-sm px-4 py-3 rounded-none
                       focus:outline-none focus:border-gold/60 transition-colors duration-300"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label uppercase tracking-widest text-cream-muted text-[10px]">
            Password
          </label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-forest/60 border border-fern/40 text-cream placeholder-cream-muted/40
                         font-body text-sm px-4 py-3 pr-11 rounded-none
                         focus:outline-none focus:border-gold/60 transition-colors duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-muted hover:text-gold transition-colors"
              tabIndex={-1}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="font-label text-xs text-red-400 border border-red-400/30 bg-red-400/10 px-3 py-2">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 bg-gold text-forest font-label uppercase tracking-widest text-xs
                     px-6 py-3.5 hover:bg-gold-light transition-colors duration-300
                     disabled:opacity-60 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      {/* Divider */}
      <div className="h-px bg-fern/20 my-6" />

      {/* Register link */}
      <p className="font-body text-cream-muted text-sm text-center">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-gold hover:text-gold-light transition-colors duration-300 underline underline-offset-2"
        >
          Create one
        </Link>
      </p>
    </>
  )
}

// ── Page export — wraps form in Suspense (required by Next.js 14) ─────────────
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gold" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
