'use client'

import { useEffect, useRef, useState } from 'react'
import { m, useMotionValue, useSpring } from 'framer-motion'

const INTERACTIVE = 'a, button, [role="button"], input, label, select, textarea'

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible]  = useState(false)
  const visibleRef = useRef(false)

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  const x = useSpring(rawX, { stiffness: 500, damping: 35 })
  const y = useSpring(rawY, { stiffness: 500, damping: 35 })

  useEffect(() => {
    // Only enable on pointer:fine (desktop) devices
    const mq = window.matchMedia('(pointer: coarse)')
    if (mq.matches) return

    // ── Mouse movement ──────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      if (!visibleRef.current) {
        visibleRef.current = true
        setVisible(true)
      }
    }

    // ── Hover state via event delegation (no per-element listeners,
    //    no MutationObserver needed — works for dynamically added els) ──
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) setHovered(true)
    }
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) setHovered(false)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover',  onOver)
    document.addEventListener('mouseout',   onOut)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover',  onOver)
      document.removeEventListener('mouseout',   onOut)
    }
  }, [rawX, rawY])

  if (!visible) return null

  return (
    <m.div
      className="fixed top-0 left-0 z-[99999] pointer-events-none"
      style={{ x, y }}
      aria-hidden
    >
      {/* Inner gold dot */}
      <m.div
        animate={{
          scale: hovered ? 2.5 : 1,
          opacity: hovered ? 0.5 : 0.85,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="w-2.5 h-2.5 rounded-full bg-gold"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Outer ring — appears on hover */}
      <m.div
        animate={{
          scale: hovered ? 1 : 0,
          opacity: hovered ? 0.25 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="absolute top-0 left-0 w-10 h-10 rounded-full border border-gold"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </m.div>
  )
}
