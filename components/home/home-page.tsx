"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { Paper } from "@/lib/papers";
import type { YoutubeChannelPreview } from "@/lib/youtube";
import { HeroOverlay } from "@/components/home/hero-overlay";
import { FormulaPinSection } from "@/components/home/formula-pin-section";
import { SiteHeader } from "@/components/site-header";
import { YoutubeChannelCard } from "@/components/youtube/youtube-channel-card";

const FractalHero = dynamic(() => import("@/components/fractal/fractal-hero"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[100svh] w-full animate-pulse bg-[#040608]" />
  ),
});

export function HomePage({
  papers,
  youtube,
}: {
  papers: Paper[];
  youtube: YoutubeChannelPreview;
}) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 z-0">
        <FractalHero />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-[1] scanlines"
        aria-hidden
      />
      <div className="relative z-10">
        <SiteHeader className="border-border/40 bg-background/30" />
        <main>
          <section className="relative min-h-[100svh]">
            <HeroOverlay />
            <div className="pointer-events-auto absolute bottom-10 left-1/2 z-20 -translate-x-1/2">
              <a
                href="#formula-breakdown"
                className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent transition-opacity hover:opacity-80"
              >
                Explore the mathematics ↓
              </a>
            </div>
          </section>

          <FormulaPinSection />

          <section
            id="explainer"
            className="border-t border-border/60 bg-background/90 px-4 py-24 sm:px-6 lg:px-8"
          >
            <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-muted">
              <p className="font-display text-3xl text-foreground sm:text-4xl">
                Not a product. A phenomenon.
              </p>
              <p>
                The Nareena fractal is studied here as a mathematical object —
                rendered in real time, observed under motion, and documented with
                the same editorial care as a laboratory instrument readout.
              </p>
              <p>
                Use the{" "}
                <Link className="text-accent hover:underline" href="/visualizer">
                  visualizer
                </Link>{" "}
                for Julia and Mandelbrot modes, or read the{" "}
                <Link className="text-accent hover:underline" href="/about">
                  full explainer
                </Link>
                .
              </p>
            </div>
          </section>

          <YoutubeChannelCard data={youtube} />

          <section className="border-t border-border/60 bg-surface/80 px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-10">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                    Publications
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-foreground">
                    Research
                  </h2>
                </div>
                <Link
                  href="/research"
                  className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent transition-opacity hover:opacity-80"
                >
                  View all research →
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {papers.map((paper) => (
                  <article
                    key={paper.slug}
                    className="group border border-border/80 bg-background/40 p-6 shadow-instrument transition-[border-color] duration-500 hover:border-accent-muted"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                      {paper.journal} · {paper.year}
                    </p>
                    <h3 className="mt-4 font-display text-xl text-foreground">
                      {paper.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted">
                      {paper.authors.join(", ")}
                    </p>
                    <Link
                      href={`/research/${paper.slug}`}
                      className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.28em] text-accent transition-opacity group-hover:opacity-90"
                    >
                      Open entry →
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>
        <footer className="border-t border-border/60 bg-surface/90 px-4 py-10 text-sm text-muted sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-lg tracking-[0.18em] text-foreground/80">
              NAREENA FRACTAL
            </p>
            <p className="max-w-md text-xs leading-relaxed">
              Real-time fractal visualization, indexed research, and video from
              the Nareena Fractal channel.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
