import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "What is the Nareena Fractal?",
  description:
    "Fractal geometry, recursive dynamical systems, and the Nareena Fractal recurrence relation — a formal overview.",
};

function Cite({ n }: { n: number }) {
  return (
    <sup className="ml-0.5 font-mono text-[0.7em] text-accent/90">[{n}]</sup>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="pb-24">
        <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <header className="space-y-6 border-b border-border/60 pb-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
              Overview
            </p>
            <h1 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.12] tracking-tight text-foreground">
              What is the Nareena Fractal?
            </h1>
          </header>

          <div className="mt-12 space-y-12 text-[1.0625rem] leading-[1.8] text-muted">
            <section className="space-y-5">
              <h2 className="font-display text-2xl text-foreground">
                Fractals and self-similarity
              </h2>
              <p>
                Fractals are mathematical structures that exhibit self-similar patterns
                across multiple scales, meaning that smaller portions of the structure
                resemble the larger system from which they originate. Such fractal behavior is observed across a wide range of
                natural and physical systems, including coastline formation, crystalline
                growth, vascular networks, turbulence, and wave-like propagation
                phenomena. Specifically, because fractal structures typically arise from
                recursive mathematical rules, they are commonly used to describe systems
                governed by repetition, feedback, and scale-dependent organization.
              </p>
            </section>

            <section className="space-y-5">
              <h2 className="font-display text-2xl text-foreground">
                Recursive systems in physics
              </h2>
              <p>
                Recursive mathematical systems play a significant role in modern physics
                because many physical processes, including quantum state evolution,
                gravitational dynamics, particle transport mechanisms, neural signaling
                pathways, and time-dependent material responses, evolve through sequential
                dependencies in which prior states influence subsequent outcomes. In such systems, small variations in initial conditions or
                structural parameters can lead to significant divergence in long-term
                behavior, limiting the applicability of purely linear or equilibrium-based
                models. Such behaviors are commonly studied using established mathematical
                frameworks such as Chaos Theory, fractal-based modeling, and nonlinear
                dynamical systems, which are specifically designed to describe systems
                where small changes in initial conditions can lead to large variations in
                long-term outcomes.
              </p>
            </section>

            <section className="space-y-5">
              <h2 className="font-display text-2xl text-foreground">
                The Nareena Fractal
              </h2>
              <p>
                The Nareena Fractal is defined as a discrete recursive sequence fractal in
                which each term is generated from the combination of the two preceding
                values. Unlike linear sequences, where changes propagate
                proportionally, recursive systems of this form produce behavior that is
                highly dependent on initial conditions and early-stage iteration. As a result, even small variations in starting values can
                significantly alter the long-term evolution of the sequence.
              </p>
              <p>The framework is defined by the recurrence relation:</p>

              <div
                className="rounded-md bg-surface-high/92 px-6 py-5 font-mono text-[0.98rem] leading-relaxed text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] sm:text-[1.05rem]"
                aria-label="Nareena recurrence relation"
              >
                <span className="text-accent">F</span>(<span className="text-accent">n</span>) ={" "}
                <span className="text-accent">F</span>(<span className="text-accent">n</span>−1)
                <sup className="text-accent">F(n−2)</sup>
                {" "}+ 19/<span className="text-accent">F</span>(<span className="text-accent">n</span>−1)
                {" "}− 7<span className="text-accent">i</span>/
                <span className="text-accent">F</span>(<span className="text-accent">n</span>−2)
              </div>

              <p>
                The structure of this equation combines three distinct components that
                influence the system in different ways.
              </p>
            </section>

            <section className="space-y-8">
              <h2 className="font-display text-2xl text-foreground">
                Components of the recurrence
              </h2>

              <div className="space-y-6">
                <div className="space-y-3 border-l-2 border-accent/40 pl-5">
                  <h3 className="font-display text-lg text-foreground">
                    Exponential term
                  </h3>
                  <p className="font-mono text-sm text-accent/95">
                    F(n−1)<sup>F(n−2)</sup>
                  </p>
                  <p>
                    Introduces strong nonlinear growth, where each iteration is amplified
                    based on the magnitude of prior states. This type of dependency is
                    commonly associated with unstable or rapidly diverging systems in
                    nonlinear dynamics.
                  </p>
                </div>

                <div className="space-y-3 border-l-2 border-accent/40 pl-5">
                  <h3 className="font-display text-lg text-foreground">
                    Inverse correction
                  </h3>
                  <p className="font-mono text-sm text-accent/95">
                    19 / F(n−1)
                  </p>
                  <p>
                    Introduces a diminishing correction factor. As the magnitude of the
                    sequence increases, this term&apos;s contribution decreases, meaning its
                    influence is strongest in early iterations and gradually weakens over
                    time. In recursive systems, such inverse terms often function as
                    stabilizing components that counterbalance exponential growth.
                  </p>
                </div>

                <div className="space-y-3 border-l-2 border-accent/40 pl-5">
                  <h3 className="font-display text-lg text-foreground">
                    Complex-valued term
                  </h3>
                  <p className="font-mono text-sm text-accent/95">
                    − 7i / F(n−2)
                  </p>
                  <p>
                    Introduces a complex-valued contribution to the sequence. The presence
                    of the imaginary unit <span className="font-mono text-foreground">i</span>{" "}
                    allows the system to evolve within the complex plane rather than
                    remaining restricted to real-valued progression. This type of
                    representation is commonly used in wave mechanics and oscillatory
                    systems, where phase relationships are relevant to system behavior.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-lg bg-surface/60 px-6 py-8 ring-1 ring-border/60">
              <h2 className="font-display text-xl text-foreground">
                Explore further
              </h2>
              <p>
                Interactive escape-time maps of related complex-plane iterations are
                available in the visualizer. Indexed publications are listed on the
                research page.
              </p>
              <nav className="flex flex-wrap gap-x-8 gap-y-3 pt-2 font-mono text-[10px] uppercase tracking-[0.24em]">
                <Link
                  className="text-accent hover:underline"
                  href="/visualizer"
                >
                  Visualizer →
                </Link>
                <Link
                  className="text-muted hover:text-foreground hover:underline"
                  href="/research"
                >
                  Research →
                </Link>
              </nav>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
