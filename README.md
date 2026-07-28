# Pakistan: Air & Heat

Noir alley intro into a coffee parchment map, then live air & heat advice for **Lahore**, **Karachi**, and **Islamabad**.

Built with React + Vite + TypeScript. Weather and air quality from [Open-Meteo](https://open-meteo.com/).

## Intro clip

Clip of the full alley introduction (gutter smoke, zoom, map reveal).

<video src="https://github.com/Ahmad-32-3/AQ-Tracker/raw/main/docs/AQ-Intro.mp4" controls width="720"></video>

[Open the intro clip](docs/AQ-Intro.mp4)

## Try it

```bash
npm install
npm run dev
```

Open **http://127.0.0.1:5173/**

## How it works

1. **Intro:** walk a dim brick alley; gutter smoke rises; zoom into the wall map
2. **Map:** coffee-stained parchment with three ink landmarks
3. **City report:** tap a landmark; black fog clears onto AQI, heat, and A1-A12 advice
4. **Replay intro:** top-left button restarts the alley beat (map stays home otherwise)

## Stack

- **UI:** React 19 + React DOM, Vite 6 (`@vitejs/plugin-react`), TypeScript 5.8
- **Styling:** hand-authored CSS (parchment textures, SVG filters, alley / fog / smoke motion)
- **Fonts:** Fraunces + Nunito (Google Fonts)
- **Data:** Open-Meteo Air Quality API (`pm2_5`, US AQI) and Forecast API (feels-like temperature, trends)
- **Logic:** custom scoring in `src/lib/scoring.ts` (air + heat scores, A1-A12 recommendations) with profile toggles for kids, sensitive lungs, outdoor work, and school
- **Cities:** Lahore, Karachi, Islamabad (`src/data/cities.ts`)

## Repo notes

Passion / experimental build. Phase plan lives in `PHASES.md`.
