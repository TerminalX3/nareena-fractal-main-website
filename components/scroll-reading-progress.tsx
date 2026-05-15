"use client";

import { useLenisInstance } from "@/components/lenis-provider";
import { useEffect, useRef, useState } from "react";

/** Thin top-bar progress for Lenis-managed or native scroll containers */
export function ScrollReadingProgress() {
  const lenis = useLenisInstance();
  const ticking = useRef(false);
  const [p, setP] = useState(0);

  useEffect(() => {
    const update = () => {
      ticking.current = false;
      if (lenis) {
        setP(Math.min(1, Math.max(0, lenis.progress)));
      } else {
        const el = document.documentElement;
        const max = Math.max(1, el.scrollHeight - window.innerHeight);
        setP(Math.min(1, Math.max(0, window.scrollY / max)));
      }
    };

    const onScrollLike = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScrollLike, { passive: true });
    const offLenis = lenis?.on("scroll", onScrollLike);

    update();

    return () => {
      window.removeEventListener("scroll", onScrollLike);
      offLenis?.();
    };
  }, [lenis]);

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[60]">
      <div className="h-[2px] w-full bg-border/30">
        <div
          className="h-full bg-accent shadow-[0_0_22px_rgba(74,227,201,0.35)] transition-[transform] duration-[120ms] ease-out"
          style={{ transformOrigin: "left", transform: `scaleX(${p})` }}
        />
      </div>
    </div>
  );
}
