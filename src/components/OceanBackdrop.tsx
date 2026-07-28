/** Full-bleed cartoony ocean + sky — SVG so waves read as water, not a flat band. */
export function OceanBackdrop() {
  return (
    <div className="ocean-backdrop" aria-hidden>
      <svg className="ocean-backdrop-svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6c98a" />
            <stop offset="45%" stopColor="#f0d9b0" />
            <stop offset="100%" stopColor="#9fd0e0" />
          </linearGradient>
          <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7ec8de" />
            <stop offset="35%" stopColor="#4aa7c4" />
            <stop offset="100%" stopColor="#2a6f94" />
          </linearGradient>
          <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe9a8" />
            <stop offset="100%" stopColor="#f0a94a" />
          </linearGradient>
        </defs>

        <rect width="1200" height="800" fill="url(#skyGrad)" />

        {/* soft sun */}
        <circle cx="980" cy="120" r="64" fill="url(#sunGrad)" opacity="0.95" />
        <circle cx="980" cy="120" r="88" fill="#ffe9a8" opacity="0.2" />

        {/* distant haze band */}
        <ellipse cx="600" cy="340" rx="700" ry="48" fill="#dfeff4" opacity="0.35" />

        {/* ocean body */}
        <path
          d="M0 360
             C150 340 300 380 450 355
             C600 330 750 375 900 350
             C1050 325 1150 360 1200 345
             L1200 800 L0 800 Z"
          fill="url(#seaGrad)"
        />

        {/* layered cartoon wave ridges */}
        <path
          className="sea-ridge sea-ridge--1"
          d="M-40 410 C120 385 240 435 400 410 C560 385 700 440 860 415 C1000 395 1120 430 1240 410"
          fill="none"
          stroke="#b7e8f5"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          className="sea-ridge sea-ridge--2"
          d="M-20 470 C140 445 280 500 440 470 C620 435 760 505 940 475 C1080 455 1180 490 1260 470"
          fill="none"
          stroke="#9fdcf0"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          className="sea-ridge sea-ridge--3"
          d="M-30 540 C160 515 300 570 470 545 C650 515 800 580 980 550 C1100 532 1200 560 1260 545"
          fill="none"
          stroke="#7ec8de"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* foam scallops near mid */}
        <path
          d="M80 390 Q110 375 140 390 Q170 405 200 390 Q230 375 260 390"
          fill="none"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M720 400 Q750 385 780 400 Q810 415 840 400 Q870 385 900 400"
          fill="none"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* deep water tint at bottom */}
        <rect x="0" y="640" width="1200" height="160" fill="#1f5678" opacity="0.35" />

        {/* tiny birds */}
        <path d="M220 150 Q230 142 240 150" fill="none" stroke="#5a6a70" strokeWidth="3" strokeLinecap="round" />
        <path d="M250 165 Q262 155 274 165" fill="none" stroke="#5a6a70" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  )
}
