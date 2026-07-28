/**
 * Floor storm drain + thick rising black smoke.
 * Amber grate light + shaft so the plume reads clearly.
 */
export function GutterSmoke({ active, lit }: { active: boolean; lit: boolean }) {
  return (
    <div
      className={`gutter-smoke${active ? ' gutter-smoke--on' : ''}${lit ? ' gutter-smoke--lit' : ''}`}
      aria-hidden
    >
      <div className="gutter-glow" />
      <div className="gutter-shaft" />
      <div className="gutter-ember" />

      <svg className="gutter-grate" viewBox="0 0 160 48" aria-hidden>
        <ellipse cx="80" cy="40" rx="70" ry="8" fill="#0a0806" opacity="0.85" />
        <rect x="20" y="10" width="120" height="26" rx="3" fill="#12100e" stroke="#050403" strokeWidth="2" />
        <rect x="24" y="14" width="112" height="18" rx="2" fill="#1a1612" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect
            key={i}
            x={30 + i * 14}
            y="15"
            width="5"
            height="16"
            rx="1"
            fill="#0a0806"
            opacity="0.9"
          />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect
            key={`glow-${i}`}
            x={32 + i * 14}
            y="16"
            width="2"
            height="14"
            rx="0.5"
            fill="#e8a05a"
            opacity="0.22"
          />
        ))}
        <ellipse cx="80" cy="24" rx="28" ry="6" fill="#e8a05a" opacity="0.08" />
        <path d="M22 12 H138" stroke="#3a3228" strokeWidth="1" opacity="0.35" />
        <ellipse cx="80" cy="42" rx="48" ry="4" fill="#1a3040" opacity="0.35" />
      </svg>

      <svg className="gutter-smoke-filters" aria-hidden>
        <filter id="gutterWisp" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="9" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="22" />
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
      </svg>

      <div className="gutter-plume" filter="url(#gutterWisp)">
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} className={`gutter-puff gutter-puff--${i}`} />
        ))}
      </div>

      <div className="gutter-haze" filter="url(#gutterWisp)" />
      <div className="gutter-haze gutter-haze--2" filter="url(#gutterWisp)" />

      <div className="gutter-plume gutter-plume--lit" filter="url(#gutterWisp)">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className={`gutter-puff gutter-puff--lit gutter-puff--lit-${i}`} />
        ))}
      </div>
    </div>
  )
}
