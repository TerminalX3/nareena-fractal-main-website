"use client";

/**
 * Escape-time colouring for the Nareena recurrence on the complex plane:
 *   F(n) = F(n−1)^F(n−2) + 19/F(n−1) − 7i/F(n−2)
 * with F(0)=F(−1)=z₀ (pixel seed), F(1)=z₀+0.1+0.1i — matching the reference renderer.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import clsx from "clsx";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getPaletteVectors } from "@/lib/fractal-palettes";
import type { FractalExplorerState } from "@/lib/fractal-url-state";

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uMaxIter;
uniform vec2 uOffset;
uniform float uZoom;
uniform float uBiasDrift;
uniform vec3 uColDeep;
uniform vec3 uColEdge;
uniform vec3 uColHi;
varying vec2 vUv;

const float PLANE_HALF = 2.5;
const float EPS = 1e-12;
const float ESCAPE_R = 50.0;

vec2 cmotion(vec2 a, vec2 b) {
  float d = dot(b, b);
  if (d < 1e-30) return vec2(1e8, 1e8);
  return vec2(a.x * b.x + a.y * b.y, a.y * b.x - a.x * b.y) / d;
}

vec2 guard(vec2 z) {
  return dot(z, z) < EPS * EPS ? vec2(EPS, 0.0) : z;
}

vec2 clog(vec2 z) {
  float r = max(length(z), 1e-14);
  return vec2(log(r), atan(z.y, z.x));
}

vec2 cexp2(vec2 w) {
  float e = exp(clamp(w.x, -42.0, 42.0));
  return e * vec2(cos(w.y), sin(w.y));
}

vec2 cpowcc(vec2 base, vec2 exp) {
  if (dot(base, base) < 1e-28) return vec2(0.0);
  vec2 L = clog(base);
  vec2 W = vec2(exp.x * L.x - exp.y * L.y, exp.x * L.y + exp.y * L.x);
  return cexp2(W);
}

float nareenaEscape(vec2 z0, int maxIter) {
  vec2 f2 = z0;
  vec2 f1 = z0 + vec2(0.1, 0.1);

  for (int i = 0; i < 120; i++) {
    if (i >= maxIter) break;

    f1 = guard(f1);
    f2 = guard(f2);

    vec2 fNew =
      cpowcc(f1, f2) +
      cmotion(vec2(19.0, 0.0), f1) -
      cmotion(vec2(0.0, 7.0), f2);

    float r2 = dot(fNew, fNew);
    if (r2 > ESCAPE_R * ESCAPE_R || r2 > 1e18) return float(i);

    f2 = f1;
    f1 = fNew;
  }

  return float(maxIter);
}

void main() {
  float magnify = max(uZoom, 0.08);
  float half = PLANE_HALF / magnify;

  vec2 shim = vec2(cos(uTime * 0.06), sin(uTime * 0.06));
  vec2 drift = uBiasDrift * 0.02 * vec2(shim.x - shim.y, shim.x + shim.y);
  vec2 z0 = vec2(
    mix(-half, half, vUv.x),
    mix(-half, half, vUv.y)
  ) + uOffset + drift;

  int maxIter = int(clamp(uMaxIter, 20.0, 120.0) + 0.5);
  float count = nareenaEscape(z0, maxIter);

  float norm = log(1.0 + float(maxIter));
  float t = log(1.0 + count) / norm;
  t = pow(clamp(t, 0.0, 1.0), 0.72);

  vec3 col = mix(uColDeep, uColEdge, t);
  col = mix(col, uColHi, pow(t, 1.6) * 0.35);
  col *= 1.08;

  float vignette = smoothstep(1.08, 0.62, distance(vUv, vec2(0.5)));
  col *= mix(0.92, 1.0, vignette);

  gl_FragColor = vec4(col, 1.0);
}
`;

export type FractalCanvasProps = {
  className?: string;
  ambientMotion?: boolean;
  explorer?: FractalExplorerState | null;
  onGlReady?: (gl: THREE.WebGLRenderer) => void;
};

function ShaderPlane({
  ambientMotion,
  explorer,
}: {
  ambientMotion: boolean;
  explorer: FractalExplorerState | null;
}) {
  const { size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const material = useMemo(() => {
    const { deep, edge, hi } = getPaletteVectors(0);
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMaxIter: { value: 80 },
        uOffset: { value: new THREE.Vector2(0, 0) },
        uZoom: { value: 1 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uBiasDrift: { value: 0 },
        uColDeep: { value: deep.clone() },
        uColEdge: { value: edge.clone() },
        uColHi: { value: hi.clone() },
      },
      vertexShader,
      fragmentShader,
    });
    materialRef.current = m;
    return m;
  }, []);

  const lastPalette = useRef<number | null>(null);

  useFrame(({ clock }) => {
    const m = materialRef.current;
    if (!m) return;
    const u = m.uniforms;
    const w = Math.max(1, size.width);
    const h = Math.max(1, size.height);
    u.uTime.value = clock.elapsedTime;
    u.uResolution.value.set(w, h);

    if (ambientMotion) {
      const pan = clock.elapsedTime * 0.022;
      u.uMaxIter.value = 80;
      u.uOffset.value.set(
        Math.sin(pan * 0.71) * 0.35,
        Math.cos(pan * 0.83) * 0.28,
      );
      u.uZoom.value = 1.0 + Math.sin(clock.elapsedTime * 0.07) * 0.06;
      u.uBiasDrift.value = 0;
      if (lastPalette.current !== 0) {
        lastPalette.current = 0;
        const { deep, edge, hi } = getPaletteVectors(0);
        u.uColDeep.value.copy(deep);
        u.uColEdge.value.copy(edge);
        u.uColHi.value.copy(hi);
      }
    } else if (explorer) {
      u.uMaxIter.value = explorer.n;
      u.uOffset.value.set(explorer.ox, explorer.oy);
      u.uZoom.value = explorer.zoom;
      u.uBiasDrift.value = explorer.drift;
      if (lastPalette.current !== explorer.palette) {
        lastPalette.current = explorer.palette;
        const { deep, edge, hi } = getPaletteVectors(explorer.palette);
        u.uColDeep.value.copy(deep);
        u.uColEdge.value.copy(edge);
        u.uColHi.value.copy(hi);
      }
    }
  });

  return (
    <mesh material={material} scale={[2, 2, 1]}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

export default function FractalCanvas({
  className,
  ambientMotion = false,
  explorer = null,
  onGlReady,
}: FractalCanvasProps) {
  const showExplorerControls = !!explorer && !ambientMotion;

  return (
    <div
      className={clsx(
        "relative flex min-h-[12rem] w-full flex-1 overflow-hidden rounded-[inherit] bg-[var(--viz-bg,#0e1218)]",
        className,
      )}
    >
      <Canvas
        className="!block min-h-[12rem] w-full flex-1 touch-none [&>canvas]:!block [&>canvas]:!h-full [&>canvas]:!min-h-[12rem] [&>canvas]:!w-full"
        orthographic
        camera={{ near: -10, far: 10, position: [0, 0, 1], zoom: 1 }}
        gl={{
          alpha: false,
          antialias: true,
          preserveDrawingBuffer: showExplorerControls,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setClearColor("#0e1218", 1);
          gl.toneMapping = THREE.NoToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 2, 2));
          onGlReady?.(gl);
        }}
      >
        <color attach="background" args={["#0e1218"]} />
        <ShaderPlane ambientMotion={ambientMotion} explorer={explorer} />
      </Canvas>
    </div>
  );
}
