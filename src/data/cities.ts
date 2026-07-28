export type CityId = 'lahore' | 'karachi' | 'islamabad'

export interface City {
  id: CityId
  name: string
  tagline: string
  lat: number
  lon: number
  symbol: string
  accent: string
  sea: string
}

export const CITIES: City[] = [
  {
    id: 'lahore',
    name: 'Lahore',
    tagline: 'Often the worst AQI of the three.',
    lat: 31.5204,
    lon: 74.3587,
    symbol: '🕌',
    accent: '#c45c26',
    sea: '#e8a05a',
  },
  {
    id: 'karachi',
    name: 'Karachi',
    tagline: 'Heat and humidity hit hardest here.',
    lat: 24.8607,
    lon: 67.0011,
    symbol: '🌊',
    accent: '#0d6e6e',
    sea: '#3aa6a6',
  },
  {
    id: 'islamabad',
    name: 'Islamabad',
    tagline: 'Usually cleaner air, still watch the heat.',
    lat: 33.6844,
    lon: 73.0479,
    symbol: '⛰️',
    accent: '#2f6b3a',
    sea: '#7cb87c',
  },
]
