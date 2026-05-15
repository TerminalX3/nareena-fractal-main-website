import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nareena Fractal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050608",
          padding: "56px",
          borderBottom: "3px solid #4ae3c9",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#97a097",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            Living complex plane
          </div>
          <div style={{ fontSize: 72, fontWeight: 400, color: "#e8eae6", lineHeight: 1 }}>
            Nareena Fractal
          </div>
          <div style={{ fontSize: 24, maxWidth: 720, color: "#97a097", marginTop: 8 }}>
            GPU escape-time atlas · editorial instrumentation · interdisciplinary
            long reads.
          </div>
        </div>
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 13,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#4ae3c9",
          }}
        >
          z → zⁿ + c · shader truth
        </div>
      </div>
    ),
    { ...size },
  );
}
