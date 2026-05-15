"use client";

import clsx from "clsx";
import type { FractalPalette } from "@/lib/fractal-palettes";

function paletteSwatch(p: FractalPalette) {
  const [rd, gd, bd] = p.deep;
  const [re, ge, be] = p.edge;
  const [rh, gh, bh] = p.highlight;
  return `linear-gradient(135deg, rgb(${rd * 255},${gd * 255},${bd * 255}) 0%, rgb(${re * 255},${ge * 255},${be * 255}) 46%, rgb(${rh * 255},${gh * 255},${bh * 255}) 100%)`;
}

type Props = {
  palettes: FractalPalette[];
  activePalette: number;
  onPalette: (i: number) => void;
  onPng: () => void;
  onCopyLink: () => void;
  onReset: () => void;
};

export function VisualizerDock({
  palettes,
  activePalette,
  onPalette,
  onPng,
  onCopyLink,
  onReset,
}: Props) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[50] flex justify-center px-3 sm:bottom-8">
      <nav
        aria-label="Visualizer quick controls"
        className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 rounded-[999px] border border-border/70 bg-black/74 px-3 py-2 shadow-instrument backdrop-blur-xl sm:gap-4 sm:px-5 sm:py-3"
      >
        <div className="flex items-center gap-1.5 border-r border-border/50 pr-2 sm:gap-2 sm:pr-4">
          <span className="hidden whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.24em] text-muted lg:inline">
            Spectra
          </span>
          {palettes.map((pal, i) => (
            <button
              type="button"
              key={pal.id}
              title={pal.label}
              aria-label={`Palette ${pal.label}`}
              onClick={() => onPalette(i)}
              className={clsx(
                "flex h-9 w-9 items-center justify-center rounded-full transition-[border-color,box-shadow] duration-300",
                activePalette === i
                  ? "border border-accent shadow-[0_0_20px_var(--accent-muted)]"
                  : "border border-border/35 hover:border-accent-muted",
              )}
            >
              <span
                aria-hidden
                className="h-7 w-7 rounded-full"
                style={{ background: paletteSwatch(pal) }}
              />
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.26em] sm:gap-3">
          <button
            type="button"
            onClick={onPng}
            className="rounded-full border border-border/80 px-3 py-2 text-muted transition-colors duration-300 hover:border-accent-muted hover:text-foreground"
          >
            PNG
          </button>
          <button
            type="button"
            onClick={onCopyLink}
            className="rounded-full border border-accent/55 bg-accent-muted/15 px-3 py-2 text-accent transition-colors duration-300 hover:bg-accent-muted/25"
          >
            Share URL
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full px-3 py-2 text-muted transition-colors duration-300 hover:text-foreground"
          >
            Reset
          </button>
        </div>
      </nav>
    </div>
  );
}
