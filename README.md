# Pakistan: Air & Heat

Noir alley intro → coffee parchment map → live air & heat advice for **Lahore**, **Karachi**, and **Islamabad**.

Built with React + Vite + TypeScript. Weather and air quality from [Open-Meteo](https://open-meteo.com/).

## Try it

```bash
npm install
npm run dev
```

Open **http://127.0.0.1:5173/**

## How it works

1. **Intro** — walk a dim brick alley; gutter smoke rises; zoom into the wall map
2. **Map** — coffee-stained parchment with three ink landmarks
3. **City report** — tap a landmark; black fog clears onto AQI, heat, and A1–A12 advice
4. **Replay intro** — top-left button restarts the alley beat (map stays home otherwise)

## Stack

- React 19 + Vite
- Open-Meteo air-quality + forecast APIs
- Custom scoring / profile toggles (kids, sensitive lungs, outdoor work, school)

## Repo notes

Passion / experimental build. Phase plan lives in `PHASES.md`.
