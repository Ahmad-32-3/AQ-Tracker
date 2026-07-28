# Phase 2 — Alley walk → gutter smoke → zoom → map reveal

**Status:** Implemented. Replay with the **Alley** phase-bar button.

**Beat:** Walk ~5s → halt → one gutter plume → wall map lights → smoke engulfs screen → zoom into poster → handoff to `CoffeeMap` as smoke parts.

---

## Beat timeline

| t | What the player sees |
|---|----------------------|
| 0.0–5.0s | Detective + lamp; wall scrolls |
| ~5.0s | Scroll pauses |
| ~5.4s | Single floor gutter smoke rises |
| ~7.6s | Wall map poster lights under lamp |
| ~9.4s | Full-screen smoke engulfs |
| ~10.0s | Zoom into the wall poster |
| ~11.6s | Cut to coffee map under black smoke; smoke parts to reveal parchment |

Reduced-motion: short-circuit to map handoff.

---

## Part A — Stop the infinite scroll at 5s

**Current:** `.alley-scroll` uses infinite `alleyScrollLeft` CSS animation (two wall strips).

**Approach (recommended):**
1. Keep CSS animation for the walk (GPU-friendly).
2. In `BrickAlley` (or a tiny `useIntroTimeline` hook), after **5000ms** add a class like `alley-scroll--halt`.
3. Halt technique options:
   - **A1 (best feel):** `animation-play-state: paused` at 5s — simplest, stops mid-loop wherever it is.
   - **A2 (smoother):** over last ~400ms, also apply `animation-timing-function` / or switch to a short `transform` transition that continues the current offset then settles (needs reading `getAnimations()[0].currentTime` or using WAAPI).
   - **A3:** replace infinite CSS with **WAAPI** `element.animate([...], { duration: 5000, easing: 'linear', fill: 'forwards' })` so stop is baked into the animation.

**Pick for v1:** A1 (pause) + optional 300ms opacity vignette dip so the freeze feels intentional. Upgrade to A3 if pause feels abrupt.

**Research note:** CSS `animation-play-state: paused` is the standard way to freeze infinite marquees without JS transform math.

---

## Part B — Floor gutter (emitter)

**What to build:** A dark grate / storm drain in the lower third of the alley, slightly in front of the wall, near where smoke should rise (favor lamp beam path — slightly off-center toward detective’s light).

**Implementation:**
- SVG or CSS box: rectangle grate with bar lines, dark fill, subtle rust highlight.
- Position: `position: absolute; bottom: 8–14%; left: 35–45%; z-index` between floor and detective (or behind detective legs if we want him walking “past” it — prefer **in front of wall, behind detective** so smoke layers correctly).
- Optional: tiny puddle ellipse + wet highlight so it reads as a gutter, not a UI chrome.

No research risk — pure scene prop.

---

## Part C — Black smoke from the gutter

**Look:** Thick, dark, oily noir smoke — not white steam. Rises, drifts, soft edges.

**Techniques researched (pick a stack):**

### C1 — Layered CSS puffs (base layer — do this first)
- Several absolutely positioned ellipses / blobs at the gutter mouth.
- `radial-gradient` cores → transparent edges.
- `filter: blur(12–28px)`.
- Keyframes: `translateY` up + slight `translateX` curl + `scale` + fade.
- Stagger delays for continuous plume.
- Sources: pure-CSS smoke patterns (layered blurred radials + rise/curl keyframes).

### C2 — SVG turbulence distortion (makes it “alive”)
- Hidden SVG filter: `feTurbulence` (fractalNoise) + `feDisplacementMap` on the smoke group.
- Optional: animate `baseFrequency` lightly via SMIL or rAF for shifting wisps (Codrops / iCSS smoke-filter pattern).
- Keep `numOctaves` low (2–3) for perf.

### C3 — Blend mode for “black” smoke that still reacts to light
- For **dark smoke that occludes:** `mix-blend-mode: multiply` or dark fills with alpha on the alley.
- For **lit edges when lamp hits:** a **second** smoke layer using lighter gray / warm amber at low alpha with `mix-blend-mode: screen` **only inside the lamp beam mask** (see Part D).
- Parent: `isolation: isolate` so blend modes don’t bleach the whole page.

### C4 — Reuse / don’t confuse with `FogOverlay`
- Existing `FogOverlay` is **side cloud banks** for city transitions — wrong shape/motion for gutter smoke.
- Build a new `GutterSmoke` component; leave `FogOverlay` for Phase 3.

