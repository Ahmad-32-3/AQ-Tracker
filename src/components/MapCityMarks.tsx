/**
 * Phase 1–3 city marks — old-school ink landmarks on parchment.
 * Lahore → crow's nest · Karachi → lighthouse · Islamabad → mountain shrine
 */

import type { CityId } from '../data/cities'

const INK = '#1a100a'

type Mark = {
  id: CityId
  name: string
  mark: string
  glow: string
  top: string
  left: string
}

const MARKS: Mark[] = [
  {
    id: 'lahore',
    name: 'Lahore',
    mark: "Crow's nest",
    glow: '#e8a05a',
    top: '27%',
    left: '50%',
  },
  {
    id: 'karachi',
    name: 'Karachi',
    mark: 'Lighthouse',
    glow: '#5ec4c4',
    top: '55%',
    left: '26%',
  },
  {
    id: 'islamabad',
    name: 'Islamabad',
    mark: 'Mountain shrine',
    glow: '#8fbf7a',
    top: '54%',
    left: '74%',
  },
]

export function MapCityMarks({
  onSelect,
  disabled = false,
}: {
  onSelect?: (id: CityId) => void
  disabled?: boolean
}) {
  return (
    <div className="map-city-marks" aria-label="City landmarks">
      {MARKS.map((m) => (
        <button
          key={m.id}
          type="button"
          className="map-city-mark"
          style={{ top: m.top, left: m.left, ['--mark-glow' as string]: m.glow }}
          onClick={() => onSelect?.(m.id)}
          disabled={disabled || !onSelect}
          aria-label={`Open ${m.name} air and heat report`}
        >
          <div className="map-city-mark-glow" aria-hidden />
          <svg className="map-city-mark-art" viewBox="0 0 160 150" aria-hidden>
            <IslandBase />
            {m.id === 'lahore' && <CrowsNestIcon />}
            {m.id === 'karachi' && <LighthouseIcon />}
            {m.id === 'islamabad' && <MountainShrineIcon />}
          </svg>
          <span className="map-city-mark-label">{m.name}</span>
        </button>
      ))}
    </div>
  )
}

function IslandBase() {
  return (
    <g fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
      {/* Soft pedestal shadow */}
      <ellipse cx="80" cy="132" rx="48" ry="8" fill={INK} stroke="none" opacity="0.18" />
      {/* Land blob — hand-ink outline */}
      <path
        d="M32 118
           C28 96 42 78 62 72
           C78 68 92 58 108 60
           C128 62 142 78 144 98
           C146 114 136 124 118 128
           C96 134 58 132 32 118Z"
        fill="#c4a06a"
        stroke={INK}
        strokeWidth="1.6"
        opacity="0.92"
      />
      <path
        d="M48 114 C46 96 62 84 82 82 C104 80 124 90 128 106 C130 116 118 122 98 124 C72 126 56 122 48 114Z"
        fill="#b08950"
        stroke="none"
        opacity="0.55"
      />
      {/* Tiny coastline hatch */}
      <path
        d="M40 120 C60 128 100 130 130 122"
        strokeWidth="1"
        opacity="0.35"
      />
    </g>
  )
}

/** Ship crow's nest on a mast — Lahore */
function CrowsNestIcon() {
  return (
    <g fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Mast */}
      <path d="M80 118 V38" strokeWidth="2" />
      {/* Yard arm */}
      <path d="M52 56 H108" strokeWidth="1.4" />
      {/* Rigging */}
      <path d="M80 38 L56 56 M80 38 L104 56" strokeWidth="1" opacity="0.7" />
      <path d="M80 70 L60 56 M80 70 L100 56" strokeWidth="0.9" opacity="0.5" />
      {/* Nest basket */}
      <ellipse cx="80" cy="48" rx="16" ry="7" fill="#8b5a32" stroke={INK} />
      <path d="M64 48 V58 C64 64 96 64 96 58 V48" fill="#6e4424" stroke={INK} />
      {/* Basket weave */}
      <path d="M68 50 V60 M74 51 V61 M80 51 V62 M86 51 V61 M92 50 V60" strokeWidth="0.85" opacity="0.55" />
      {/* Lookout figure silhouette */}
      <circle cx="80" cy="42" r="3.2" fill={INK} stroke="none" />
      <path d="M80 45 V52" strokeWidth="1.3" />
      {/* Flag */}
      <path d="M80 38 L80 28 L96 32 L80 36" fill={INK} stroke="none" opacity="0.85" />
      {/* Crow accent */}
      <path d="M98 44 Q106 40 112 46 Q106 48 98 46" fill={INK} stroke="none" opacity="0.7" />
    </g>
  )
}

