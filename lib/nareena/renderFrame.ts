import type { Cx } from "./complex";
import { cx, add, powReal, abs2 } from "./complex";
import { escapeColor, INTERIOR_COLOR } from "./colorMap";

export interface RenderParams {
  mode: "julia" | "mandelbrot";
  n: number;
  cr: number;
  ci: number;
  maxIter: number;
  bailout: number;
  centerRe: number;
  centerIm: number;
  zoom: number;
  width: number;
  height: number;
  paletteIndex?: number;
}

function iterate(
  z0: Cx,
  c: Cx,
  n: number,
  maxIter: number,
  bailout: number,
): number {
  let z = z0;
  const effectiveBailout = Math.max(bailout, Math.pow(n, n));
  const logB = Math.log(effectiveBailout);
  const logN = Math.log(Math.max(n, 1.0001));

  for (let i = 0; i < maxIter; i++) {
    z = add(powReal(z, n), c);
    const r2 = abs2(z);
    if (r2 > effectiveBailout) {
      const logRatio = Math.log(r2) / logB;
      const correction = logRatio > 1 ? Math.log(logRatio) / logN : 0;
      const smooth = i + 1 - correction;
      return Math.max(0, Math.min(1, smooth / maxIter));
    }
  }
  return -1;
}

export function renderFrame(
  buf: Uint8ClampedArray,
  p: RenderParams,
): void {
  const {
    mode,
    n,
    cr,
    ci,
    maxIter,
    bailout,
    centerRe,
    centerIm,
    zoom,
    width,
    height,
    paletteIndex = 0,
  } = p;
  const hw = width / 2;
  const hh = height / 2;
  const c = cx(cr, ci);

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const re = centerRe + (px - hw) * zoom;
      const im = centerIm - (py - hh) * zoom;

      const t =
        mode === "julia"
          ? iterate(cx(re, im), c, n, maxIter, bailout)
          : iterate(cx(0, 0), cx(re, im), n, maxIter, bailout);

      const idx = (py * width + px) * 4;
      if (t < 0) {
        buf[idx] = INTERIOR_COLOR[0];
        buf[idx + 1] = INTERIOR_COLOR[1];
        buf[idx + 2] = INTERIOR_COLOR[2];
        buf[idx + 3] = 255;
      } else {
        const [r, g, b] = escapeColor(t, paletteIndex);
        buf[idx] = r;
        buf[idx + 1] = g;
        buf[idx + 2] = b;
        buf[idx + 3] = 255;
      }
    }
  }
}

export const NAREENA_PRESET: Omit<RenderParams, "width" | "height"> = {
  mode: "julia",
  n: 2.0,
  cr: -0.4,
  ci: 0.6,
  maxIter: 220,
  bailout: 4,
  centerRe: 0,
  centerIm: 0,
  zoom: 0.004,
};

export const JULIA_DEFAULT: Omit<RenderParams, "width" | "height"> = {
  mode: "julia",
  n: 2.0,
  cr: -0.7,
  ci: 0.27,
  maxIter: 200,
  bailout: 4,
  centerRe: 0,
  centerIm: 0,
  zoom: 0.0035,
};

export const MANDELBROT_DEFAULT: Omit<RenderParams, "width" | "height"> = {
  mode: "mandelbrot",
  n: 2.0,
  cr: 0,
  ci: 0,
  maxIter: 200,
  bailout: 4,
  centerRe: -0.5,
  centerIm: 0,
  zoom: 0.003,
};
