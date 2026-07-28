/**
 * Hanging lantern — pendulum swing + beam intensity.
 * No character yet; light does the storytelling.
 */
export function SwingingLamp() {
  return (
    <div className="lamp-stage" aria-hidden>
      <div className="lamp-rig">
        <div className="lamp-cord" />
        <div className="lamp-fixture">
          <div className="lamp-shade" />
          <div className="lamp-bulb" />
        </div>
        {/* Soft pool of light that travels with the bulb */}
        <div className="lamp-beam" />
      </div>
    </div>
  )
}