**v1 stack:** C1 + C2 + dark multiply plume.  
**v1.5:** add lit wisps (C3) gated by lamp mask.

**Perf:** Prefer 4–8 DOM puffs over canvas particles unless we need hundreds of sprites. Avoid animating huge full-screen filters every frame on mobile.

---

## Part D — Lamp light shining through smoke

**Intent:** Smoke is mostly black; when the swinging beam crosses it, you get brighter, volumetric streaks — then the wall map reads.

**How (research-backed):**

1. **Keep current lamp beam** (`DetectiveWithLamp` / beam with `mix-blend-mode: screen`).
2. **Mask or clip a “lit smoke” layer** to the beam shape:
   - Duplicate smoke as a light-colored / desaturated layer.
   - Apply CSS `mask-image` matching the beam cone (or an SVG `<mask>` driven by the same swing transform as the lamp).
   - Lit layer uses `mix-blend-mode: screen` so it only **adds** light (volumetric fog / hero-light patterns use the same idea).
3. **Sync with swing:** put lit-smoke group inside the same swinging transform as the lamp (or CSS variable `--lamp-angle` updated once — swing is already CSS keyframes; nesting under `.lamp-swing` is easiest).
4. Optional: when beam is near bottom of arc (intensity peak you already have), bump lit-smoke opacity — reinforces “light punching through.”

**Fallback if mask is fiddly:** full smoke stays dark; a soft **beam caustic** (extra blurred ellipse) appears on the wall only while smoke opacity is high — cheaper, slightly less “volumetric.”

---

## Part E — Map stuck to the brick wall

**What:** A poster / pasted sheet on the scrolling wall strip — coffee parchment mini-preview (can be a scaled-down static snapshot of `CoffeeMap` art, or a simplified SVG poster).

**Implementation options:**

| Option | Pros | Cons |
|--------|------|------|
| **E1. Decal on wall SVG** | Parallax-scrolls with bricks; feels stuck to wall | Must live in both wall strips or only strip A at a known x |
| **E2. Fixed overlay** that fades in after scroll stops | Easy to light/mask; no dual-strip sync | Less “stuck to moving bricks” during walk |
| **E3. Hybrid** | Poster rides wall until halt, then we freeze | Slightly more state |

**Recommended:** **E1 for authenticity** once scroll is paused — bake a `MapPoster` group into `WallStrip` at a fixed x (e.g. center of strip). Because we **pause** scroll at 5s, we can tune start offset / duration so the poster lands roughly mid-frame when paused (or use A3 WAAPI with a known end transform).

**Reveal technique:**
- Poster starts `opacity: 0` / very dark (`brightness(0.2)`).
- After smoke builds, raise opacity and brightness **only under lamp+smoke** via:
  - overlapping soft light radial, or
  - SVG/CSS mask tied to beam, or
  - simple timed fade once smoke is thick (v1) then refine with beam mask (v1.5).
- Tape corners / slightly crooked `rotate(-2deg)` / torn edge path so it reads as pasted paper, not a UI card.
- Content: miniature parchment + tiny island marks (static), not a live interactive `CoffeeMap` yet.

---

## Part F — Orchestration (React state machine)

```
idle → walking (0–5s) → stopping → smoking → revealing → holding
```

- Single `useEffect` + `setTimeout` chain **or** one rAF clock reading `performance.now()`.
- Classes on `.alley`: `alley--walking | alley--stopped | alley--smoking | alley--map-lit`.
- Phase bar “Map” still forces full `CoffeeMap` for art preview (dev escape hatch).
- Later Phase 2b: from `holding`, click map or auto-zoom → full screen coffee map.

---

## Build order (implement in this sequence)

1. **Timed scroll halt** (5s + pause class) — prove the beat boundary.
2. **Gutter prop** on the floor.
3. **Dark gutter smoke** (CSS puffs + optional turbulence).
4. **Map poster on wall** (dark → visible timed fade).
5. **Lamp-through-smoke polish** (lit smoke mask / beam sync).
6. **Timing pass** + reduced-motion path.
7. **(Later)** Zoom into poster → full `CoffeeMap`.

---

## Out of scope this slice

- Full-screen route swap to map as the only ending
- Island clicks / fog / metrics
- Replay button
- Perfect physics smoke simulation / WebGL

---

## Success criteria

- Walk clearly ends (~5s), not infinite.
- Smoke reads as coming **from the gutter**.
- Map feels **on the brick wall**, not a floating UI.
- Lamp swing noticeably **helps** the map read through smoke.
- Zoom is **not** required for this slice to “pass.”