/** Coastal lighthouse — Karachi */
function LighthouseIcon() {
  return (
    <g fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Rocks */}
      <path d="M48 118 L58 108 L72 114 L88 106 L104 116 L118 110 L128 118" strokeWidth="1.3" />
      {/* Tower body (tapered) */}
      <path
        d="M68 112 L74 48 L86 48 L92 112 Z"
        fill="#d4b896"
        stroke={INK}
        strokeWidth="1.6"
      />
      {/* Stripes */}
      <path d="M70 98 H90 M71 84 H89 M72 70 H88 M73 56 H87" strokeWidth="2.2" opacity="0.75" />
      {/* Lantern room */}
      <rect x="70" y="36" width="20" height="14" rx="1" fill="#f0e0c4" stroke={INK} />
      <path d="M74 36 V50 M80 36 V50 M86 36 V50" strokeWidth="1" opacity="0.55" />
      {/* Dome / cap */}
      <path d="M68 36 Q80 24 92 36 Z" fill={INK} stroke="none" />
      <path d="M80 24 V18" strokeWidth="1.4" />
      <circle cx="80" cy="16" r="2.2" fill={INK} stroke="none" />
      {/* Light beams */}
      <path d="M92 42 L128 28 M92 46 L132 46 M92 50 L128 64" strokeWidth="1.1" opacity="0.4" />
      <path d="M68 42 L32 28 M68 46 L28 46 M68 50 L32 64" strokeWidth="1.1" opacity="0.35" />
      {/* Door */}
      <rect x="76" y="100" width="8" height="12" fill={INK} stroke="none" opacity="0.7" />
    </g>
  )
}

/** Mountain shrine — Islamabad */
function MountainShrineIcon() {
  return (
    <g fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Peaks behind */}
      <path
        d="M28 110 L48 58 L62 88 L78 42 L98 92 L112 55 L138 110"
        fill="#9a7a55"
        stroke={INK}
        strokeWidth="1.5"
        opacity="0.85"
      />
      {/* Hatch shade on peaks */}
      <path
        d="M78 48 L88 78 M74 56 L86 86 M110 62 L120 90 M52 70 L60 95"
        strokeWidth="1"
        opacity="0.45"
      />
      {/* Shrine platform */}
      <path d="M58 100 H102" strokeWidth="1.6" />
      <path d="M62 100 V88 H98 V100" fill="#c9a878" stroke={INK} />
      {/* Columns */}
      <path d="M68 88 V72 M80 88 V70 M92 88 V72" strokeWidth="1.6" />
      {/* Roof */}
      <path d="M62 72 L80 52 L98 72 Z" fill={INK} stroke="none" opacity="0.9" />
      <path d="M66 72 L80 58 L94 72" stroke="#c9a878" strokeWidth="1" opacity="0.7" />
      {/* Sacred flame / orb */}
      <circle cx="80" cy="64" r="3" fill="#f0e0c4" stroke={INK} strokeWidth="1" />
      <path d="M80 61 Q82 56 80 52 Q78 56 80 61" fill={INK} stroke="none" opacity="0.7" />
      {/* Steps */}
      <path d="M70 100 H90 M66 104 H94 M62 108 H98" strokeWidth="1.1" opacity="0.65" />
    </g>
  )
}
