import { useCallback } from 'react'
import { DetectiveWithLamp } from './DetectiveWithLamp'
import { GutterSmoke } from './GutterSmoke'
import { WallMapPoster } from './WallMapPoster'
import { SmokeCurtain } from './SmokeCurtain'
import { useAlleyIntro } from '../hooks/useAlleyIntro'

/**
 * Phase 2 alley beat:
 * walk → halt → gutter smoke → map on wall → smoke engulfs → zoom into map.
 */
export function BrickAlley({ onComplete }: { onComplete?: () => void }) {
  const handleComplete = useCallback(() => onComplete?.(), [onComplete])
  const bricks = buildBricks()
  const beat = useAlleyIntro(true, handleComplete)
  const stopped = beat !== 'walking'
  const smoking =
    beat === 'smoking' || beat === 'mapLit' || beat === 'engulfing' || beat === 'zooming'
  const mapLit = beat === 'mapLit' || beat === 'engulfing' || beat === 'zooming'
  const engulfing = beat === 'engulfing' || beat === 'zooming'
  const zooming = beat === 'zooming'

  const curtainMode = zooming ? 'peak' : engulfing ? 'engulf' : 'off'

  return (
    <div
      className={`alley alley--${beat}${stopped ? ' alley--halted' : ''}${zooming ? ' alley--zooming' : ''}`}
      data-beat={beat}
    >
      <div className="alley-sky" aria-hidden />

      <div className={`alley-scroll${stopped ? ' alley-scroll--paused' : ''}`} aria-hidden>
        <WallStrip bricks={bricks} idPrefix="a" />
        <WallStrip bricks={bricks} idPrefix="b" />
      </div>

      <WallMapPoster lit={mapLit} />

      <GutterSmoke active={smoking} lit={smoking} />

      <DetectiveWithLamp walking={!stopped} />

      <div className="alley-vignette" aria-hidden />

      <div className="alley-caption">
        <p className="alley-eyebrow">Phase 2 · Alley beat</p>
        <h1>Noir alley</h1>
        <p>{captionFor(beat)}</p>
      </div>

      <SmokeCurtain mode={curtainMode} />
    </div>
  )
}

function captionFor(beat: string) {
  switch (beat) {
    case 'walking':
      return 'Walking the bricks…'
    case 'stopped':
      return 'Something’s rising from the gutter…'
    case 'smoking':
      return 'Black smoke fills the lane…'
    case 'mapLit':
      return 'The lamp finds a map on the wall.'
    case 'engulfing':
      return 'Smoke swallows the alley…'
    case 'zooming':
      return 'Into the map—'
    default:
      return ''
  }
}

type Brick = { key: string; x: number; y: number; w: number; h: number; fill: string }

function WallStrip({ bricks, idPrefix }: { bricks: Brick[]; idPrefix: string }) {
  return (
    <svg
      className="alley-strip"
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${idPrefix}-pathGrad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3f32" />
          <stop offset="100%" stopColor="#1a1510" />
        </linearGradient>
      </defs>

      <rect x="0" y="90" width="1200" height="430" fill="#2a1c18" />

      {bricks.map((b) => (
        <g key={`${idPrefix}-${b.key}`}>
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="3"
            fill={b.fill}
            stroke="#1a0e0c"
            strokeWidth="2.5"
          />
          <rect
            x={b.x + 6}
            y={b.y + 4}
            width={Math.min(22, b.w * 0.35)}
            height="4"
            rx="1"
            fill="#c48a6a"
            opacity="0.35"
          />
        </g>
      ))}

      <path
        d="M0 90
           L70 90 L95 130 L150 100 L200 145 L260 90
           L340 90 L370 135 L430 105 L500 150 L560 90
           L640 90 L675 140 L740 110 L800 155 L870 90
           L950 90 L990 138 L1060 108 L1120 148 L1200 90
           L1200 40 L0 40 Z"
        fill="#0d0a12"
      />

      <path
        d="M180 250 C210 210 300 215 330 265 C355 310 300 370 230 360 C165 350 150 290 180 250Z"
        fill="#120c0a"
        stroke="#0a0605"
        strokeWidth="4"
      />
      <path
        d="M200 270 C225 245 285 250 295 280 C305 310 260 335 220 325 C185 315 180 290 200 270Z"
        fill="#0a0605"
      />
      <path
        d="M680 270 C720 225 850 230 890 285 C920 330 870 395 780 400 C690 405 645 330 680 270Z"
        fill="#120c0a"
        stroke="#0a0605"
        strokeWidth="4"
      />
      <path
        d="M710 295 C745 265 830 275 845 310 C860 345 800 365 745 355 C700 348 690 315 710 295Z"
        fill="#0a0605"
      />

      <rect
        x="240"
        y="220"
        width="70"
        height="28"
        rx="3"
        fill="#a85a42"
        stroke="#1a0e0c"
        strokeWidth="2.5"
        transform="rotate(-22 240 220)"
      />
      <rect
        x="760"
        y="235"
        width="75"
        height="28"
        rx="3"
        fill="#8f4a36"
        stroke="#1a0e0c"
        strokeWidth="2.5"
        transform="rotate(16 760 235)"
      />
      <rect
        x="420"
        y="480"
        width="72"
        height="28"
        rx="3"
        fill="#9a5540"
        stroke="#1a0e0c"
        strokeWidth="2.5"
        transform="rotate(-9 420 480)"
      />
      <rect
        x="880"
        y="495"
        width="68"
        height="28"
        rx="3"
        fill="#7a4030"
        stroke="#1a0e0c"
        strokeWidth="2.5"
        transform="rotate(20 880 495)"
      />

      <path
        d="M520 160 L535 240 L515 320 L540 400 L510 480"
        fill="none"
        stroke="#0a0605"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M1000 180 L985 280 L1010 380 L980 470"
        fill="none"
        stroke="#0a0605"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      <rect x="0" y="510" width="1200" height="30" fill="#1a1210" />
      <path d="M0 540 L1200 520 L1200 800 L0 800 Z" fill={`url(#${idPrefix}-pathGrad)`} />
      <path
        d="M80 600 L160 720 M380 560 L410 740 M650 580 L720 760 M950 570 L1020 730"
        fill="none"
        stroke="#0c0a08"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <ellipse cx="540" cy="700" rx="90" ry="18" fill="#152838" opacity="0.7" />
      <ellipse cx="540" cy="696" rx="50" ry="7" fill="#3a6a88" opacity="0.3" />
    </svg>
  )
}

function buildBricks(): Brick[] {
  const colors = ['#b85c42', '#9e4a34', '#c46a4e', '#8a4030', '#a8543c', '#d07858']
  const out: Brick[] = []
  const brickW = 88
  const brickH = 34
  const gap = 5
  let i = 0

  for (let row = 0; row < 11; row++) {
    const y = 95 + row * (brickH + gap)
    const offset = row % 2 === 0 ? 0 : brickW / 2
    for (let col = -1; col < 15; col++) {
      const x = offset + col * (brickW + gap)
      if (inHole(x + brickW / 2, y + brickH / 2)) continue
      out.push({
        key: `${row}-${col}`,
        x,
        y,
        w: brickW,
        h: brickH,
        fill: colors[i++ % colors.length],
      })
    }
  }
  return out
}

function inHole(cx: number, cy: number) {
  const hole1 = (cx - 250) ** 2 / 90 ** 2 + (cy - 300) ** 2 / 70 ** 2 < 1
  const hole2 = (cx - 780) ** 2 / 120 ** 2 + (cy - 330) ** 2 / 80 ** 2 < 1
  return hole1 || hole2
}
