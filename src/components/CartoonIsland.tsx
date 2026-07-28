import type { CityId } from '../data/cities'

type Props = {
  cityId: CityId
  className?: string
}

/** Hand-drawn-ish cartoon islands — real landmass shapes, not circles. */
export function CartoonIsland({ cityId, className }: Props) {
  if (cityId === 'lahore') return <LahoreIsland className={className} />
  if (cityId === 'karachi') return <KarachiIsland className={className} />
  return <IslamabadIsland className={className} />
}

function LahoreIsland({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 180"
      role="img"
      aria-label="Cartoon island for Lahore"
    >
      <ellipse cx="110" cy="158" rx="78" ry="12" fill="#2a6f8f" opacity="0.35" />
      {/* underwater shelf */}
      <path
        d="M42 128 C55 142 85 150 110 150 C145 150 175 140 188 128 C170 136 140 142 110 142 C80 142 55 136 42 128Z"
        fill="#3d8f6a"
      />
      {/* sand ring */}
      <path
        d="M48 120 C40 100 52 78 78 70 C95 64 105 58 118 52 C140 42 168 55 178 78 C186 98 180 118 168 124 C145 136 90 138 48 120Z"
        fill="#f0d5a0"
      />
      {/* grassy top — uneven island silhouette */}
      <path
        d="M58 112 C50 92 62 76 84 70 C98 66 108 58 122 54 C148 46 168 62 172 82 C176 100 168 116 152 120 C128 128 82 126 58 112Z"
        fill="#6bb56a"
      />
      <path
        d="M70 108 C68 92 82 80 100 78 C118 76 138 84 142 98 C146 110 136 118 118 120 C96 122 78 118 70 108Z"
        fill="#5aa45c"
        opacity="0.55"
      />
      {/* small dome / fort nod */}
      <path d="M108 78 L108 58 L128 58 L128 78Z" fill="#d4a574" />
      <path d="M104 58 Q118 42 132 58Z" fill="#c45c26" />
      <circle cx="118" cy="50" r="3.5" fill="#f5e6c8" />
      {/* palm */}
      <Palm x={72} y={88} lean={-8} />
      <Palm x={158} y={92} lean={10} scale={0.85} />
      {/* kite accent */}
      <g transform="translate(168 38) rotate(18)">
        <path d="M0 0 L12 8 L0 16 L-4 8Z" fill="#e85d4c" />
        <path d="M12 8 Q28 18 22 32" fill="none" stroke="#fff8ee" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

function KarachiIsland({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 180"
      role="img"
      aria-label="Cartoon island for Karachi"
    >
      <ellipse cx="110" cy="160" rx="82" ry="11" fill="#1f5f7a" opacity="0.4" />
      <path
        d="M38 132 C60 148 95 156 118 154 C155 150 185 138 192 128 C175 140 140 148 110 148 C78 148 52 140 38 132Z"
        fill="#2f8f7a"
      />
      {/* long coastal landmass */}
      <path
        d="M36 118 C28 95 48 72 78 68 C100 64 120 70 145 66 C175 60 198 78 196 102 C194 122 175 132 150 136 C115 142 70 140 36 118Z"
        fill="#e8c98a"
      />
      <path
        d="M48 112 C44 92 64 76 90 74 C115 72 140 78 158 76 C180 74 188 92 184 108 C178 124 150 130 120 132 C85 134 58 126 48 112Z"
        fill="#4fa89a"
      />
      <path
        d="M62 108 C60 94 78 84 102 86 C128 88 150 94 156 106 C160 116 145 122 118 124 C88 126 70 118 62 108Z"
        fill="#3d9084"
        opacity="0.5"
      />
      {/* pier */}
      <rect x="150" y="118" width="38" height="6" rx="2" fill="#8b6914" />
      <rect x="156" y="124" width="4" height="14" fill="#6e5210" />
      <rect x="178" y="124" width="4" height="14" fill="#6e5210" />
      {/* little boat */}
      <path d="M168 114 L198 114 L190 122 L174 122Z" fill="#0d6e6e" />
      <path d="M182 114 L182 98 L192 114Z" fill="#fff8ee" />
      <Palm x={64} y={86} lean={-6} />
      <Palm x={118} y={80} lean={4} scale={1.05} />
      {/* sun glint on water near shore */}
      <path
        d="M70 138 Q90 132 110 138 Q130 144 150 136"
        fill="none"
        stroke="#b8f0ff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

function IslamabadIsland({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 180"
      role="img"
      aria-label="Cartoon island for Islamabad"
    >
      <ellipse cx="112" cy="158" rx="74" ry="11" fill="#2a6f8f" opacity="0.35" />
      <path
        d="M48 130 C65 144 95 150 118 148 C148 146 172 136 182 126 C165 136 140 142 112 142 C84 142 60 136 48 130Z"
        fill="#3d7a5c"
      />
      {/* taller / hillier footprint */}
      <path
        d="M55 122 C42 98 58 70 88 58 C105 50 120 42 138 48 C165 56 182 78 178 102 C174 122 155 132 130 136 C95 142 72 136 55 122Z"
        fill="#d7c49a"
      />
      {/* main green mound */}
      <path
        d="M62 116 C54 96 70 74 96 66 C115 60 132 54 148 62 C168 72 174 94 168 110 C160 126 135 132 108 132 C82 132 70 126 62 116Z"
        fill="#4f9b58"
      />
      {/* margalla ridge peaks */}
      <path d="M78 88 L98 52 L118 88Z" fill="#2f6b3a" />
      <path d="M108 92 L128 58 L148 94Z" fill="#3d7d45" />
      <path d="M98 52 L104 60 L98 66 L92 60Z" fill="#e8f2ea" opacity="0.85" />
      <path d="M128 58 L133 66 L128 70 L122 64Z" fill="#e8f2ea" opacity="0.7" />
      {/* pines */}
      <Pine x={70} y={100} />
      <Pine x={158} y={104} scale={0.9} />
      <Pine x={88} y={110} scale={0.75} />
    </svg>
  )
}

function Palm({
  x,
  y,
  lean = 0,
  scale = 1,
}: {
  x: number
  y: number
  lean?: number
  scale?: number
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${lean}) scale(${scale})`}>
      <path d="M0 0 Q2 18 0 36" fill="none" stroke="#6b4a1e" strokeWidth="4" strokeLinecap="round" />
      <path d="M0 2 Q-22 -6 -28 8" fill="#3d9b4a" />
      <path d="M0 2 Q22 -8 28 6" fill="#4aaf58" />
      <path d="M0 0 Q-8 -24 6 -26" fill="#57c064" />
      <path d="M0 0 Q12 -20 18 -10" fill="#3d9b4a" />
    </g>
  )
}

function Pine({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-2" y="18" width="4" height="10" fill="#5c3d1e" />
      <path d="M0 0 L12 16 L-12 16Z" fill="#2f6b3a" />
      <path d="M0 6 L14 24 L-14 24Z" fill="#3d7d45" />
      <path d="M0 14 L16 32 L-16 32Z" fill="#2f6b3a" />
    </g>
  )
}
