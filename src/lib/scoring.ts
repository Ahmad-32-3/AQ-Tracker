export type Profile = {
  child: boolean
  sensitive: boolean
  outdoorJob: boolean
  school: boolean
}

export const DEFAULT_PROFILE: Profile = {
  child: false,
  sensitive: false,
  outdoorJob: false,
  school: false,
}

export type EnvReading = {
  aqi: number
  pm25: number
  tApp: number
  hour: number
  aqiTrend6h: number
  heatTrend6h: number
  betterWindowLabel: string | null
}

export type ActionId =
  | 'A1'
  | 'A2'
  | 'A3'
  | 'A4'
  | 'A5'
  | 'A6'
  | 'A7'
  | 'A8'
  | 'A9'
  | 'A10'
  | 'A11'
  | 'A12'

export type RecommendedAction = {
  id: ActionId
  title: string
  detail: string
  durationMin: number | null
  priority: number
  tier: 'soft' | 'strong' | 'stop'
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

export function scoreAir(aqi: number, aqiTrend6h: number): number {
  let s: number
  if (aqi <= 50) s = 10
  else if (aqi <= 100) s = 30
  else if (aqi <= 150) s = 55
  else if (aqi <= 200) s = 75
  else if (aqi <= 300) s = 90
  else s = 100
  if (aqiTrend6h >= 25) s += 10
  return clamp(s)
}

export function scoreHeat(tApp: number, hour: number): number {
  let s: number
  if (tApp < 27) s = 10
  else if (tApp < 32) s = 35
  else if (tApp < 38) s = 55
  else if (tApp < 42) s = 75
  else if (tApp < 46) s = 90
  else s = 100
  if (hour >= 11 && hour < 16 && tApp >= 32) s += 10
  return clamp(s)
}

function profileMult(profile: Profile, kind: 'general' | 'kids' | 'work'): number {
  let m = 1
  if (profile.sensitive) m = Math.max(m, 1.15)
  if (kind === 'kids' && profile.child) m = Math.max(m, 1.2)
  if (kind === 'work' && profile.outdoorJob) m = Math.max(m, 1.15)
  return Math.min(m, 1.25)
}

function blend(sAir: number, sHeat: number, wAir: number, wHeat: number) {
  return wAir * sAir + wHeat * sHeat
}

function limitMinutes(blended: number, stricter: boolean): number {
  let x: number
  if (blended < 55) x = 60
  else if (blended < 70) x = 30
  else if (blended < 85) x = 15
  else x = 10
  if (stricter && x > 10) {
    if (x === 60) x = 30
    else if (x === 30) x = 15
    else if (x === 15) x = 10
  }
  return x
}

function restEvery(blended: number, stricter: boolean): number {
  let y: number
  if (blended < 65) y = 45
  else if (blended < 80) y = 30
  else if (blended < 90) y = 20
  else y = 15
  if (stricter && y > 15) {
    if (y === 45) y = 30
    else if (y === 30) y = 20
    else if (y === 20) y = 15
  }
  return y
}

function hydrateCadence(sHeat: number): string {
  if (sHeat < 55) return 'Drink water while you are outside.'
  if (sHeat < 75) return 'Drink every 20-30 minutes while active.'
  return 'Drink every 15-20 minutes. Set a timer if you need to.'
}

export function recommendActions(
  env: EnvReading,
  profile: Profile,
): { sAir: number; sHeat: number; actions: RecommendedAction[] } {
  const sAir = scoreAir(env.aqi, env.aqiTrend6h)
  const sHeat = scoreHeat(env.tApp, env.hour)
  const out: RecommendedAction[] = []

  const g = profileMult(profile, 'general')
  const k = profileMult(profile, 'kids')
  const w = profileMult(profile, 'work')

  // A1
  {
    const b = blend(sAir, sHeat, 0.55, 0.45) * g
    if (b >= 45) {
      const stricter = profile.child || profile.sensitive
      const x = limitMinutes(b, stricter)
      out.push({
        id: 'A1',
        title: `Limit outdoor time to ${x} min at a time`,
        detail: 'Then go inside and cool down before heading out again.',
        durationMin: x,
        priority: b,
        tier: b >= 85 ? 'stop' : b >= 70 ? 'strong' : 'soft',
      })
    }
  }

  // A2
  {
    const ton = profile.sensitive || profile.child ? 75 : 80
    const b = blend(sAir, sHeat, 0.6, 0.4) * g
    if (b >= ton) {
      out.push({
        id: 'A2',
        title: 'Stay indoors unless necessary',
        detail: 'Skip errands and outdoor plans until conditions improve.',
        durationMin: null,
        priority: b + 20,
        tier: b >= 90 ? 'stop' : 'strong',
      })
    }
  }

  // A3
  {
    const b = blend(sAir, sHeat, 0.7, 0.3) * g
    const heatOnly = sHeat >= 75 && sAir < 40
    if (b >= 55 || heatOnly) {
      out.push({
        id: 'A3',
        title: 'No outdoor exercise',
        detail: 'Running or sports outdoors is not safe in this air or heat.',
        durationMin: null,
        priority: Math.max(b, heatOnly ? 70 : b) + 8,
        tier: 'strong',
      })
    }
  }

  // A4
  {
    const b = blend(sAir, sHeat, 0.9, 0.1) * g
    if (b >= 55) {
      out.push({
        id: 'A4',
        title: b >= 75 ? 'Wear a mask for any outdoor trip' : 'Wear a mask outdoors',
        detail: 'Use an N95 or KN95. Cloth masks do little against PM2.5.',
        durationMin: null,
        priority: b + 5,
        tier: b >= 75 ? 'strong' : 'soft',
      })
    }
  }

  // A5
  {
    const b = blend(sAir, sHeat, 0.95, 0.05) * g
    if (b >= 55) {
      out.push({
        id: 'A5',
        title: 'Keep windows closed',
        detail: 'Use AC recirculate if you have it. Outside air is the problem.',
        durationMin: null,
        priority: b,
        tier: 'soft',
      })
    }
  }

  // A6
  {
    const inPeak = env.hour >= 11 && env.hour < 16
    if (sHeat >= 55 && inPeak) {
      out.push({
        id: 'A6',
        title: 'Avoid being outside 11:00-16:00',
        detail: 'This is the hottest part of the day. Move tasks earlier or later.',
        durationMin: null,
        priority: sHeat * 0.85 + 10,
        tier: sHeat >= 75 ? 'strong' : 'soft',
      })
    }
  }

  // A7
  {
    const b = blend(sAir, sHeat, 0.25, 0.75) * w
    if (b >= 50) {
      const stricter = profile.outdoorJob || profile.sensitive || profile.child
      const y = restEvery(b, stricter)
      out.push({
        id: 'A7',
        title: `Rest in shade every ${y} minutes`,
        detail: 'Take a real break out of the sun, not just a pause.',
        durationMin: y,
        priority: b + 3,
        tier: b >= 80 ? 'strong' : 'soft',
      })
    }
  }

  // A8
  {
    const b = blend(sAir, sHeat, 0.1, 0.9) * g
    if (b >= 40) {
      out.push({
        id: 'A8',
        title: 'Drink water on a schedule',
        detail: hydrateCadence(sHeat),
        durationMin: null,
        priority: b - 5,
        tier: 'soft',
      })
    }
  }

  // A9
  if (profile.child) {
    const b = blend(sAir, sHeat, 0.55, 0.45) * k
    if (b >= 50) {
      out.push({
        id: 'A9',
        title: 'Keep kids indoors',
        detail: 'No outdoor play until air and heat ease up.',
        durationMin: null,
        priority: b + 12,
        tier: 'strong',
      })
    }
  }

  // A10
  if (profile.school || profile.child) {
    const b = blend(sAir, sHeat, 0.6, 0.4) * k
    if (b >= 55) {
      out.push({
        id: 'A10',
        title: b >= 70 ? 'Cancel outdoor PE and sports' : 'Move PE indoors if possible',
        detail: 'Kids should not train hard in this air or heat.',
        durationMin: null,
        priority: b + 10,
        tier: b >= 70 ? 'stop' : 'strong',
      })
    }
  }

  // A11
  if (profile.outdoorJob) {
    const b = blend(sAir, sHeat, 0.35, 0.65) * w
    const ton = profile.sensitive ? 50 : 55
    if (b >= ton) {
      let title = 'Shorten outdoor shifts and rotate indoors'
      let tier: RecommendedAction['tier'] = 'soft'
      if (b >= 85) {
        title = 'Stop non-essential outdoor work'
        tier = 'stop'
      } else if (b >= 70) {
        title = 'Light outdoor duties only'
        tier = 'strong'
      }
      out.push({
        id: 'A11',
        title,
        detail: 'Heat illness and bad air hit outdoor workers first. Cut exposure.',
        durationMin: null,
        priority: b + 15,
        tier,
      })
    }
  }

  // A12
  {
    const now = blend(sAir, sHeat, 0.55, 0.45) * g
    if (now >= 55 && env.betterWindowLabel) {
      out.push({
        id: 'A12',
        title: `Better conditions around ${env.betterWindowLabel}`,
        detail: 'Save outdoor tasks for that window if you can.',
        durationMin: null,
        priority: now - 8,
        tier: 'soft',
      })
    }
  }

  out.sort((a, b) => b.priority - a.priority)
  const priorityIds = ['A2', 'A11', 'A3', 'A10', 'A1', 'A7', 'A4', 'A5', 'A6', 'A8', 'A12', 'A9']
  out.sort((a, b) => priorityIds.indexOf(a.id) - priorityIds.indexOf(b.id))

  const top: RecommendedAction[] = []
  for (const a of out) {
    if (top.length >= 5) break
    if (!top.find((t) => t.id === a.id)) top.push(a)
  }
  const hydrate = out.find((a) => a.id === 'A8')
  if (hydrate && !top.find((t) => t.id === 'A8') && top.length < 6) {
    top.push(hydrate)
  }

  return { sAir, sHeat, actions: top.slice(0, 6) }
}

export function overallMood(sAir: number, sHeat: number): {
  label: string
  blurb: string
  level: 'chill' | 'meh' | 'spicy' | 'yikes'
} {
  const m = Math.max(sAir, sHeat)
  if (m < 40) return { label: 'Good', blurb: 'Conditions look fine.', level: 'chill' }
  if (m < 60) return { label: 'Moderate', blurb: 'Limit long outdoor time.', level: 'meh' }
  if (m < 80) return { label: 'Unhealthy', blurb: 'Keep outdoor trips short.', level: 'spicy' }
  return { label: 'Hazardous', blurb: 'Stay indoors if you can.', level: 'yikes' }
}
