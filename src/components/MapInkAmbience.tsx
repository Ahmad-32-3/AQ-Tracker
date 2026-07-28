/**
 * Edge terrain with real mass — soft volume washes under ink ridges.
 * Far/mid/near stacking + hatch + spurs. Center open for islands.
 */

type Pt = { x: number; y: number }

function mulberry32(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }
}

function jag(rand: () => number, a: Pt, b: Pt, steps: number, amt: number): Pt[] {
  const out: Pt[] = []
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const px = -dy / len
  const py = dx / len
  for (let i = 1; i < steps; i++) {
    const t = i / steps
    const env = Math.sin(t * Math.PI) ** 0.55
    const n = (rand() - 0.5) * 2 * amt * env
    const notch = rand() < 0.18 ? (rand() - 0.5) * amt * 2.2 : 0
    out.push({
      x: a.x + dx * t + px * (n + notch),
      y: a.y + dy * t + py * n * 0.45 + Math.abs(notch) * 0.2,
    })
  }
  return out
}

function d(pts: Pt[], close = false) {
  if (!pts.length) return ''
  let s = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) s += ` L${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`
  return close ? `${s} Z` : s
}

type Peak = { at: number; h: number; lean?: number }

function buildRange(
  rand: () => number,
  x: number,
  y: number,
  w: number,
  peaks: Peak[],
  amt: number,
) {
  const sorted = [...peaks].sort((a, b) => a.at - b.at)
  const baseL = { x: x + rand() * 3, y: y }
  const baseR = { x: x + w - rand() * 3, y: y + (rand() - 0.5) * 3 }
  const tips = sorted.map((p) => ({
    x: x + w * p.at + w * (p.lean ?? 0),
    y: y - p.h,
  }))

  const spine: Pt[] = [baseL]
  let prev = baseL
  for (let i = 0; i < tips.length; i++) {
    const tip = tips[i]
    const shoulder = {
      x: lerp(prev.x, tip.x, 0.5 + rand() * 0.12),
      y: lerp(prev.y, tip.y, 0.48) + 6 + rand() * 10,
    }
    spine.push(...jag(rand, prev, shoulder, 4, amt), shoulder)
    spine.push(...jag(rand, shoulder, tip, 3, amt * 0.75), tip)

    if (i < tips.length - 1) {
      const nxt = tips[i + 1]
      const col = {
        x: lerp(tip.x, nxt.x, 0.5),
        y: y - Math.min(sorted[i].h, sorted[i + 1].h) * (0.28 + rand() * 0.15),
      }
      const drop = {
        x: lerp(tip.x, col.x, 0.4),
        y: lerp(tip.y, col.y, 0.45) + 4 + rand() * 6,
      }
      spine.push(...jag(rand, tip, drop, 3, amt), drop)
      spine.push(...jag(rand, drop, col, 3, amt), col)
      prev = col
    } else {
      const drop = {
        x: lerp(tip.x, baseR.x, 0.42),
        y: lerp(tip.y, baseR.y, 0.5) + 6 + rand() * 8,
      }
      spine.push(...jag(rand, tip, drop, 4, amt), drop)
      spine.push(...jag(rand, drop, baseR, 4, amt), baseR)
    }
  }

  const closed = [...spine, ...jag(rand, baseR, baseL, 5, amt * 0.35)]
  return { spine, tips, closed, baseL, baseR, sorted }
}

