'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { m, AnimatePresence, useScroll } from 'framer-motion'
import { Menu, X, LogOut, ShoppingBag, LogIn } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { fadeUp, staggerContainer } from '@/lib/motion'
import AuraLogo from '@/components/AuraLogo'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = ['Collections', 'Craftsmanship', 'About', 'Contact']

export default function Navbar() {
  const { scrollY } = useScroll()
  const router   = useRouter()
  const pathname = usePathname()

  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [user, setUser]             = useState<User | null>(null)
  const [dropdownOpen, setDropdown] = useState(false)
  const [cartCount, setCartCount]   = useState(0)
  const dropdownRef                 = useRef<HTMLDivElement>(null)

  // ── Scroll listener ──────────────────────────────────────────────────────
  useEffect(() => {
    return scrollY.on('change', (y) => setScrolled(y > 60))
  }, [scrollY])

  // ── Lock body scroll when mobile menu is open ────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // ── Fetch cart item count ────────────────────────────────────────────────
  const fetchCartCount = useCallback(async (userId: string) => {
    const supabase = createClient()
    // Get user's cart
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (!cart) { setCartCount(0); return }

    // Sum quantities across all items
    const { data: items } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('cart_id', cart.id)

    const total = (items ?? []).reduce((sum, i) => sum + (i.quantity ?? 0), 0)
    setCartCount(total)
  }, [])

  // ── Get current auth user + subscribe to changes ─────────────────────────
  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchCartCount(data.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchCartCount(session.user.id)
      else setCartCount(0)
    })

    return () => subscription.unsubscribe()
  }, [fetchCartCount])

  // ── Re-fetch cart count on every navigation (catches add-to-cart updates) ─
  useEffect(() => {
    if (user) fetchCartCount(user.id)
  }, [pathname, user, fetchCartCount])

  // ── Close dropdown when clicking outside ────────────────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── Sign out ─────────────────────────────────────────────────────────────
  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setDropdown(false)
    setCartCount(0)
    router.push('/')
    router.refresh()
  }

  // ── User display name ────────────────────────────────────────────────────
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Account'

  return (
    <>
      {/* ─── Main Nav Bar ─────────────────────────────────────────── */}
      <m.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'backdrop-blur-md bg-forest/85 border-b border-fern/30'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <a href="/" aria-label="AURA home" className="flex items-center gap-2.5">
            <AuraLogo size={32} showWordmark={false} />
            <div className="flex flex-col leading-none">
              <span className="font-label tracking-[0.38em] text-gold text-sm font-semibold">
                AURA
              </span>
              <span className="font-label tracking-widest text-gold-dark text-[9px] uppercase mt-0.5">
                Silver Jewellery
              </span>
            </div>
          </a>

          {/* ── Desktop Nav Links ── */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="nav-underline font-label uppercase tracking-wide-md text-cream-muted text-xs hover:text-gold transition-colors duration-300"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* ── Desktop CTA + Cart + User + Hamburger ── */}
          <div className="flex items-center gap-3">
            <a
              href="/products"
              className="hidden md:inline-flex font-label uppercase tracking-widest text-xs text-gold border border-gold px-5 py-2 hover:bg-gold hover:text-forest transition-all duration-300"
            >
              Shop Now
            </a>

            {/* ── Cart icon (desktop) ── */}
            <a
              href="/cart"
              aria-label="Shopping bag"
              className="hidden md:flex relative items-center justify-center text-cream-muted hover:text-gold transition-colors duration-300 p-1"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-gold text-forest font-label text-[9px] font-semibold flex items-center justify-center px-0.5 leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </a>

            {/* ── User area (desktop) ── */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              {user ? (
                <>
                  {/* Logged-in: avatar button */}
                  <button
                    onClick={() => setDropdown(!dropdownOpen)}
                    aria-label="Account menu"
                    className="flex items-center gap-2 text-cream-muted hover:text-gold transition-colors duration-300 group"
                  >
                    {/* Gold initials circle */}
                    <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center group-hover:border-gold transition-colors duration-300">
                      <span className="font-label text-[10px] text-gold font-semibold uppercase">
                        {displayName.slice(0, 2)}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <m.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 top-full mt-3 w-52 bg-emerald border border-fern/40 shadow-xl z-50"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-fern/30">
                          <p className="font-label text-gold text-xs tracking-wide truncate capitalize">
                            {displayName}
                          </p>
                          <p className="font-body text-cream-muted text-[11px] truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                          <a
                            href="/cart"
                            onClick={() => setDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 font-label text-xs text-cream-muted hover:text-gold hover:bg-forest/40 transition-colors duration-200 uppercase tracking-widest"
                          >
                            <ShoppingBag size={13} />
                            My Bag
                            {cartCount > 0 && (
                              <span className="ml-auto min-w-[18px] h-[18px] rounded-full bg-gold/20 border border-gold/40 text-gold font-label text-[9px] flex items-center justify-center px-1">
                                {cartCount}
                              </span>
                            )}
                          </a>
                          <a
                            href="/orders"
                            onClick={() => setDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 font-label text-xs text-cream-muted hover:text-gold hover:bg-forest/40 transition-colors duration-200 uppercase tracking-widest"
                          >
                            <ShoppingBag size={13} />
                            My Orders
                          </a>
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-2.5 font-label text-xs text-cream-muted hover:text-red-400 hover:bg-forest/40 transition-colors duration-200 uppercase tracking-widest"
                          >
                            <LogOut size={13} />
                            Sign Out
                          </button>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                /* Logged-out: Sign In link */
                <a
                  href="/login"
                  className="flex items-center gap-1.5 font-label uppercase tracking-widest text-xs text-cream-muted hover:text-gold transition-colors duration-300"
                >
                  <LogIn size={14} />
                  Sign In
                </a>
              )}
            </div>

            {/* Cart icon — mobile only, always visible */}
            <a
              href="/cart"
              aria-label="Shopping bag"
              className="md:hidden relative flex items-center justify-center text-cream-muted hover:text-gold transition-colors duration-300 p-1"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-gold text-forest font-label text-[9px] font-semibold flex items-center justify-center px-0.5 leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="md:hidden text-cream-muted hover:text-gold transition-colors"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </m.nav>

      {/* ─── Mobile Overlay Menu ──────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <m.div
            key="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ backgroundColor: '#0D1F1A' }}
          >
            {/* Close button */}
            <div className="flex justify-between items-center p-6">
              {/* Mobile cart icon */}
              <a
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="relative flex items-center gap-2 text-cream-muted hover:text-gold transition-colors"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-gold text-forest font-label text-[9px] font-semibold flex items-center justify-center px-0.5">
                    {cartCount}
                  </span>
                )}
              </a>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="text-cream-muted hover:text-gold transition-colors"
              >
                <X size={26} />
              </button>
            </div>

            {/* Logo in overlay */}
            <div className="px-10 mb-10 flex items-center gap-3">
              <AuraLogo size={36} showWordmark={false} />
              <span className="font-label tracking-[0.38em] text-gold text-base font-semibold">
                AURA
              </span>
            </div>

            {/* Staggered nav links */}
            <m.ul
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col px-10 gap-6 flex-1"
            >
              {NAV_LINKS.map((link) => (
                <m.li key={link} variants={fadeUp}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-4xl text-cream hover:text-gold transition-colors duration-300 italic"
                  >
                    {link}
                  </a>
                </m.li>
              ))}

              {/* Mobile auth link */}
              <m.li variants={fadeUp}>
                {user ? (
                  <button
                    onClick={() => { handleSignOut(); setMenuOpen(false) }}
                    className="font-display text-4xl text-cream-muted hover:text-gold transition-colors duration-300 italic flex items-center gap-3"
                  >
                    Sign Out
                  </button>
                ) : (
                  <a
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-4xl text-cream hover:text-gold transition-colors duration-300 italic"
                  >
                    Sign In
                  </a>
                )}
              </m.li>
            </m.ul>

            {/* Mobile CTA */}
            <m.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="px-10 pb-12 flex flex-col gap-3"
            >
              {user && (
                <p className="font-label text-gold text-xs tracking-widest uppercase">
                  Signed in as {displayName}
                </p>
              )}
              <a
                href="/products"
                onClick={() => setMenuOpen(false)}
                className="inline-flex font-label uppercase tracking-widest text-sm text-forest bg-gold px-7 py-3.5 hover:bg-gold-light transition-colors duration-300"
              >
                Shop Now
              </a>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
