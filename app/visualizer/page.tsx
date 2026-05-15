import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/site-header";

const VisualizerClient = dynamic(
  () => import("@/components/visualizer/visualizer-client"),
  { ssr: false },
);

export const metadata: Metadata = {
  title: "Visualizer",
  description:
    "Nareena escape-time fractal — Julia and Mandelbrot modes with degree-n smooth colouring and URL sharing.",
};

export default function VisualizerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="relative min-h-[calc(100svh-8rem)]">
        <VisualizerClient />
      </main>
    </div>
  );
}
