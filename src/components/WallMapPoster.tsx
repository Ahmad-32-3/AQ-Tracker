/**
 * Coffee map poster pasted on the alley brick wall.
 * Starts dark; lights up when smoke + lamp beat peaks (Phase 2).
 */
export function WallMapPoster({ lit }: { lit: boolean }) {
  return (
    <div className={`wall-poster${lit ? ' wall-poster--lit' : ''}`} aria-hidden>
      <div className="wall-poster-tape wall-poster-tape--tl" />
      <div className="wall-poster-tape wall-poster-tape--tr" />
      <div className="wall-poster-sheet">
        <svg className="wall-poster-art" viewBox="0 0 280 200" aria-hidden>
          <defs>
            <linearGradient id="posterParch" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c9a878" />
              <stop offset="55%" stopColor="#a67c4a" />
              <stop offset="100%" stopColor="#6e4424" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="272" height="192" rx="2" fill="url(#posterParch)" />
          <path
            d="M0 20 Q40 8 80 24 T160 18 T240 28 T280 16 L280 0 L0 0 Z"
            fill="#5c3d28"
            opacity="0.35"
          />
          <path
            d="M0 180 Q60 195 120 178 T240 190 T280 175 L280 200 L0 200 Z"
            fill="#3d2618"
            opacity="0.4"
          />
          {/* Tiny ink marks — abstract cities */}
          <g fill="none" stroke="#1a100a" strokeWidth="1.4" opacity="0.75">
            <path d="M70 120 L80 70 L90 110 L100 55 L115 105" />
            <path d="M78 70 V45 M70 55 H90" />
            <circle cx="80" cy="42" r="4" />
            <path d="M160 130 L168 75 L176 130" />
            <path d="M162 90 H174" />
            <path d="M210 125 L230 80 L250 125" />
            <path d="M220 100 H240 M225 100 V88 H235 V100" />
          </g>
          <circle cx="55" cy="55" r="18" fill="none" stroke="#1a100a" strokeWidth="1" opacity="0.4" />
          <path d="M55 40 L55 70 M40 55 L70 55" stroke="#1a100a" strokeWidth="0.8" opacity="0.35" />
          {/* Torn edge nicks */}
          <path d="M4 60 L0 68 L4 76" fill="#0d0a12" />
          <path d="M276 140 L280 148 L276 156" fill="#0d0a12" />
        </svg>
      </div>
    </div>
  )
}
