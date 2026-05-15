export interface Cx {
  re: number;
  im: number;
}

export function cx(re: number, im: number): Cx {
  return { re, im };
}

export function add(a: Cx, b: Cx): Cx {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function abs2(z: Cx): number {
  return z.re * z.re + z.im * z.im;
}

/** z^n for real exponent n (principal branch). */
export function powReal(z: Cx, n: number): Cx {
  const r2 = z.re * z.re + z.im * z.im;
  if (r2 < 1e-20) return cx(0, 0);
  const r = Math.sqrt(r2);
  const theta = Math.atan2(z.im, z.re);
  const rn = Math.pow(r, n);
  const nt = theta * n;
  return { re: rn * Math.cos(nt), im: rn * Math.sin(nt) };
}
