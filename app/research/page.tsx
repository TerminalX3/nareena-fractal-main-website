import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { loadPapers, type Paper } from "@/lib/papers";

export const metadata: Metadata = {
  title: "Research",
  description: "Published research on the Nareena fractal — indexed from ResearchGate.",
};

export default function ResearchIndexPage() {
  const papers = loadPapers().sort((a, b) => b.year - a.year);
  const foundational = papers.filter((p) => p.foundational);
  const rest = papers.filter((p) => !p.foundational);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-14 px-4 py-16 sm:px-6 lg:px-8">
        <header className="space-y-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
            Publications
          </p>
          <h1 className="font-display text-4xl text-foreground sm:text-5xl">
            Research
          </h1>
          <p className="max-w-2xl text-muted">
            Peer-indexed work on the Nareena fractal and its applications across
            mathematics, biomedical science, NLP, and security.
          </p>
        </header>

        {foundational.length > 0 && (
          <section className="space-y-8">
            <h2 className="font-display text-2xl">Foundational</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {foundational.map((paper) => (
                <PaperCard key={paper.slug} paper={paper} />
              ))}
            </div>
          </section>
        )}

        <section className="space-y-8">
          <h2 className="font-display text-2xl">All publications</h2>
          <div className="divide-y divide-border/80 rounded-sm border border-border/70 bg-surface/50">
            {rest.map((paper) => (
              <div key={paper.slug} className="p-6">
                <PaperCard dense paper={paper} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function PaperCard({ paper, dense }: { paper: Paper; dense?: boolean }) {
  const href = `/research/${paper.slug}`;
  const external = paper.url;

  return (
    <article
      className={
        dense
          ? ""
          : "border border-border/80 bg-background/40 p-6 shadow-instrument transition-[border-color] duration-[480ms] hover:border-accent-muted"
      }
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        <span className="text-accent">{paper.year}</span>
        <span>{paper.journal}</span>
        {paper.topic ? <span>{paper.topic}</span> : null}
      </div>
      <h3 className="mt-4 font-display text-2xl text-foreground">{paper.title}</h3>
      <p className="mt-2 text-sm text-muted">{paper.authors.join(", ")}</p>
      {paper.abstract && (
        <p className={`mt-4 text-muted ${dense ? "text-sm leading-relaxed" : ""}`}>
          {paper.abstract}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-6 font-mono text-[10px] uppercase tracking-[0.28em]">
        <Link className="text-accent hover:underline" href={href}>
          Detail →
        </Link>
        {external && (
          <a
            className="text-muted hover:text-foreground"
            href={external}
            target="_blank"
            rel="noreferrer"
          >
            ResearchGate →
          </a>
        )}
      </div>
    </article>
  );
}
