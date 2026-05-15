/** Shareable fractal explorer state via query parameters */

export const FRACTAL_URL_VERSION = 2;

/** Matches the reference renderer plane extent (±2.5). */
export const PLANE_HALF = 2.5;

export type FractalExplorerState = {
  /** Maximum escape-time iterations (reference default 80). */
  n: number;
  ox: number;
  oy: number;
  /**
   * Magnification: 1 = full reference plane (±2.5), 2 = 2× zoomed in, etc.
   */
  zoom: number;
  palette: number;
  drift: number;
};

const DEFAULT_STATE: FractalExplorerState = {
  n: 80,
  ox: 0,
  oy: 0,
  zoom: 1,
  palette: 0,
  drift: 0,
};

/** Convert pre-v2 URLs that stored half-extent or stale pinch-zoom values. */
export function migrateLegacyExplorerState(
  s: FractalExplorerState,
): FractalExplorerState {
  const out = { ...s };

  if (out.zoom < 0.5) {
    out.zoom = 1;
  } else if (out.zoom <= 6) {
    out.zoom = PLANE_HALF / out.zoom;
  } else {
    out.zoom = 1;
  }

  if (out.n < 20) out.n = DEFAULT_STATE.n;

  if (Math.abs(out.ox) > 1.5 || Math.abs(out.oy) > 1.5) {
    out.ox = 0;
    out.oy = 0;
  }

  return clampState(out);
}

export function clampState(s: Partial<FractalExplorerState>): FractalExplorerState {
  const out = { ...DEFAULT_STATE, ...s };
  out.n = Math.min(120, Math.max(20, Number.isFinite(out.n) ? Math.round(out.n) : DEFAULT_STATE.n));
  out.zoom = Math.min(32, Math.max(0.25, Number.isFinite(out.zoom) ? out.zoom : DEFAULT_STATE.zoom));
  out.palette = Math.min(
    4,
    Math.max(
      0,
      Number.isFinite(out.palette)
        ? Math.round(out.palette)
        : DEFAULT_STATE.palette,
    ),
  );
  out.drift = Math.min(
    1,
    Math.max(0, Number.isFinite(out.drift) ? out.drift : DEFAULT_STATE.drift),
  );
  if (!Number.isFinite(out.ox)) out.ox = DEFAULT_STATE.ox;
  if (!Number.isFinite(out.oy)) out.oy = DEFAULT_STATE.oy;
  return out;
}

export function parseFractalSearchParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): FractalExplorerState {
  const get = (key: string) =>
    typeof searchParams === "object" && !(searchParams instanceof URLSearchParams)
      ? typeof searchParams[key] === "string"
        ? searchParams[key]
        : undefined
      : (searchParams as URLSearchParams).get(key);

  const num = (key: string) => {
    const v = get(key);
    if (v === null || v === undefined) return undefined;
    const n = parseFloat(String(v));
    return Number.isFinite(n) ? n : undefined;
  };

  const raw = clampState({
    n: num("n"),
    ox: num("ox"),
    oy: num("oy"),
    zoom: num("zoom"),
    palette: num("p"),
    drift: num("drift"),
  });

  const version = get("v");
  if (version !== String(FRACTAL_URL_VERSION)) {
    return migrateLegacyExplorerState(raw);
  }

  return raw;
}

export function serializeFractalState(s: FractalExplorerState): string {
  const p = new URLSearchParams();
  p.set("v", String(FRACTAL_URL_VERSION));
  p.set("n", String(s.n));
  p.set("ox", s.ox.toFixed(6));
  p.set("oy", s.oy.toFixed(6));
  p.set("zoom", s.zoom.toFixed(4));
  p.set("p", String(s.palette));
  if (s.drift > 0.001) p.set("drift", s.drift.toFixed(4));
  return p.toString();
}

export function explorerStateToHref(pathname: string, s: FractalExplorerState) {
  const q = serializeFractalState(s);
  return q ? `${pathname}?${q}` : pathname;
}