function TerrainMassif({
  seed,
  x,
  y,
  width,
  shade,
  layers,
}: {
  seed: number
  x: number
  y: number
  width: number
  shade: 'left' | 'right'
  layers: {
    peaks: Peak[]
    yNudge: number
    wScale: number
    hScale: number
    opacity: number
  }[]
}) {
  const rand = mulberry32(seed)
  const dir = shade === 'left' ? 1 : -1

  return (
    <g>
      {layers.map((layer, li) => {
        const lx = x + ((1 - layer.wScale) * width) / 2
        const ly = y + layer.yNudge
        const lw = width * layer.wScale
        const peaks = layer.peaks.map((p) => ({ ...p, h: p.h * layer.hScale }))
        const { spine, tips, closed, sorted } = buildRange(rand, lx, ly, lw, peaks, 6.5 + li)

        // Volume: soft body fill + darker shade face (gradient-like via opacity layers)
        const shadeFaces: string[] = []
        let hatches = ''
        let detail = ''

        tips.forEach((tip, i) => {
          const h = sorted[i].h
          const outer = { x: tip.x + dir * h * 0.5, y: ly + 2 }
          const crest = { x: tip.x - dir * h * 0.02, y: tip.y + h * 0.08 }
          shadeFaces.push(d([tip, crest, ...jag(rand, crest, outer, 4, 3), outer], true))

          // Dense hatch on shade face
          for (let k = 1; k <= 12; k++) {
            const t = k / 13
            const a = lerpPt(tip, outer, t)
            const b = lerpPt(tip, { x: tip.x + dir * h * 0.08, y: ly }, t * 0.9 + 0.05)
            hatches += `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`
          }

          if (li === layers.length - 1) {
            // Lit-side rib
            const ribA = { x: tip.x - dir * 4, y: tip.y + h * 0.18 }
            const ribB = { x: tip.x - dir * h * 0.32, y: ly - h * 0.08 }
            detail += d([ribA, ...jag(rand, ribA, ribB, 4, 2.2), ribB])
            // Spur
            for (let s = 0; s < 3; s++) {
              const sa = lerpPt(tip, { x: tip.x - dir * h * 0.15, y: ly }, 0.25 + s * 0.1)
              const sb = {
                x: tip.x - dir * h * (0.3 + s * 0.1),
                y: ly - 4 - s * 3,
              }
              detail += d([sa, ...jag(rand, sa, sb, 3, 2), sb])
            }
            // Snow / highlight notch near tip (light stroke gap feel via thin parallel)
            detail += `M${(tip.x - 3).toFixed(1)} ${(tip.y + 6).toFixed(1)} L${(tip.x + 3).toFixed(1)} ${(tip.y + 8).toFixed(1)}`
          }
        })

        const band = spine.map((p) => ({ x: p.x, y: lerp(p.y, ly, 0.35) + 2 }))

        return (
          <g key={li} opacity={layer.opacity}>
            {/* Soft terrain body — gives mass */}
            <path d={d(closed, true)} fill="#3d2818" opacity="0.42" stroke="none" />
            {/* Darker shade faces — depth without flat black stamps */}
            {shadeFaces.map((face, fi) => (
              <path key={fi} d={face} fill="#24160e" opacity="0.55" stroke="none" />
            ))}
            {/* Slight highlight wash on lit half of body */}
            <path d={d(closed, true)} fill="#6b4a30" opacity="0.12" stroke="none" />

            <path
              d={d(spine)}
              fill="none"
              stroke="#1a100a"
              strokeWidth={li === layers.length - 1 ? 2 : 1.35}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path d={d(band)} fill="none" stroke="#1a100a" strokeWidth="1.1" opacity="0.4" />
            <path d={hatches} fill="none" stroke="#1a100a" strokeWidth="0.85" opacity="0.7" strokeLinecap="round" />
            <path d={detail} fill="none" stroke="#1a100a" strokeWidth="1.05" opacity="0.55" strokeLinecap="round" />
          </g>
        )
      })}
    </g>
  )
}

function ForestPatch({ seed, x, y, cols, rows }: { seed: number; x: number; y: number; cols: number; rows: number }) {
  const rand = mulberry32(seed)
  const marks: string[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rand() < 0.08) continue
      const ox = x + c * (10 + rand() * 4) + (r % 2) * 5
      const oy = y + r * (7 + rand() * 2)
      const rad = 4 + rand() * 3.5
      marks.push(`M${ox.toFixed(1)} ${oy.toFixed(1)} q${(rad * 0.55).toFixed(1)} ${(-rad).toFixed(1)} ${(rad * 2).toFixed(1)} 0`)
    }
  }
  return <path d={marks.join(' ')} stroke="#1a100a" strokeWidth="1" opacity="0.65" fill="none" />
}

function River({ seed, pts, w = 1.4, o = 0.4 }: { seed: number; pts: Pt[]; w?: number; o?: number }) {
  const rand = mulberry32(seed)
  const all: Pt[] = [pts[0]]
  for (let i = 0; i < pts.length - 1; i++) all.push(...jag(rand, pts[i], pts[i + 1], 4, 3), pts[i + 1])
  return <path d={d(all)} fill="none" stroke="#1a100a" strokeWidth={w} opacity={o} strokeLinecap="round" />
}

