import Link from "next/link";
import type { YoutubeChannelPreview } from "@/lib/youtube";

export function YoutubeChannelCard({ data }: { data: YoutubeChannelPreview }) {
  const thumbUrl = data.latestVideoThumb || data.channelThumbUrl;

  return (
    <section className="border-t border-border/60 bg-surface/60 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl border border-border/70 bg-background/50 p-8 shadow-instrument md:grid md:grid-cols-[minmax(0,340px)_1fr] md:gap-12 md:p-10">
        <div className="relative aspect-video w-full max-w-[340px] overflow-hidden rounded-sm border border-border/70 bg-black/60">
          {thumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              src={thumbUrl}
              className="h-full w-full object-cover opacity-95"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
              Nareena Fractal
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/75 via-transparent to-transparent" />
        </div>

        <div className="mt-8 flex flex-col justify-center md:mt-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
            YouTube
          </p>
          <h2 className="mt-3 font-display text-3xl text-foreground md:text-4xl">
            {data.channelTitle}
          </h2>
          <p className="mt-5 max-w-xl text-muted">{data.description}</p>

          {data.latestVideoTitle && (
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Latest:{" "}
              <span className="normal-case text-muted">{data.latestVideoTitle}</span>
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-6 font-mono text-[10px] uppercase tracking-[0.28em]">
            <Link
              href={data.channelUrl}
              target="_blank"
              rel="noreferrer"
              className="border border-accent/50 px-5 py-3 text-accent transition-colors hover:bg-accent-muted/20"
            >
              Open channel →
            </Link>
            {data.latestVideoUrl && (
              <Link
                href={data.latestVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="border border-border px-5 py-3 text-muted transition-colors hover:border-accent-muted hover:text-foreground"
              >
                Latest video
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
