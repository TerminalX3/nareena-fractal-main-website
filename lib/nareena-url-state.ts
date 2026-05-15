import {
  JULIA_DEFAULT,
  MANDELBROT_DEFAULT,
  NAREENA_PRESET,
  type RenderParams,
} from "@/lib/nareena/renderFrame";

export const NAREENA_URL_VERSION = 4;

export type NareenaExplorerState = Omit<RenderParams, "width" | "height"> & {
  palette: number;
};

const DEFAULT_STATE: NareenaExplorerState = {
  ...NAREENA_PRESET,
  palette: 0,
};

export function clampNareenaState(
  s: Partial<NareenaExplorerState>,
): NareenaExplorerState {
  const out: NareenaExplorerState = { ...DEFAULT_STATE, ...s };
  out.mode = s.mode === "mandelbrot" ? "mandelbrot" : "julia";
  out.n = Math.min(12, Math.max(1.2, Number.isFinite(out.n) ? out.n : DEFAULT_STATE.n));
  out.maxIter = Math.min(
    500,
    Math.max(40, Number.isFinite(out.maxIter) ? Math.round(out.maxIter) : DEFAULT_STATE.maxIter),
  );
  out.bailout = Math.min(
    256,
    Math.max(4, Number.isFinite(out.bailout) ? out.bailout : DEFAULT_STATE.bailout),
  );
  out.zoom = Math.min(
    0.05,
    Math.max(0.00015, Number.isFinite(out.zoom) ? out.zoom : DEFAULT_STATE.zoom),
  );
  out.palette = Math.min(
    4,
    Math.max(
      0,
      Number.isFinite(out.palette)
        ? Math.round(out.palette)
        : DEFAULT_STATE.palette,
    ),
  );
  if (!Number.isFinite(out.cr)) out.cr = DEFAULT_STATE.cr;
  if (!Number.isFinite(out.ci)) out.ci = DEFAULT_STATE.ci;
  if (!Number.isFinite(out.centerRe)) out.centerRe = DEFAULT_STATE.centerRe;
  if (!Number.isFinite(out.centerIm)) out.centerIm = DEFAULT_STATE.centerIm;
  return out;
}

export function parseNareenaSearchParams(
  searchParams: URLSearchParams,
): NareenaExplorerState {
  const num = (key: string) => {
    const v = searchParams.get(key);
    if (v === null) return undefined;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const modeParam = searchParams.get("mode");
  const raw = clampNareenaState({
    mode: modeParam === "mandelbrot" ? "mandelbrot" : modeParam === "julia" ? "julia" : undefined,
    n: num("n"),
    cr: num("cr"),
    ci: num("ci"),
    maxIter: num("iter") ?? num("maxIter"),
    bailout: num("bailout"),
    centerRe: num("ox") ?? num("centerRe"),
    centerIm: num("oy") ?? num("centerIm"),
    zoom: num("zoom"),
    palette: num("p"),
  });

  if (searchParams.get("v") !== String(NAREENA_URL_VERSION)) {
    return clampNareenaState({ ...DEFAULT_STATE, palette: raw.palette });
  }

  return raw;
}

export function serializeNareenaState(s: NareenaExplorerState): string {
  const p = new URLSearchParams();
  p.set("v", String(NAREENA_URL_VERSION));
  p.set("mode", s.mode);
  p.set("n", s.n.toFixed(4));
  p.set("cr", s.cr.toFixed(6));
  p.set("ci", s.ci.toFixed(6));
  p.set("iter", String(s.maxIter));
  p.set("bailout", String(s.bailout));
  p.set("centerRe", s.centerRe.toFixed(6));
  p.set("centerIm", s.centerIm.toFixed(6));
  p.set("zoom", s.zoom.toFixed(6));
  p.set("p", String(s.palette));
  return p.toString();
}

export function applyPreset(
  preset: "nareena" | "julia" | "mandelbrot",
  current: NareenaExplorerState,
): NareenaExplorerState {
  const base =
    preset === "mandelbrot"
      ? MANDELBROT_DEFAULT
      : preset === "julia"
        ? JULIA_DEFAULT
        : NAREENA_PRESET;
  return clampNareenaState({ ...current, ...base });
}