const INK = '#1a100a'

/**
 * Ornate pirate / privateer compass rose —
 * rope ring, 16-point rose, filigree, fleur N, tiny skull boss.
 */
function PirateCompass() {
  const ticks: string[] = []
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2
    const major = i % 6 === 0
    const mid = i % 3 === 0
    const r0 = major ? 48 : mid ? 50 : 51
    const r1 = 54
    ticks.push(
      `M${(Math.sin(a) * r0).toFixed(1)} ${(-Math.cos(a) * r0).toFixed(1)} L${(Math.sin(a) * r1).toFixed(1)} ${(-Math.cos(a) * r1).toFixed(1)}`,
    )
  }

  const points = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * 360
    const major = i % 4 === 0
    const mid = i % 2 === 0
    const len = major ? 40 : mid ? 28 : 18
    return { angle, major, mid, len }
  })

  return (
    <g fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
      {/* Outer filigree petals — skip E/W axes so letters stay clear */}
      {Array.from({ length: 8 }, (_, i) => {
        // Skip petals at 90° and 270° (E/W)
        if (i === 2 || i === 6) return null
        const a = (i / 8) * Math.PI * 2
        const x = Math.sin(a) * 68
        const y = -Math.cos(a) * 68
        return (
          <path
            key={`fil-${i}`}
            d={`M${(Math.sin(a) * 60).toFixed(1)} ${(-Math.cos(a) * 60).toFixed(1)}
                Q${(x + Math.sin(a + 0.4) * 7).toFixed(1)} ${(y - Math.cos(a + 0.4) * 7).toFixed(1)}
                 ${x.toFixed(1)} ${y.toFixed(1)}
                Q${(x + Math.sin(a - 0.4) * 7).toFixed(1)} ${(y - Math.cos(a - 0.4) * 7).toFixed(1)}
                 ${(Math.sin(a) * 60).toFixed(1)} ${(-Math.cos(a) * 60).toFixed(1)}`}
            strokeWidth="1.05"
            opacity="0.55"
          />
        )
      })}

      {/* Rope-twist outer ring (paired offset circles + hatch) */}
      <circle cx="0" cy="0" r="62" strokeWidth="2.6" opacity="0.92" />
      <circle cx="0" cy="0" r="58" strokeWidth="1.4" opacity="0.65" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2
        const x = Math.sin(a) * 60
        const y = -Math.cos(a) * 60
        return (
          <ellipse
            key={`rope-${i}`}
            cx={x}
            cy={y}
            rx="2.8"
            ry="1.8"
            transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`}
            strokeWidth="0.85"
            opacity="0.5"
          />
        )
      })}

      {/* Degree ring */}
      <circle cx="0" cy="0" r="52" strokeWidth="1.7" opacity="0.85" />
      <path d={ticks.join('')} strokeWidth="1.15" opacity="0.75" />

      {/* Inner decorative rings */}
      <circle cx="0" cy="0" r="42" strokeWidth="1.35" opacity="0.55" />
      <circle cx="0" cy="0" r="14" strokeWidth="1.5" opacity="0.88" />
      <circle cx="0" cy="0" r="9" strokeWidth="1.1" opacity="0.65" />

      {/* 16-point rose */}
      {points.map((p, i) => (
        <RosePoint key={i} {...p} />
      ))}

      {/* Center boss — tiny skull (ink only) */}
      <circle cx="0" cy="0" r="6" fill={INK} stroke="none" opacity="0.92" />
      <g fill="none" stroke="#c9a878" strokeWidth="0.7">
        <ellipse cx="0" cy="-0.3" rx="3.4" ry="2.9" />
        <circle cx="-1.3" cy="-0.7" r="0.85" fill="#c9a878" stroke="none" />
        <circle cx="1.3" cy="-0.7" r="0.85" fill="#c9a878" stroke="none" />
        <path d="M-0.9 0.7 Q0 1.7 0.9 0.7" />
        <path d="M-1.8 1.5 H1.8" strokeWidth="0.45" />
      </g>

      {/* Cardinal chips — bold ink blocks so N/E/S/W read at a glance */}
      {[
        { t: 'N', x: 0, y: -92 },
        { t: 'E', x: 92, y: 6 },
        { t: 'S', x: 0, y: 98 },
        { t: 'W', x: -92, y: 6 },
      ].map((c) => (
        <g key={c.t}>
          <rect
            x={c.x - 14}
            y={c.y - 16}
            width="28"
            height="24"
            rx="4"
            fill={INK}
            stroke="#c9a878"
            strokeWidth="1.6"
            opacity="0.95"
          />
          <text
            x={c.x}
            y={c.y + 6}
            textAnchor="middle"
            fill="#f2e2c4"
            stroke="none"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="18"
            fontWeight="700"
            letterSpacing="0.04em"
          >
            {c.t}
          </text>
        </g>
      ))}
      {/* North fleur above the N chip */}
      <path
        d="M0 -118 L-5 -106 L0 -109 L5 -106 Z"
        fill={INK}
        stroke="none"
        opacity="0.95"
      />

      {/* Crossed cutlass hint behind rose (subtle) */}
      <path
        d="M-40 32 L40 -32 M-36 36 L-42 28 M36 -36 L42 -28"
        strokeWidth="1.15"
        opacity="0.28"
      />
      <path
        d="M-40 -32 L40 32 M-36 -36 L-42 -28 M36 36 L42 28"
        strokeWidth="1.15"
        opacity="0.28"
      />
    </g>
  )
}

function RosePoint({
  angle,
  len,
  major,
  mid,
}: {
  angle: number
  len: number
  major: boolean
  mid: boolean
}) {
  const rad = (angle * Math.PI) / 180
  const tipX = Math.sin(rad) * len
  const tipY = -Math.cos(rad) * len
  const spread = major ? 0.42 : mid ? 0.35 : 0.28
  const base = major ? 7 : mid ? 4.5 : 3
  const lx = Math.sin(rad - spread) * base
  const ly = -Math.cos(rad - spread) * base
  const rx = Math.sin(rad + spread) * base
  const ry = -Math.cos(rad + spread) * base

  return (
    <g>
      <path
        d={`M0 0 L${lx.toFixed(1)} ${ly.toFixed(1)} L${tipX.toFixed(1)} ${tipY.toFixed(1)} Z`}
        fill={INK}
        stroke="none"
        opacity={major ? 0.92 : mid ? 0.65 : 0.4}
      />
      <path
        d={`M0 0 L${rx.toFixed(1)} ${ry.toFixed(1)} L${tipX.toFixed(1)} ${tipY.toFixed(1)} Z`}
        fill="none"
        strokeWidth={major ? 1.25 : 0.95}
        opacity={major ? 0.95 : 0.7}
      />
      {major && (
        <path
          d={`M${(tipX * 0.35).toFixed(1)} ${(tipY * 0.35).toFixed(1)} L${(tipX * 0.72).toFixed(1)} ${(tipY * 0.72).toFixed(1)}`}
          strokeWidth="0.8"
          opacity="0.35"
        />
      )}
    </g>
  )
}

export function MapInkAmbience() {
  return (
    <svg className="map-ink" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <filter id="inkBleed" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.1" />
        </filter>
      </defs>

      <g filter="url(#inkBleed)">
        <g transform="translate(0, 18)">
          <TerrainMassif
            seed={3101}
            x={8}
            y={150}
            width={290}
            shade="right"
            layers={[
              {
                opacity: 0.45,
                yNudge: -24,
                wScale: 0.88,
                hScale: 0.65,
                peaks: [
                  { at: 0.2, h: 44 },
                  { at: 0.45, h: 56 },
                  { at: 0.7, h: 48 },
                ],
              },
              {
                opacity: 0.75,
                yNudge: -10,
                wScale: 0.95,
                hScale: 0.85,
                peaks: [
                  { at: 0.12, h: 58 },
                  { at: 0.34, h: 80 },
                  { at: 0.55, h: 70 },
                  { at: 0.78, h: 60 },
                ],
              },
              {
                opacity: 1,
                yNudge: 0,
                wScale: 1,
                hScale: 1,
                peaks: [
                  { at: 0.08, h: 62 },
                  { at: 0.22, h: 96 },
                  { at: 0.4, h: 124 },
                  { at: 0.56, h: 90 },
                  { at: 0.72, h: 108 },
                  { at: 0.9, h: 68 },
                ],
              },
            ]}
          />
        </g>

        <g transform="translate(675, 14)">
          <TerrainMassif
            seed={3201}
            x={0}
            y={145}
            width={270}
            shade="left"
            layers={[
              {
                opacity: 0.42,
                yNudge: -20,
                wScale: 0.9,
                hScale: 0.68,
                peaks: [
                  { at: 0.25, h: 42 },
                  { at: 0.55, h: 54 },
                  { at: 0.8, h: 40 },
                ],
              },
              {
                opacity: 0.72,
                yNudge: -8,
                wScale: 0.96,
                hScale: 0.86,
                peaks: [
                  { at: 0.15, h: 60 },
                  { at: 0.4, h: 84 },
                  { at: 0.65, h: 72 },
                  { at: 0.88, h: 52 },
                ],
              },
              {
                opacity: 1,
                yNudge: 0,
                wScale: 1,
                hScale: 1,
                peaks: [
                  { at: 0.1, h: 66 },
                  { at: 0.28, h: 112 },
                  { at: 0.48, h: 92 },
                  { at: 0.66, h: 126 },
                  { at: 0.88, h: 74 },
                ],
              },
            ]}
          />
        </g>

        <g transform="translate(0, 470)">
          <TerrainMassif
            seed={3301}
            x={6}
            y={125}
            width={220}
            shade="right"
            layers={[
              {
                opacity: 0.6,
                yNudge: -12,
                wScale: 0.92,
                hScale: 0.8,
                peaks: [
                  { at: 0.2, h: 44 },
                  { at: 0.5, h: 56 },
                  { at: 0.8, h: 42 },
                ],
              },
              {
                opacity: 1,
                yNudge: 0,
                wScale: 1,
                hScale: 1,
                peaks: [
                  { at: 0.1, h: 52 },
                  { at: 0.3, h: 82 },
                  { at: 0.52, h: 70 },
                  { at: 0.74, h: 88 },
                  { at: 0.92, h: 48 },
                ],
              },
            ]}
          />
          <ForestPatch seed={3310} x={180} y={80} cols={9} rows={5} />
          <River
            seed={3315}
            pts={[
              { x: 10, y: 132 },
              { x: 80, y: 112 },
              { x: 150, y: 136 },
              { x: 230, y: 118 },
              { x: 290, y: 138 },
            ]}
          />
        </g>

        {/* Pirate compass — island triangle gap, sized to read */}
        <g transform="translate(500, 445) scale(0.92)">
          <PirateCompass />
        </g>

        <g transform="translate(0, 268)">
          <TerrainMassif
            seed={3501}
            x={6}
            y={98}
            width={125}
            shade="right"
            layers={[
              {
                opacity: 0.55,
                yNudge: -10,
                wScale: 0.9,
                hScale: 0.75,
                peaks: [
                  { at: 0.3, h: 34 },
                  { at: 0.7, h: 40 },
                ],
              },
              {
                opacity: 1,
                yNudge: 0,
                wScale: 1,
                hScale: 1,
                peaks: [
                  { at: 0.15, h: 44 },
                  { at: 0.48, h: 68 },
                  { at: 0.8, h: 48 },
                ],
              },
            ]}
          />
        </g>

        {/* mid-right small range removed — was colliding with compass */}

        <River
          seed={3601}
          pts={[
            { x: 44, y: 188 },
            { x: 36, y: 252 },
            { x: 60, y: 316 },
            { x: 40, y: 380 },
            { x: 54, y: 448 },
            { x: 34, y: 515 },
          ]}
        />
        <River
          seed={3602}
          w={1.1}
          o={0.28}
          pts={[
            { x: 52, y: 188 },
            { x: 44, y: 252 },
            { x: 68, y: 316 },
            { x: 48, y: 380 },
            { x: 62, y: 448 },
            { x: 42, y: 515 },
          ]}
        />
        <River
          seed={3611}
          pts={[
            { x: 950, y: 170 },
            { x: 966, y: 242 },
            { x: 938, y: 318 },
            { x: 960, y: 398 },
            { x: 944, y: 478 },
            { x: 962, y: 552 },
          ]}
        />
      </g>
    </svg>
  )
}
