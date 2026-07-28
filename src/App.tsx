import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BrickAlley } from './components/BrickAlley'
import { CoffeeMap } from './components/CoffeeMap'
import { CityScene } from './components/CityScene'
import { FogOverlay, type FogPhase } from './components/FogOverlay'
import { SmokeCurtain } from './components/SmokeCurtain'
import { CITIES, type CityId } from './data/cities'
import { fetchCityEnv } from './lib/openMeteo'
import {
  DEFAULT_PROFILE,
  recommendActions,
  type EnvReading,
  type Profile,
  type RecommendedAction,
} from './lib/scoring'

/**
 * Phase 4 — alley intro once, then map is home.
 * City ↔ map through black fog. Replay restarts the alley beat.
 */
type Screen = 'alley' | 'map' | 'city'

const FOG_IN_MS = 1400
const FOG_OUT_MS = 1600
const SWAP_AT_MS = 700

export default function App() {
  const [screen, setScreen] = useState<Screen>('alley')
  const [reveal, setReveal] = useState(false)
  const [alleyKey, setAlleyKey] = useState(0)
  const [introDone, setIntroDone] = useState(false)

  const [cityId, setCityId] = useState<CityId | null>(null)
  const [fog, setFog] = useState<FogPhase>('gone')
  const [busy, setBusy] = useState(false)
  const [cityReveal, setCityReveal] = useState(false)

  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [env, setEnv] = useState<EnvReading | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchedAt, setFetchedAt] = useState<string | null>(null)

  const timers = useRef<number[]>([])
  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }
  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  useEffect(() => () => clearTimers(), [])

  const city = useMemo(
    () => (cityId ? CITIES.find((c) => c.id === cityId) ?? null : null),
    [cityId],
  )

  const scored = useMemo(() => {
    if (!env) return { sAir: 0, sHeat: 0, actions: [] as RecommendedAction[] }
    return recommendActions(env, profile)
  }, [env, profile])

  const loadEnv = useCallback(async (id: CityId) => {
    const target = CITIES.find((c) => c.id === id)
    if (!target) return
    setLoading(true)
    setError(null)
    try {
      const reading = await fetchCityEnv(target.lat, target.lon)
      setEnv(reading)
      setFetchedAt(new Date().toISOString())
    } catch (e) {
      setEnv(null)
      setError(e instanceof Error ? e.message : 'Could not load conditions')
    } finally {
      setLoading(false)
    }
  }, [])

  const finishIntro = useCallback(() => {
    setReveal(true)
    setScreen('map')
    setIntroDone(true)
  }, [])

  const replayIntro = () => {
    if (busy || screen === 'alley') return
    clearTimers()
    setReveal(false)
    setFog('gone')
    setBusy(false)
    setCityId(null)
    setCityReveal(false)
    setEnv(null)
    setError(null)
    setFetchedAt(null)
    setScreen('alley')
    setAlleyKey((k) => k + 1)
  }

  const selectCity = (id: CityId) => {
    if (busy || fog !== 'gone') return
    clearTimers()
    setBusy(true)
    setCityId(id)
    setCityReveal(false)
    setEnv(null)
    setError(null)
    setFog('rolling-in')

    later(SWAP_AT_MS, () => {
      setScreen('city')
      void loadEnv(id)
    })
    later(FOG_IN_MS, () => {
      setFog('clearing')
      setCityReveal(true)
    })
    later(FOG_IN_MS + FOG_OUT_MS, () => {
      setFog('gone')
      setBusy(false)
    })
  }

  const backToMap = () => {
    if (busy) return
    clearTimers()
    setBusy(true)
    setFog('rolling-in')
    setCityReveal(false)

    later(SWAP_AT_MS, () => {
      setScreen('map')
      setCityId(null)
      setEnv(null)
      setError(null)
      setFetchedAt(null)
    })
    later(FOG_IN_MS, () => setFog('clearing'))
    later(FOG_IN_MS + FOG_OUT_MS, () => {
      setFog('gone')
      setBusy(false)
    })
  }

  const onToggle = (key: keyof Profile) => {
    setProfile((p) => ({ ...p, [key]: !p[key] }))
  }

  const showReplay = introDone && screen !== 'alley' && !reveal && !busy

  return (
    <div className="stage">
      {screen === 'alley' && <BrickAlley key={alleyKey} onComplete={finishIntro} />}
      {screen === 'map' && (
        <>
          <CoffeeMap onSelectCity={selectCity} selecting={busy} />
          {reveal && (
            <SmokeCurtain mode="clear" onCleared={() => setReveal(false)} />
          )}
        </>
      )}
      {screen === 'city' && city && (
        <CityScene
          city={city}
          profile={profile}
          env={env}
          loading={loading}
          error={error}
          fetchedAt={fetchedAt}
          sAir={scored.sAir}
          sHeat={scored.sHeat}
          actions={scored.actions}
          reveal={cityReveal}
          onBack={backToMap}
          onToggle={onToggle}
        />
      )}

      <FogOverlay phase={fog} />

      {showReplay && (
        <button type="button" className="replay-btn" onClick={replayIntro}>
          Replay intro
        </button>
      )}
    </div>
  )
}
