"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLenisInstance } from "@/components/lenis-provider";

gsap.registerPlugin(ScrollTrigger);

const CALLOUTS = [
  {
    term: "z",
    copy: "The iterate — each pixel tracks how long z stays bounded under the map before escaping.",
  },
  {
    term: "c",
    copy: "In Julia mode, c is fixed (the Nareena constant ≈ −0.40 + 0.60i). In Mandelbrot mode, c is the pixel coordinate.",
  },
  {
    term: "n",
    copy: "The real exponent in zⁿ. Higher n sharpens filaments and reorganises the boundary — degree-n smooth colouring preserves contrast.",
  },
  {
    term: "19",
    copy: "The real pedestal in the original Nareena mnemonic — normalised into the Julia constant’s magnitude on the complex plane.",
  },
  {
    term: "7i",
    copy: "The imaginary rotation in the mnemonic — its angle feeds the normalised Nareena constant arg(c) ≈ 26π/19.",
  },
] as const;

export function FormulaPinSection() {
  const lenis = useLenisInstance();
  const rootRef = useRef<HTMLElement | null>(null);
  const termsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const calloutsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useLayoutEffect(() => {
    if (!lenis || !rootRef.current) return;

    const root = rootRef.current;
    const terms = termsRef.current.filter(Boolean) as HTMLSpanElement[];
    const callouts = calloutsRef.current.filter(Boolean) as HTMLParagraphElement[];

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        } as DOMRect;
      },
    });

    const unsubscribeScroll = lenis.on("scroll", ScrollTrigger.update);

    terms.forEach((el) => {
      el.style.opacity = "0.32";
      el.style.color = "var(--muted)";
    });
    callouts.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(10px)";
    });

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "+=340%",
      pin: true,
      scrub: 0.55,
      anticipatePin: 1,
      onUpdate: (self) => {
        const n = terms.length;
        const idx = Math.min(
          n - 1,
          Math.max(0, Math.floor(self.progress * n + 1e-6)),
        );
        terms.forEach((el, i) => {
          const on = i === idx;
          el.style.opacity = on ? "1" : "0.35";
          el.style.color = on ? "var(--accent)" : "var(--foreground)";
        });
        callouts.forEach((el, i) => {
          const on = i === idx;
          el.style.opacity = on ? "1" : "0";
          el.style.transform = on ? "translateY(0)" : "translateY(12px)";
        });
      },
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      unsubscribeScroll();
      st.kill();
      ScrollTrigger.clearScrollMemory();
    };
  }, [lenis]);

  return (
    <section
      ref={rootRef}
      id="formula-breakdown"
      className="relative border-t border-border/60 bg-background/95"
    >
      <div className="flex min-h-[100svh] flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
            Pin-scroll field guide
          </p>
          <p className="mt-5 font-display text-3xl text-foreground sm:text-4xl">
            Read the map term by term
          </p>
          <div
            className="mt-14 font-mono text-[clamp(1.35rem,4vw,2.35rem)] leading-relaxed text-foreground"
            aria-label="Nareena fractal formula"
          >
            <span
              ref={(el) => {
                termsRef.current[0] = el;
              }}
              className="inline-block transition-[opacity,color] duration-300"
            >
              z
            </span>
            <span className="mx-2 text-muted">=</span>
            <span
              ref={(el) => {
                termsRef.current[1] = el;
              }}
              className="inline-block transition-[opacity,color] duration-300"
            >
              z
            </span>
            <sup
              ref={(el) => {
                termsRef.current[2] = el;
              }}
              className="ml-0.5 inline-block align-super text-[0.65em] transition-[opacity,color] duration-300"
            >
              n
            </sup>
            <span className="mx-2 text-muted">+</span>
            <span
              ref={(el) => {
                termsRef.current[3] = el;
              }}
              className="inline-block transition-[opacity,color] duration-300"
            >
              c
            </span>
            <span className="mx-3 block pt-4 text-[0.55em] text-muted sm:inline sm:pt-0">
              (mnemonic: z = xⁿ + 19 − 7iⁿ)
            </span>
          </div>

          <div className="pointer-events-none relative mx-auto mt-16 min-h-[7.5rem] max-w-xl text-balance">
            {CALLOUTS.map((item, i) => (
              <p
                key={item.term}
                ref={(el) => {
                  calloutsRef.current[i] = el;
                }}
                className="absolute inset-x-0 top-0 text-sm leading-relaxed text-muted transition-[opacity,transform] duration-[480ms]"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-accent">
                  {item.term}
                </span>
                <span className="mt-2 block text-base text-foreground/90">
                  {item.copy}
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
