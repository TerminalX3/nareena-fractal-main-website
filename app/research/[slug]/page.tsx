import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ScholarlyArticleJsonLd } from "@/lib/schema/scholarly-article";
import { loadPapers } from "@/lib/papers";
import { getSiteUrl } from "@/lib/site";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return loadPapers().map((paper) => ({ slug: paper.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const paper = loadPapers().find((p) => p.slug === params.slug);
  if (!paper) return { title: "Research" };

  const base = getSiteUrl();
  const path = `/research/${params.slug}`;
  const ogImg = `${base}${path}/opengraph-image`;

  return {
    title: paper.title,
    description: paper.abstract ?? `Research publication: ${paper.title}`,
    alternates: { canonical: path },
    openGraph: {
      title: paper.title,
      description: paper.abstract ?? undefined,
      type: "article",
      images: [{ url: ogImg, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImg],
    },
  };
}

export default function ResearchPaperPage({ params }: Props) {
  const paper = loadPapers().find((p) => p.slug === params.slug);
  if (!paper) return notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScholarlyArticleJsonLd paper={paper} slug={params.slug} />
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
          Research
        </p>
        <h1 className="mt-4 font-display text-4xl">{paper.title}</h1>
        <p className="mt-6 text-muted">{paper.authors.join(", ")}</p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.26em] text-muted">
          {paper.journal} · {paper.year}
        </p>

        {paper.abstract && (
          <div className="mt-12 text-lg leading-relaxed text-muted">
            <p>{paper.abstract}</p>
          </div>
        )}

        <div className="mt-14 flex flex-wrap gap-6 border-t border-border/70 pt-10 font-mono text-[11px] uppercase tracking-[0.28em]">
          {paper.url && (
            <a
              className="text-accent hover:underline"
              href={paper.url}
              target="_blank"
              rel="noreferrer"
            >
              View on ResearchGate →
            </a>
          )}
        </div>

        <footer className="mt-14">
          <Link
            href="/research"
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted hover:text-accent"
          >
            ← Back to research
          </Link>
        </footer>
      </main>
    </div>
  );
}
