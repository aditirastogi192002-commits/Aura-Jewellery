// ─── Auth Layout ──────────────────────────────────────────────────────────────
// Shared layout for /login and /register
// Centred card on dark forest background with grain texture

import Link from 'next/link'
import AuraLogo from '@/components/AuraLogo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-forest flex flex-col items-center justify-center px-4 relative overflow-hidden" style={{ cursor: 'auto' }}>

      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 600px 500px at 50% 30%, rgba(201,169,110,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Logo */}
      <Link href="/" className="flex flex-col items-center gap-1 mb-10 group">
        <AuraLogo size={44} showWordmark={false} />
        <span className="font-label tracking-[0.4em] text-gold text-sm font-semibold mt-1">
          AURA
        </span>
        <span className="font-label tracking-widest text-gold-dark text-[9px] uppercase">
          Silver Jewellery
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-emerald/40 border border-fern/30 backdrop-blur-sm p-8 md:p-10">
        {children}
      </div>

      {/* Back to home */}
      <Link
        href="/"
        className="mt-8 font-label uppercase tracking-widest text-cream-muted text-xs hover:text-gold transition-colors duration-300"
      >
        ← Back to home
      </Link>
    </div>
  )
}
