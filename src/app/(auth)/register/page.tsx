'use client'

// ─── Register Page ────────────────────────────────────────────────────────────

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [success, setSuccess]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },                    // saved to profiles via DB trigger
        emailRedirectTo: `${window.location.origin}/`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // If session exists → email confirmation is OFF → redirect immediately
    // If no session → confirmation email sent → show success screen
    if (data.session) {
      router.push('/')
      router.refresh()
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex flex-col items-center text-center gap-5 py-4">
        <CheckCircle2 size={48} className="text-gold" strokeWidth={1.2} />
        <div>
          <h2 className="font-display italic font-bold text-cream text-2xl mb-2">
            Check your inbox
          </h2>
          <p className="font-body text-cream-muted text-sm leading-relaxed max-w-xs">
            We sent a confirmation link to <span className="text-gold">{email}</span>.
            Click it to activate your account and start shopping.
          </p>
        </div>
        <Link
          href="/login"
          className="font-label uppercase tracking-widest text-xs text-forest bg-gold
                     px-6 py-3 hover:bg-gold-light transition-colors duration-300 mt-2"
        >
          Go to Sign In
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <p className="font-label uppercase tracking-[0.4em] text-gold text-xs mb-3">
          Join AURA
        </p>
        <h1 className="font-display italic font-bold text-cream text-3xl leading-tight">
          Create your<br />account
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label uppercase tracking-widest text-cream-muted text-[10px]">
            Full Name
          </label>
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Priya Sharma"
            className="bg-forest/60 border border-fern/40 text-cream placeholder-cream-muted/40
                       font-body text-sm px-4 py-3 rounded-none
                       focus:outline-none focus:border-gold/60 transition-colors duration-300"
          />
        </div>

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
            <span className="ml-2 text-cream-muted/60 normal-case tracking-normal">(min. 8 characters)</span>
          </label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="new-password"
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
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      {/* Divider */}
      <div className="h-px bg-fern/20 my-6" />

      {/* Login link */}
      <p className="font-body text-cream-muted text-sm text-center">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-gold hover:text-gold-light transition-colors duration-300 underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </>
  )
}
