import { useEffect, useState } from 'react'

export type AlleyBeat =
  | 'walking'
  | 'stopped'
  | 'smoking'
  | 'mapLit'
  | 'engulfing'
  | 'zooming'

const WALK_MS = 5000
const SMOKE_DELAY_MS = 400
const MAP_DELAY_MS = 2200
const HOLD_ON_MAP_MS = 1800
/** Time for fullscreen clouds to billow in (visible, wavy) */
const ENGULF_MS = 2000
const ZOOM_MS = 1600

/**
 * Phase 2 intro clock:
 * walk → halt → gutter smoke → map lit → smoke engulfs → zoom → handoff to map.
 */
export function useAlleyIntro(enabled = true, onComplete?: () => void) {
  const [beat, setBeat] = useState<AlleyBeat>('walking')
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!enabled) return

    if (reduced) {
      setBeat('zooming')
      const t = window.setTimeout(() => onComplete?.(), 400)
      return () => window.clearTimeout(t)
    }

    setBeat('walking')
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms))
    }

    const t0 = WALK_MS
    at(t0, () => setBeat('stopped'))
    at(t0 + SMOKE_DELAY_MS, () => setBeat('smoking'))
    at(t0 + SMOKE_DELAY_MS + MAP_DELAY_MS, () => setBeat('mapLit'))

    const engulfAt = t0 + SMOKE_DELAY_MS + MAP_DELAY_MS + HOLD_ON_MAP_MS
    at(engulfAt, () => setBeat('engulfing'))
    // Let clouds fully form before zooming
    at(engulfAt + ENGULF_MS, () => setBeat('zooming'))
    at(engulfAt + ENGULF_MS + ZOOM_MS, () => onComplete?.())

    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [enabled, onComplete, reduced])

  return beat
}
