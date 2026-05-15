import type { Metadata } from "next";
import {
  DM_Serif_Display,
  JetBrains_Mono,
  Source_Serif_4,
} from "next/font/google";
import "katex/dist/katex.min.css";
import { LenisProvider } from "@/components/lenis-provider";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const body = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Nareena Fractal",
    template: "%s — Nareena Fractal",
  },
  description:
    "Nareena fractal — real-time Julia and Mandelbrot visualization, research publications, and video.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nareena Fractal",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen antialiased`}
      >
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
