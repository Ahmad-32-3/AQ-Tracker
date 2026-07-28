import { useCallback, useState } from 'react'
import { BrickAlley } from './components/BrickAlley'
import { CoffeeMap } from './components/CoffeeMap'
import { SmokeCurtain } from './components/SmokeCurtain'

/**
 * Phase 2 — alley → smoke engulf → zoom → map reveal.
 * Map button still available for art preview (skips intro smoke).
 */
type Screen = 'alley' | 'map'

export default function App() {
  const [screen, setScreen] = useState<Screen>('alley')
  const [reveal, setReveal] = useState(false)
  const [alleyKey, setAlleyKey] = useState(0)

  const finishIntro = useCallback(() => {
    setReveal(true)
    setScreen('map')
  }, [])

  const goAlley = () => {
    setReveal(false)
    setScreen('alley')
    setAlleyKey((k) => k + 1)
  }

  const goMapPreview = () => {
    setReveal(false)
    setScreen('map')
  }

  return (
    <div className="stage">
      {screen === 'alley' && <BrickAlley key={alleyKey} onComplete={finishIntro} />}
      {screen === 'map' && (
        <>
          <CoffeeMap />
          {reveal && (
            <SmokeCurtain mode="clear" onCleared={() => setReveal(false)} />
          )}
        </>
      )}

      <div className="phase-bar">
        <span className="phase-bar-label">Phase 2 · Into the map</span>
        <button
          type="button"
          className={`phase-bar-btn${screen === 'alley' ? ' on' : ''}`}
          onClick={goAlley}
        >
          Alley
        </button>
        <button
          type="button"
          className={`phase-bar-btn${screen === 'map' && !reveal ? ' on' : ''}`}
          onClick={goMapPreview}
        >
          Map
        </button>
      </div>
    </div>
  )
}
