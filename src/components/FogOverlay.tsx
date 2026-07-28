type FogPhase = 'thick' | 'clearing' | 'gone' | 'rolling-in'

type Props = {
  phase: FogPhase
}

/**
 * Cloud banks that slide in from left/right and exit the same way.
 * No text — pure motion cover for scene changes.
 */
export function FogOverlay({ phase }: Props) {
  if (phase === 'gone') return null

  return (
    <div className={`fog fog--${phase}`} aria-hidden>
      <div className="fog-bank fog-bank--left">
        <Cloud className="cloud cloud--a" />
        <Cloud className="cloud cloud--b" />
        <Cloud className="cloud cloud--c" />
        <div className="fog-sheet" />
      </div>
      <div className="fog-bank fog-bank--right">
        <Cloud className="cloud cloud--d" />
        <Cloud className="cloud cloud--e" />
        <Cloud className="cloud cloud--f" />
        <div className="fog-sheet" />
      </div>
    </div>
  )
}

function Cloud({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 200 100" aria-hidden>
      <ellipse cx="60" cy="58" rx="48" ry="28" fill="currentColor" />
      <ellipse cx="100" cy="48" rx="42" ry="32" fill="currentColor" />
      <ellipse cx="140" cy="58" rx="46" ry="26" fill="currentColor" />
      <ellipse cx="85" cy="40" rx="30" ry="22" fill="currentColor" />
    </svg>
  )
}
