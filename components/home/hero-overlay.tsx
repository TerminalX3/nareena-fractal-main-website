"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-start px-4 pt-[14vh] sm:pt-[16vh]">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-xl space-y-6 text-center text-balance sm:max-w-2xl"
      >
        <motion.p
          variants={item}
          className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted"
        >
          Complex plane · escape time
        </motion.p>
        <motion.h1
          variants={item}
          className="font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-[3.35rem]"
        >
          Nareena Fractal Observatory
        </motion.h1>
        <motion.p
          variants={item}
          className="text-base leading-relaxed text-muted sm:text-lg"
        >
          Julia and Mandelbrot maps of z<sub>k+1</sub> = z<sub>k</sub>
          <sup>n</sup> + c — rendered on the GPU, explored in the visualizer,
          grounded in published research.
        </motion.p>
        <motion.div
          variants={item}
          transition={{
            duration: 0.5,
            delay: 1.45,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
          className="pointer-events-auto mx-auto rounded-sm border border-border/70 bg-black/55 px-4 py-4 font-mono text-sm leading-relaxed text-accent backdrop-blur-sm sm:text-[15px]"
        >
          <span className="tracking-tight">
            Default Julia preset: c ≈ −0.40 + 0.60i at n = 2 — a connected set
            on the Mandelbrot boundary with rich escape-time colour.
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
