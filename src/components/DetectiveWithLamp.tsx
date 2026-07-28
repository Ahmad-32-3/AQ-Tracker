/**
 * Noir detective silhouette holding the swinging lantern.
 * Lamp pivot = his fist — he “grabs” the light; cord hangs from the hand.
 */
export function DetectiveWithLamp({ walking = true }: { walking?: boolean }) {
  return (
    <div className="detective-stage" aria-hidden>
      <div className={`detective-unit${walking ? '' : ' detective-unit--still'}`}>
        <svg
          className="detective-svg"
          viewBox="0 0 200 320"
          role="img"
          aria-label="Detective silhouette holding a lamp"
        >
          <path d="M78 210 L70 300 L88 300 L92 230 Z" fill="#0a0908" />
          <path d="M108 208 L118 302 L136 300 L122 225 Z" fill="#050504" />
          <path
            d="M70 95
               C68 130 62 170 70 210
               L130 208
               C138 165 136 125 128 95
               C118 88 80 88 70 95 Z"
            fill="#0c0b0a"
          />
          <path d="M72 175 L58 250 L78 248 L88 200 Z" fill="#080706" opacity="0.9" />
          <path d="M120 172 L145 252 L128 250 L112 198 Z" fill="#060504" />
          <path
            d="M118 115
               C145 95 165 78 178 58
               L188 64
               C172 88 150 108 128 128
               Z"
            fill="#0a0908"
          />
          <ellipse cx="186" cy="56" rx="12" ry="10" fill="#050504" />
          <path d="M88 100 L100 118 L112 100 L100 92 Z" fill="#050504" />
          <ellipse cx="100" cy="72" rx="22" ry="26" fill="#0a0908" />
          <ellipse cx="100" cy="58" rx="34" ry="8" fill="#050504" />
          <path d="M78 58 Q100 28 122 58 Z" fill="#0a0908" />
          <ellipse cx="100" cy="52" rx="20" ry="6" fill="#050504" />
        </svg>

        <div className="lamp-rig lamp-rig--held">
          <div className="lamp-cord lamp-cord--short" />
          <div className="lamp-fixture">
            <div className="lamp-shade" />
            <div className="lamp-bulb" />
          </div>
          <div className="lamp-beam" />
        </div>
      </div>
    </div>
  )
}
