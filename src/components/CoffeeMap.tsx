import { MapInkAmbience } from './MapInkAmbience'
import { MapCityMarks } from './MapCityMarks'
import type { CityId } from '../data/cities'

/**
 * Coffee parchment + edge décor + clickable city landmarks.
 */
export function CoffeeMap({
  onSelectCity,
  selecting = false,
}: {
  onSelectCity?: (id: CityId) => void
  selecting?: boolean
}) {
  return (
    <div className="coffee-map">
      <svg className="coffee-filters" aria-hidden>
        <filter
          id="softWrinkles"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves="4"
            seed="7"
            result="noise"
          />
          <feDiffuseLighting
            in="noise"
            lightingColor="#e8d4b0"
            surfaceScale="8"
            result="bump"
          >
            <feDistantLight azimuth="215" elevation="42" />
          </feDiffuseLighting>
        </filter>

        <filter
          id="fineWrinkles"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            seed="19"
            result="fine"
          />
          <feDiffuseLighting
            in="fine"
            lightingColor="#ffffff"
            surfaceScale="3.2"
            result="bump"
          >
            <feDistantLight azimuth="200" elevation="55" />
          </feDiffuseLighting>
        </filter>

        <filter
          id="paperGrain"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75 0.9"
            numOctaves="3"
            seed="3"
            result="g"
          />
          <feDiffuseLighting in="g" lightingColor="#d4b896" surfaceScale="1.8">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
        </filter>
      </svg>

      <div className="parchment">
        <div className="parchment-base" />
        <div className="parchment-soak" aria-hidden />

        <svg className="parchment-bump parchment-bump--soft" aria-hidden>
          <rect width="100%" height="100%" filter="url(#softWrinkles)" />
        </svg>
        <svg className="parchment-bump parchment-bump--fine" aria-hidden>
          <rect width="100%" height="100%" filter="url(#fineWrinkles)" />
        </svg>
        <svg className="parchment-bump parchment-bump--grain" aria-hidden>
          <rect width="100%" height="100%" filter="url(#paperGrain)" />
        </svg>

        <div className="parchment-crumple parchment-crumple--body" aria-hidden />
        <div className="parchment-wash" aria-hidden />

        <div className="stain stain--pool stain--a" />
        <div className="stain stain--ring stain--b" />
        <div className="stain stain--pool stain--c" />
        <div className="stain stain--ring stain--d" />
        <div className="stain stain--pool stain--e" />
      </div>

      <div className="parchment-edge" aria-hidden />

      <MapInkAmbience />
      <MapCityMarks onSelect={onSelectCity} disabled={selecting} />

      <header className="coffee-map-header">
        <h1>Pakistan: Air & Heat</h1>
        <p className="coffee-map-sub">Tap a landmark for advice</p>
      </header>
    </div>
  )
}
