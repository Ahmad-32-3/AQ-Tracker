/**
 * Full-screen black cloud curtain.
 * engulf / peak: billowy wavy clouds rise over ~2s (not a flat black cut)
 * clear: clouds hold, center light flashes, iris opens onto the map
 */
const CLOUDS = Array.from({ length: 12 }, (_, i) => `smoke-cloud smoke-cloud--${i + 1}`)

export function SmokeCurtain({
  mode,
  onCleared,
}: {
  mode: 'off' | 'engulf' | 'peak' | 'clear'
  onCleared?: () => void
}) {
  if (mode === 'off') return null

  return (
    <div className={`smoke-curtain smoke-curtain--${mode}`} aria-hidden>
      <svg className="smoke-curtain-filters" aria-hidden>
        <filter id="smokeWave" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014 0.022"
            numOctaves="3"
            seed="7"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              values="0.012 0.02;0.02 0.028;0.014 0.018;0.012 0.02"
              dur="5s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="28" />
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </svg>

      <div className="smoke-cloud-field" style={{ filter: 'url(#smokeWave)' }}>
        {CLOUDS.map((className) => (
          <div key={className} className={className} />
        ))}
      </div>

      <div className="smoke-veil" />
      <div className="smoke-flash" />
      <div
        className="smoke-iris"
        onAnimationEnd={(e) => {
          if (mode === 'clear' && e.animationName.includes('smokeIrisOpen')) {
            onCleared?.()
          }
        }}
      />
    </div>
  )
}
