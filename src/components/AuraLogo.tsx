/**
 * AURA — Geometric Rose-Cut Gem Mark
 *
 * A hexagonal rose-cut gemstone viewed from the crown,
 * drawn in fine gold lines. Inspired by low-poly/faceted
 * geometric aesthetics — distinct from any specific natural form.
 *
 * The 6-sided rose cut: outer hexagon girdle → 6 kite-shaped
 * upper facets → inner table hexagon → 6 star facets to culet (centre).
 */

interface AuraLogoProps {
  /** Width of the gem mark in px. Height scales 1:1. Default 40. */
  size?: number
  /** Colour for all strokes. Defaults to brand gold. */
  color?: string
  /** Whether to show the wordmark "AURA" below the gem. */
  showWordmark?: boolean
  className?: string
}

export default function AuraLogo({
  size = 40,
  color = '#C9A96E',
  showWordmark = true,
  className = '',
}: AuraLogoProps) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      {/* ─── Gem Mark ─────────────────────────────────────── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/*
          Coordinates (pointy-top hexagon, cx=30, cy=30):
          Outer (r=26): top(30,4) tr(52.5,17) br(52.5,43) bot(30,56) bl(7.5,43) tl(7.5,17)
          Inner (r=13): top(30,17) tr(41.3,23.5) br(41.3,36.5) bot(30,43) bl(18.7,36.5) tl(18.7,23.5)
          Centre: (30,30)
        */}

        {/* ── Outer girdle hexagon ──────────────────────────── */}
        <polygon
          points="30,4 52.5,17 52.5,43 30,56 7.5,43 7.5,17"
          stroke={color}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />

        {/* ── Table (inner hexagon) ─────────────────────────── */}
        <polygon
          points="30,17 41.3,23.5 41.3,36.5 30,43 18.7,36.5 18.7,23.5"
          stroke={color}
          strokeWidth="0.75"
          strokeLinejoin="round"
        />

        {/* ── Upper-main kite facet edges ───────────────────── */}
        {/* top outer → tl-inner & top-inner */}
        <line x1="30"   y1="4"    x2="18.7" y2="23.5" stroke={color} strokeWidth="0.55"/>
        <line x1="30"   y1="4"    x2="30"   y2="17"   stroke={color} strokeWidth="0.55"/>
        {/* tr outer → top-inner & tr-inner */}
        <line x1="52.5" y1="17"   x2="30"   y2="17"   stroke={color} strokeWidth="0.55"/>
        <line x1="52.5" y1="17"   x2="41.3" y2="23.5" stroke={color} strokeWidth="0.55"/>
        {/* br outer → tr-inner & br-inner */}
        <line x1="52.5" y1="43"   x2="41.3" y2="23.5" stroke={color} strokeWidth="0.55"/>
        <line x1="52.5" y1="43"   x2="41.3" y2="36.5" stroke={color} strokeWidth="0.55"/>
        {/* bot outer → br-inner & bot-inner */}
        <line x1="30"   y1="56"   x2="41.3" y2="36.5" stroke={color} strokeWidth="0.55"/>
        <line x1="30"   y1="56"   x2="30"   y2="43"   stroke={color} strokeWidth="0.55"/>
        {/* bl outer → bot-inner & bl-inner */}
        <line x1="7.5"  y1="43"   x2="30"   y2="43"   stroke={color} strokeWidth="0.55"/>
        <line x1="7.5"  y1="43"   x2="18.7" y2="36.5" stroke={color} strokeWidth="0.55"/>
        {/* tl outer → bl-inner & tl-inner */}
        <line x1="7.5"  y1="17"   x2="18.7" y2="36.5" stroke={color} strokeWidth="0.55"/>
        <line x1="7.5"  y1="17"   x2="18.7" y2="23.5" stroke={color} strokeWidth="0.55"/>

        {/* ── Star facets (inner → culet) ───────────────────── */}
        <line x1="30"   y1="17"   x2="30"   y2="30"   stroke={color} strokeWidth="0.4"/>
        <line x1="41.3" y1="23.5" x2="30"   y2="30"   stroke={color} strokeWidth="0.4"/>
        <line x1="41.3" y1="36.5" x2="30"   y2="30"   stroke={color} strokeWidth="0.4"/>
        <line x1="30"   y1="43"   x2="30"   y2="30"   stroke={color} strokeWidth="0.4"/>
        <line x1="18.7" y1="36.5" x2="30"   y2="30"   stroke={color} strokeWidth="0.4"/>
        <line x1="18.7" y1="23.5" x2="30"   y2="30"   stroke={color} strokeWidth="0.4"/>

        {/* ── Culet (centre point) ──────────────────────────── */}
        <circle cx="30" cy="30" r="1.2" fill={color} opacity="0.6"/>
      </svg>

      {/* ─── Wordmark ─────────────────────────────────────── */}
      {showWordmark && (
        <span
          className="font-label font-semibold uppercase mt-1"
          style={{
            fontSize: size * 0.28,
            letterSpacing: '0.38em',
            color,
          }}
        >
          AURA
        </span>
      )}
    </div>
  )
}
