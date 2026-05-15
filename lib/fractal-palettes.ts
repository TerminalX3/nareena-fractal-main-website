import * as THREE from "three";

export type FractalPalette = {
  id: string;
  label: string;
  deep: [number, number, number];
  edge: [number, number, number];
  highlight: [number, number, number];
};

/** Scientific / instrument palettes for escape-time colouring */
export const FRACTAL_PALETTES: FractalPalette[] = [
  {
    id: "instrument-teal",
    label: "Instrument teal",
    deep: [0.05, 0.1, 0.12],
    edge: [0.12, 0.74, 0.64],
    highlight: [0.9, 0.94, 0.93],
  },
  {
    id: "spectrograph-violet",
    label: "Spectrograph violet",
    deep: [0.06, 0.02, 0.09],
    edge: [0.55, 0.35, 0.94],
    highlight: [0.98, 0.92, 0.99],
  },
  {
    id: "oscilloscope-amber",
    label: "Oscilloscope amber",
    deep: [0.06, 0.04, 0.01],
    edge: [0.98, 0.62, 0.08],
    highlight: [1, 0.96, 0.76],
  },
  {
    id: "micrograph-cyan",
    label: "Micrograph cyan",
    deep: [0.02, 0.06, 0.07],
    edge: [0.12, 0.92, 0.88],
    highlight: [0.92, 0.99, 0.97],
  },
  {
    id: "electron-ink",
    label: "Electron ink",
    deep: [0.02, 0.02, 0.04],
    edge: [0.45, 0.82, 0.48],
    highlight: [0.78, 0.86, 0.8],
  },
];

export function getPaletteVectors(index: number) {
  const p =
    FRACTAL_PALETTES[
      Math.max(
        0,
        Math.min(FRACTAL_PALETTES.length - 1, Math.round(index)),
      )
    ];
  const deep = new THREE.Vector3(...p.deep);
  const edge = new THREE.Vector3(...p.edge);
  const hi = new THREE.Vector3(...p.highlight);
  return { deep, edge, hi };
}
