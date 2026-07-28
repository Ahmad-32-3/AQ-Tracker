import type { City, CityId } from '../data/cities'
import { CartoonIsland } from './CartoonIsland'
import { OceanBackdrop } from './OceanBackdrop'

type Props = {
  cities: City[]
  zooming: boolean
  onSelect: (id: CityId) => void
}

export function OceanMap({ cities, zooming, onSelect }: Props) {
  return (
    <div className={`ocean-scene${zooming ? ' ocean-scene--zoom' : ''}`}>
      <OceanBackdrop />

      <header className="map-title">
        <h1>
          AQ<span>-Tracker</span>
        </h1>
        <p>Pick an island. We’ll clear the haze.</p>
      </header>

      <div className="island-field" role="list">
        {cities.map((c) => (
          <button
            key={c.id}
            type="button"
            role="listitem"
            className={`map-island map-island--${c.id}`}
            onClick={() => onSelect(c.id)}
          >
            <span className="map-island-art" aria-hidden>
              <CartoonIsland cityId={c.id} className="map-island-svg" />
            </span>
            <span className="map-island-name">{c.name}</span>
            <span className="map-island-hint">Land here</span>
          </button>
        ))}
      </div>
    </div>
  )
}
