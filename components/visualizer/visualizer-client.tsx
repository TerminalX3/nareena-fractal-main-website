"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent,
} from "react";
import { NareenaViewport } from "@/components/visualizer/nareena-viewport";
import { VisualizerDock } from "@/components/visualizer/visualizer-dock";
import { FRACTAL_PALETTES } from "@/lib/fractal-palettes";
import {
  applyPreset,
  clampNareenaState,
  parseNareenaSearchParams,
  serializeNareenaState,
  type NareenaExplorerState,
} from "@/lib/nareena-url-state";

const DEFAULT = clampNareenaState({});

export default function VisualizerClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ active: boolean; x: number; y: number } | null>(null);
  const replaceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, setState] = useState<NareenaExplorerState>(DEFAULT);
  const [toast, setToast] = useState<string | null>(null);

  const renderParams = useMemo(() => {
    const { palette, ...rest } = state;
    return { ...rest, paletteIndex: palette };
  }, [state]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = parseNareenaSearchParams(
      new URLSearchParams(window.location.search),
    );
    setState(next);
    const qs = serializeNareenaState(next);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${qs ? `?${qs}` : ""}`,
    );
  }, []);

  const scheduleUrlReplace = useCallback((next: NareenaExplorerState) => {
    if (replaceTimerRef.current) clearTimeout(replaceTimerRef.current);
    replaceTimerRef.current = setTimeout(() => {
      const qs = serializeNareenaState(next);
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${qs ? `?${qs}` : ""}`,
      );
    }, 550);
  }, []);

  useEffect(
    () => () => {
      if (replaceTimerRef.current) clearTimeout(replaceTimerRef.current);
    },
    [],
  );

  const patch = useCallback(
    (partial: Partial<NareenaExplorerState>) => {
      setState((prev) => {
        const merged = clampNareenaState({ ...prev, ...partial });
        scheduleUrlReplace(merged);
        return merged;
      });
    },
    [scheduleUrlReplace],
  );

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = { active: true, x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const d = dragRef.current;
    if (!d?.active) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    d.x = e.clientX;
    d.y = e.clientY;
    setState((prev) => {
      const merged = clampNareenaState({
        ...prev,
        centerRe: prev.centerRe - dx * prev.zoom,
        centerIm: prev.centerIm + dy * prev.zoom,
      });
      scheduleUrlReplace(merged);
      return merged;
    });
  };

  const onPointerEnd = () => {
    if (dragRef.current) dragRef.current.active = false;
  };

  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.12 : 0.9;
    patch({ zoom: state.zoom * factor });
  };

  const exportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `nareena-fractal-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const copyLink = async () => {
    const qs = serializeNareenaState(state);
    const url = `${window.location.origin}${window.location.pathname}${qs ? `?${qs}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      setToast("Link copied");
    } catch {
      setToast("Copy blocked — select URL manually");
    }
    window.setTimeout(() => setToast(null), 2200);
  };

  const resetView = () => {
    setState(DEFAULT);
    scheduleUrlReplace(DEFAULT);
  };

  return (
    <div className="relative px-4 pb-36 pt-4 sm:px-6 lg:px-10">
      <div
        ref={stageRef}
        role="application"
        aria-label="Nareena fractal viewport"
        className="relative h-[min(72svh,820px)] min-h-[420px] w-full cursor-grab overflow-hidden rounded-sm border border-border/60 bg-[#06080e] active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onPointerLeave={onPointerEnd}
        onWheel={onWheel}
      >
        <NareenaViewport
          params={renderParams}
          className="h-full w-full"
          onCanvasReady={(c) => {
            canvasRef.current = c;
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.28em] text-muted/90">
          Drag to pan · wheel to zoom
        </div>
        <div className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] uppercase tracking-[0.22em] text-muted/80">
          {state.mode} · n={state.n.toFixed(2)}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-8">
        <p className="text-[0.95rem] leading-relaxed text-muted">
          Escape-time map of z<sub>k+1</sub> = z<sub>k</sub>
          <sup>n</sup> + c. Julia mode fixes c at the Nareena constant (−0.40 + 0.60i);
          Mandelbrot mode scans c across the plane. Degree-n smooth colouring keeps
          contrast when n ≠ 2.
        </p>

        <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.22em]">
          {(
            [
              ["nareena", "Nareena preset"],
              ["julia", "Julia default"],
              ["mandelbrot", "Mandelbrot"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setState((prev) => {
                  const merged = applyPreset(key, prev);
                  scheduleUrlReplace(merged);
                  return merged;
                })
              }
              className="rounded-full border border-border/70 px-3 py-1.5 text-muted transition-colors hover:border-accent-muted hover:text-foreground"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          <div className="flex gap-4">
            {(["julia", "mandelbrot"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => patch({ mode: m })}
                className={`rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] ${
                  state.mode === m
                    ? "border-accent text-accent"
                    : "border-border/70 text-muted hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <label
              className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted"
              htmlFor="nareena-n"
            >
              Exponent n
            </label>
            <input
              id="nareena-n"
              type="range"
              min={1.2}
              max={12}
              step={0.05}
              value={state.n}
              onChange={(e) => patch({ n: parseFloat(e.target.value) })}
              className="w-full accent-accent"
            />
            <p className="font-mono text-xs text-foreground/80">{state.n.toFixed(3)}</p>
          </div>

          {state.mode === "julia" && (
            <>
              <div className="space-y-3">
                <label
                  className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted"
                  htmlFor="nareena-cr"
                >
                  c (real)
                </label>
                <input
                  id="nareena-cr"
                  type="range"
                  min={-1.5}
                  max={1.5}
                  step={0.01}
                  value={state.cr}
                  onChange={(e) => patch({ cr: parseFloat(e.target.value) })}
                  className="w-full accent-accent"
                />
                <p className="font-mono text-xs text-foreground/80">
                  {state.cr.toFixed(3)}
                </p>
              </div>
              <div className="space-y-3">
                <label
                  className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted"
                  htmlFor="nareena-ci"
                >
                  c (imag)
                </label>
                <input
                  id="nareena-ci"
                  type="range"
                  min={-1.5}
                  max={1.5}
                  step={0.01}
                  value={state.ci}
                  onChange={(e) => patch({ ci: parseFloat(e.target.value) })}
                  className="w-full accent-accent"
                />
                <p className="font-mono text-xs text-foreground/80">
                  {state.ci.toFixed(3)}
                </p>
              </div>
            </>
          )}

          <div className="space-y-3">
            <label
              className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted"
              htmlFor="nareena-iter"
            >
              Max iterations
            </label>
            <input
              id="nareena-iter"
              type="range"
              min={40}
              max={500}
              step={10}
              value={state.maxIter}
              onChange={(e) => patch({ maxIter: parseInt(e.target.value, 10) })}
              className="w-full accent-accent"
            />
            <p className="font-mono text-xs text-foreground/80">{state.maxIter}</p>
          </div>

          <div className="space-y-3">
            <label
              className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted"
              htmlFor="nareena-zoom"
            >
              Zoom (units / pixel)
            </label>
            <input
              id="nareena-zoom"
              type="range"
              min={0.00015}
              max={0.05}
              step={0.0001}
              value={state.zoom}
              onChange={(e) => patch({ zoom: parseFloat(e.target.value) })}
              className="w-full accent-accent"
            />
            <p className="font-mono text-xs text-foreground/80">
              {state.zoom.toFixed(5)}
            </p>
          </div>
        </div>
      </div>

      <VisualizerDock
        palettes={FRACTAL_PALETTES}
        activePalette={state.palette}
        onPalette={(i) => patch({ palette: i })}
        onPng={exportPng}
        onCopyLink={copyLink}
        onReset={resetView}
      />

      {toast && (
        <div
          role="status"
          className="fixed bottom-[5.75rem] left-1/2 z-[55] max-w-[min(92vw,22rem)] -translate-x-1/2 border border-accent/45 bg-background/95 px-5 py-3 text-center font-mono text-[10px] uppercase tracking-[0.26em] text-accent shadow-instrument sm:bottom-[6.75rem]"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
