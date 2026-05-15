import { ImageResponse } from "next/og";
import { loadPapers } from "@/lib/papers";

export const runtime = "nodejs";
export const alt = "Research paper";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: { slug: string } };

export default async function ResearchOpenGraph({ params }: Props) {
  const paper = loadPapers().find((p) => p.slug === params.slug);
  const title =
    paper?.title?.slice(0, 160) ?? "Research — Nareena Fractal";

  const abstract = paper?.abstract?.slice(0, 220) ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#050608",
          padding: "48px",
          borderLeft: "5px solid #4ae3c9",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#97a097",
          }}
        >
          Research entry
        </div>
        <div
          style={{
            fontSize: 44,
            color: "#e8eae6",
            marginTop: 28,
            lineHeight: 1.12,
          }}
        >
          {title}
        </div>
        {paper && (
          <div
            style={{
              marginTop: 20,
              fontSize: 18,
              color: "#97a097",
              fontFamily: "Georgia, serif",
            }}
          >
            {paper.authors.join(", ")} · {paper.journal} · {paper.year}
          </div>
        )}
        {abstract && (
          <div
            style={{
              marginTop: "auto",
              fontSize: 20,
              color: "#97a097",
              lineHeight: 1.45,
              maxHeight: 180,
              overflow: "hidden",
            }}
          >
            {abstract}
          </div>
        )}
      </div>
    ),
    { ...size },
  );
}
