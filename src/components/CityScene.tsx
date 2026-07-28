import type { City } from '../data/cities'
import type { EnvReading, Profile, RecommendedAction } from '../lib/scoring'
import { overallMood } from '../lib/scoring'

type Props = {
  city: City
  profile: Profile
  env: EnvReading | null
  loading: boolean
  error: string | null
  fetchedAt: string | null
  sAir: number
  sHeat: number
  actions: RecommendedAction[]
  reveal: boolean
  onBack: () => void
  onToggle: (key: keyof Profile) => void
}

export function CityScene({
  city,
  profile,
  env,
  loading,
  error,
  fetchedAt,
  sAir,
  sHeat,
  actions,
  reveal,
  onBack,
  onToggle,
}: Props) {
  const mood = overallMood(sAir, sHeat)

  return (
    <div
      className={`city-scene${reveal ? ' city-scene--reveal' : ''}`}
      style={{ ['--accent' as string]: city.accent }}
    >
      <div className="city-topbar">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Back to map
        </button>
      </div>

      <div className="city-card">
        <div className="city-card-head">
          <div>
            <p className="city-eyebrow">
              {city.symbol} Air & heat report
            </p>
            <h2>{city.name}</h2>
            <p className="city-tagline">{city.tagline}</p>
          </div>
          {!loading && env && (
            <span className={`mood-pill ${mood.level}`}>
              {mood.label}: {mood.blurb}
            </span>
          )}
        </div>

        <div className="profile" aria-label="Who is this for?">
          {(
            [
              ['child', 'Kids'],
              ['sensitive', 'Sensitive lungs'],
              ['outdoorJob', 'Outdoor work'],
              ['school', 'School'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`toggle${profile[key] ? ' on' : ''}`}
              onClick={() => onToggle(key)}
              aria-pressed={profile[key]}
            >
              {label}
            </button>
          ))}
        </div>

        {loading && <div className="loading">Checking conditions over {city.name}…</div>}
        {error && <div className="error">{error}</div>}

        {env && !loading && (
          <>
            <div className="stats">
              <div className="stat">
                <strong>{env.aqi}</strong>
                <span>US AQI</span>
              </div>
              <div className="stat">
                <strong>{env.pm25}</strong>
                <span>PM2.5 µg/m³</span>
              </div>
              <div className="stat">
                <strong>{env.tApp}°</strong>
                <span>Feels like °C</span>
              </div>
              <div className="stat">
                <strong>
                  {env.aqiTrend6h > 0 ? '+' : ''}
                  {env.aqiTrend6h}
                </strong>
                <span>AQI Δ 6h</span>
              </div>
            </div>

            <h3 className="section-title">What to do</h3>

            {actions.length === 0 ? (
              <p className="empty-prompt">No special steps needed right now.</p>
            ) : (
              <div className="actions">
                {actions.map((a) => (
                  <article key={a.id} className={`action ${a.tier}`}>
                    <div>
                      <h3>{a.title}</h3>
                      <p>{a.detail}</p>
                    </div>
                    {a.durationMin != null && (
                      <div className="action-time" aria-label={`${a.durationMin} minutes`}>
                        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M12 7v5l3.5 2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{a.durationMin} min</span>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}

            <p className="status-line">
              Air {sAir}/100 · heat {sHeat}/100
              {fetchedAt ? ` · fetched ${fetchedAt} PKT` : ''} · Open-Meteo
            </p>
          </>
        )}
      </div>
    </div>
  )
}
