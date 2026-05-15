/** Interior fill — connected Julia / Mandelbrot basin */
export const INTERIOR_COLOR: [number, number, number] = [6, 8, 14];

type Rgb = [number, number, number];

const STOPS: { t: number; c: Rgb }[] = [
  { t: 0.0, c: [8, 12, 28] },
  { t: 0.12, c: [18, 42, 120] },
  { t: 0.28, c: [24, 140, 168] },
  { t: 0.45, c: [120, 220, 140] },
  { t: 0.62, c: [240, 210, 60] },
  { t: 0.78, c: [255, 120, 32] },
  { t: 0.92, c: [220, 40, 48] },
  { t: 1.0, c: [255, 230, 200] },
];

const PALETTE_SHIFTS = [0, 0.08, 0.16, 0.24, 0.32];

function sampleStops(t: number): Rgb {
  const u = Math.max(0, Math.min(1, t));
  for (let i = 1; i < STOPS.length; i++) {
    if (u <= STOPS[i].t) {
      const a = STOPS[i - 1];
      const b = STOPS[i];
      const w = (u - a.t) / (b.t - a.t);
      return [
        a.c[0] + (b.c[0] - a.c[0]) * w,
        a.c[1] + (b.c[1] - a.c[1]) * w,
        a.c[2] + (b.c[2] - a.c[2]) * w,
      ];
    }
  }
  return STOPS[STOPS.length - 1].c;
}

/** Escape-time colour for smooth t ∈ [0, 1]. */
export function escapeColor(t: number, paletteIndex = 0): Rgb {
  const shift = PALETTE_SHIFTS[paletteIndex % PALETTE_SHIFTS.length] ?? 0;
  const u = (t + shift) % 1;
  return sampleStops(Math.pow(u, 0.88));
}
