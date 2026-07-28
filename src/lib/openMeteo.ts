import type { EnvReading } from './scoring'

function usAqiFromPm25(pm25: number): number {
  // EPA breakpoint approximation
  const breaks: [number, number, number, number][] = [
    [0, 12, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
    [250.5, 350.4, 301, 400],
    [350.5, 500.4, 401, 500],
  ]
  for (const [cLow, cHigh, iLow, iHigh] of breaks) {
    if (pm25 >= cLow && pm25 <= cHigh) {
      return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (pm25 - cLow) + iLow)
    }
  }
  if (pm25 > 500.4) return 500
  return 0
}

function formatWindow(isoHour: string, timeZone: string): string {
  const d = new Date(isoHour)
  return d.toLocaleString('en-PK', {
    timeZone,
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export async function fetchCityEnv(lat: number, lon: number): Promise<EnvReading> {
  const tz = 'Asia/Karachi'
  const airUrl =
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
    `&hourly=pm2_5,us_aqi&timezone=${encodeURIComponent(tz)}&forecast_days=2`

  const wxUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&hourly=apparent_temperature&timezone=${encodeURIComponent(tz)}&forecast_days=2`

  const [airRes, wxRes] = await Promise.all([fetch(airUrl), fetch(wxUrl)])
  if (!airRes.ok || !wxRes.ok) {
    throw new Error('Could not reach Open-Meteo. Check your connection.')
  }

  const air = await airRes.json()
  const wx = await wxRes.json()

  const times: string[] = air.hourly.time
  const pm25s: number[] = air.hourly.pm2_5
  const aqis: (number | null)[] = air.hourly.us_aqi
  const temps: number[] = wx.hourly.apparent_temperature
  const wxTimes: string[] = wx.hourly.time

  const now = Date.now()
  let idx = 0
  for (let i = 0; i < times.length; i++) {
    if (new Date(times[i]).getTime() <= now) idx = i
  }

  const pm25 = pm25s[idx] ?? 40
  const aqiRaw = aqis[idx]
  const aqi = typeof aqiRaw === 'number' && aqiRaw > 0 ? aqiRaw : usAqiFromPm25(pm25)

  const later = Math.min(idx + 6, times.length - 1)
  const aqiLaterRaw = aqis[later]
  const aqiLater =
    typeof aqiLaterRaw === 'number' && aqiLaterRaw > 0
      ? aqiLaterRaw
      : usAqiFromPm25(pm25s[later] ?? pm25)

  let tIdx = 0
  for (let i = 0; i < wxTimes.length; i++) {
    if (new Date(wxTimes[i]).getTime() <= now) tIdx = i
  }
  const tApp = temps[tIdx] ?? 30
  const tLater = temps[Math.min(tIdx + 6, temps.length - 1)] ?? tApp

  const hour = new Date(times[idx]).getHours()

  // find a better 3h window in next 24h
  let betterWindowLabel: string | null = null
  const nowBlend = 0.55 * scoreProxy(aqi) + 0.45 * heatProxy(tApp, hour)
  if (nowBlend >= 55) {
    for (let i = idx; i < Math.min(idx + 24, times.length - 2); i++) {
      const a0 = aqis[i] ?? usAqiFromPm25(pm25s[i] ?? pm25)
      const a1 = aqis[i + 1] ?? a0
      const a2 = aqis[i + 2] ?? a1
      const avgA = (Number(a0) + Number(a1) + Number(a2)) / 3
      const ti = wxTimes.indexOf(times[i])
      const t0 = temps[ti >= 0 ? ti : tIdx] ?? tApp
      const h = new Date(times[i]).getHours()
      const b = 0.55 * scoreProxy(avgA) + 0.45 * heatProxy(t0, h)
      if (b <= 40) {
        betterWindowLabel = formatWindow(times[i], tz)
        break
      }
    }
  }

  return {
    aqi: Math.round(aqi),
    pm25: Math.round(pm25 * 10) / 10,
    tApp: Math.round(tApp * 10) / 10,
    hour,
    aqiTrend6h: Math.round(aqiLater - aqi),
    heatTrend6h: Math.round((tLater - tApp) * 10) / 10,
    betterWindowLabel,
  }
}

function scoreProxy(aqi: number): number {
  if (aqi <= 50) return 10
  if (aqi <= 100) return 30
  if (aqi <= 150) return 55
  if (aqi <= 200) return 75
  if (aqi <= 300) return 90
  return 100
}

function heatProxy(tApp: number, hour: number): number {
  let s = 10
  if (tApp >= 27) s = 35
  if (tApp >= 32) s = 55
  if (tApp >= 38) s = 75
  if (tApp >= 42) s = 90
  if (tApp >= 46) s = 100
  if (hour >= 11 && hour < 16 && tApp >= 32) s = Math.min(100, s + 10)
  return s
}
