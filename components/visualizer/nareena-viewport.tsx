"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { renderFrame, type RenderParams } from "@/lib/nareena/renderFrame";

const MAX_RENDER_DIM = 960;

export function NareenaViewport({
  params,
  className,
  onCanvasReady,
}: {
  params: Omit<RenderParams, "width" | "height">;
  className?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bufRef = useRef<Uint8ClampedArray | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onCanvasReady?.(canvas);
  }, [onCanvasReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    let frameId = 0;

    const draw = () => {
      const displayW = Math.max(1, Math.floor(parent.clientWidth));
      const displayH = Math.max(1, Math.floor(parent.clientHeight));
      const scale = Math.min(1, MAX_RENDER_DIM / Math.max(displayW, displayH));
      const rw = Math.max(1, Math.floor(displayW * scale));
      const rh = Math.max(1, Math.floor(displayH * scale));

      if (canvas.width !== displayW || canvas.height !== displayH) {
        canvas.width = displayW;
        canvas.height = displayH;
      }

      const needed = rw * rh * 4;
      if (!bufRef.current || bufRef.current.length !== needed) {
        bufRef.current = new Uint8ClampedArray(needed);
      }

      renderFrame(bufRef.current, {
        ...params,
        width: rw,
        height: rh,
      });

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const off = document.createElement("canvas");
      off.width = rw;
      off.height = rh;
      const offCtx = off.getContext("2d");
      if (!offCtx) return;
      const buf = bufRef.current;
      offCtx.putImageData(
        new ImageData(new Uint8ClampedArray(buf), rw, rh),
        0,
        0,
      );

      ctx.fillStyle = "#06080e";
      ctx.fillRect(0, 0, displayW, displayH);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(off, 0, 0, displayW, displayH);
    };

    const schedule = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(draw);
    };

    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(parent);
    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
    };
  }, [params]);

  return (
    <canvas
      ref={canvasRef}
      className={clsx("block h-full w-full touch-none", className)}
      aria-label="Nareena escape-time fractal"
    />
  );
}
