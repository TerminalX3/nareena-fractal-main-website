"use client";

import clsx from "clsx";
import FractalCanvas from "@/components/fractal/fractal-canvas";

export default function FractalHero({ className }: { className?: string }) {
  return (
    <FractalCanvas
      ambientMotion
      className={clsx("min-h-[100svh]", className)}
    />
  );
}
