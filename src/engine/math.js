// Pure math helpers used by the question generators.
// Dependency-free so they can be unit-tested in isolation.

export const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const randNonZero = (range) => {
  let n = 0;
  while (n === 0) n = randInt(-range, range);
  return n;
};

export const gcd = (a, b) => {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};

export const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

// Simplify a fraction to lowest terms, keeping sign on the numerator.
export const simplify = (n, d) => {
  if (d === 0) return { n: 0, d: 1 };
  const sign = d < 0 ? -1 : 1;
  n *= sign; d *= sign;
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
};

// Round away floating point noise.
export const clean = (x, dp = 6) => {
  const r = Number(x.toFixed(dp));
  return Object.is(r, -0) ? 0 : r;
};

export const neg = (x) => (x < 0 ? `(${x})` : `${x}`);

export const fracStr = ({ n, d }) => (d === 1 ? `${n}` : `${n}/${d}`);

// ---- mixed numbers ----
// Convert an improper fraction n/d (n,d>0) to { w, n, d } with proper, simplified fraction part.
export const toMixed = (n, d) => {
  const s = simplify(n, d);
  const w = Math.floor(s.n / s.d);
  const rem = s.n - w * s.d;
  return rem === 0 ? { w, n: 0, d: 1 } : { w, n: rem, d: s.d };
};
export const mixedStr = ({ w, n, d }) =>
  n === 0 ? `${w}` : w === 0 ? `${n}/${d}` : `${w} ${n}/${d}`;
// improper value of a mixed
export const mixedToImproper = ({ w, n, d }) => ({ n: w * d + n, d });

// ---- ratios ----
export const simplifyRatio = (parts) => {
  const g = parts.reduce((a, b) => gcd(a, b));
  return parts.map((p) => p / g);
};
export const ratioStr = (parts) => parts.join(':');

// ---- primes ----
export const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};
export const primeFactors = (n) => {
  const f = {};
  let x = n;
  for (let p = 2; p * p <= x; p++) {
    while (x % p === 0) { f[p] = (f[p] || 0) + 1; x /= p; }
  }
  if (x > 1) f[x] = (f[x] || 0) + 1;
  return f; // { prime: exponent }
};
// pretty "2² × 3²"
const SUP = { 1: '', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶' };
export const primeFacStr = (n) => {
  const f = primeFactors(n);
  return Object.keys(f).map((p) => `${p}${SUP[f[p]] ?? '^' + f[p]}`).join(' × ');
};
