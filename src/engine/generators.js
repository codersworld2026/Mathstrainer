// Auto-generating question bank aligned to the Year 7 AP3 Revision Pack.
// Each generator is (level: 1|2|3|4) => Question, where levels map to the
// pack's tiers:  1 Bronze · 2 Silver · 3 Gold · 4 Challenge.
//
// Question shape:
//   { skillId, level, prompt, answerType, answer, steps[], hint, options? }
// answerType:
//   integer | decimal | fraction{n,d} | mixed{w,n,d} | ratio[..] |
//   linear{coeff,c,v} | coord{x,y} | choice(answer=index, options[]) | primefac(answer=N)
//
// Worked "steps" use plain, supportive language to match the inclusion style.

import {
  randInt, choice, shuffle, gcd, lcm, simplify, clean, fracStr, toMixed, mixedStr,
  simplifyRatio, ratioStr, primeFactors, primeFacStr,
} from './math.js';

const properFrac = (maxD) => {
  const d = randInt(2, maxD);
  const n = randInt(1, d - 1);
  return { n, d };
};
const shuffleChoice = (correct, distractors) => {
  const opts = [correct, ...distractors];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return { options: opts, answer: opts.indexOf(correct) };
};

// LO1 — Fraction of an amount
function lo1(level) {
  const d = randInt(3, level >= 2 ? 12 : 8);
  const num = level === 1 ? 1 : randInt(2, d - 1);
  const part = randInt(2, level >= 3 ? 30 : 12);
  const whole = d * part;
  const answer = num * part;
  const contexts = [
    `A ribbon is ${whole} cm long. ${num}/${d} of it is used. How many cm is that?`,
    `There are ${whole} pupils. ${num}/${d} choose art. How many pupils is that?`,
  ];
  const prompt = level >= 3 ? choice(contexts) : `Work out ${num}/${d} of ${whole}`;
  return { skillId: 'lo1', level, prompt, answerType: 'integer', answer,
    steps: [`Divide by the bottom to find one part: ${whole} ÷ ${d} = ${part}.`, `Multiply by the top: ${part} × ${num} = ${answer}.`],
    hint: 'Divide by the bottom, then times by the top.' };
}

// LO2 — Improper fractions & mixed numbers
function lo2(level) {
  const toImproper = level === 3;
  const d = randInt(2, level >= 2 ? 9 : 5);
  const w = randInt(2, level >= 4 ? 5 : 3);
  let n = randInt(1, d - 1);
  while (gcd(n, d) !== 1) n = randInt(1, d - 1); // proper part in lowest terms, like the pack
  if (toImproper) {
    const imp = w * d + n;
    return { skillId: 'lo2', level, prompt: `Write ${w} ${n}/${d} as an improper fraction`,
      answerType: 'fraction', answer: { n: imp, d },
      steps: [`Whole × bottom: ${w} × ${d} = ${w * d}.`, `Add the top: ${w * d} + ${n} = ${imp}.`, `= ${imp}/${d}`],
      hint: 'Whole × bottom, then add the top.' };
  }
  const impN = w * d + n;
  return { skillId: 'lo2', level, prompt: `Write ${impN}/${d} as a mixed number`,
    answerType: 'mixed', answer: { w, n, d },
    steps: [`Divide top by bottom: ${impN} ÷ ${d} = ${w} remainder ${n}.`, `= ${w} ${n}/${d}`],
    hint: 'Divide the top by the bottom — remainder is the new top.' };
}

// LO3 — Ratio tables
function lo3(level) {
  let a, m;
  if (level === 1) { a = randInt(2, 6); m = randInt(2, 5); }
  else if (level === 2) { a = randInt(3, 9); m = clean(randInt(4, 9) / 3); }
  else if (level === 3) { a = clean(randInt(3, 9) + 0.5); m = randInt(2, 5); }
  else { a = randInt(3, 8); m = clean(randInt(20, 45) / 10); }
  const b = clean(a * m);
  const x = randInt(Math.ceil(a) + 1, Math.ceil(a) + 10);
  const answer = clean(x * m);
  return { skillId: 'lo3', level, prompt: `In a ratio table, ${a} changes to ${b}. What does ${x} change to?`,
    answerType: 'decimal', answer,
    steps: [`Find the multiplier: ${b} ÷ ${a} = ${m}.`, `Apply it: ${x} × ${m} = ${answer}.`],
    hint: 'Work out what the first number was multiplied by.' };
}

// LO4 — Perimeter with a missing side
function lo4(level) {
  if (level === 1) {
    const other = randInt(5, 15), s = randInt(4, 12);
    const P = 2 * (other + s);
    return { skillId: 'lo4', level, prompt: `A rectangle has perimeter ${P} cm. One side is ${s} cm. Find the other side.`,
      answerType: 'integer', answer: other,
      steps: [`Half the perimeter = one length + one width: ${P} ÷ 2 = ${P / 2}.`, `Subtract the known side: ${P / 2} − ${s} = ${other} cm.`],
      hint: 'Half the perimeter, then subtract the side you know.' };
  }
  if (level === 2) {
    const x = randInt(10, 30), b = randInt(12, 25), c = randInt(12, 25);
    const P = x + b + c;
    return { skillId: 'lo4', level, prompt: `A triangle has perimeter ${P} cm. Two sides are ${b} cm and ${c} cm. Find the missing side.`,
      answerType: 'integer', answer: x,
      steps: [`Add the known sides: ${b} + ${c} = ${b + c}.`, `Subtract from perimeter: ${P} − ${b + c} = ${x} cm.`],
      hint: 'Add the sides you know, take them off the perimeter.' };
  }
  if (level === 3) {
    const s = [randInt(4, 9), randInt(6, 12), randInt(8, 14), randInt(5, 13)];
    const x = randInt(6, 16);
    const P = s.reduce((a, b) => a + b, 0) + x;
    return { skillId: 'lo4', level, prompt: `A pentagon has sides ${s[0]}, ${s[1]}, ${s[2]}, x and ${s[3]} cm. The perimeter is ${P} cm. Find x.`,
      answerType: 'integer', answer: x,
      steps: [`Add the known sides: ${s.join(' + ')} = ${P - x}.`, `Subtract from perimeter: ${P} − ${P - x} = ${x} cm.`],
      hint: 'Add the four you know, subtract from the total.' };
  }
  const equal = randInt(15, 35), base = randInt(15, 35);
  const P = 2 * equal + base;
  return { skillId: 'lo4', level, prompt: `An isosceles triangle has perimeter ${P} cm. Its base is ${base} cm. Find each equal side.`,
    answerType: 'integer', answer: equal,
    steps: [`Take off the base: ${P} − ${base} = ${P - base}.`, `Halve for the two equal sides: ${P - base} ÷ 2 = ${equal} cm.`],
    hint: 'Remove the base, then halve what is left.' };
}

// LO5 — Compare fractions
function lo5(level) {
  if (level <= 2) {
    const f1 = properFrac(level === 1 ? 9 : 12);
    let f2 = level === 1 ? { n: f1.n, d: f1.d + randInt(1, 4) } : properFrac(12);
    while (f1.n / f1.d === f2.n / f2.d) f2 = properFrac(12);
    const correct = f1.n / f1.d > f2.n / f2.d ? '>' : '<';
    const { options, answer } = shuffleChoice(correct, [correct === '>' ? '<' : '>']);
    return { skillId: 'lo5', level, prompt: `Choose the correct sign:  ${f1.n}/${f1.d}  ▢  ${f2.n}/${f2.d}`,
      answerType: 'choice', options, answer,
      steps: [`Turn each into a decimal.`, `${fracStr(f1)} = ${clean(f1.n / f1.d, 3)} and ${fracStr(f2)} = ${clean(f2.n / f2.d, 3)}.`, `So ${fracStr(f1)} ${correct} ${fracStr(f2)}.`],
      hint: 'Turn both into decimals to compare.' };
  }
  const fs = [];
  while (fs.length < (level === 3 ? 2 : 3)) {
    const f = properFrac(12);
    if (!fs.some((g) => g.n / g.d === f.n / f.d)) fs.push(f);
  }
  if (level === 3) {
    const larger = fs[0].n / fs[0].d > fs[1].n / fs[1].d ? fs[0] : fs[1];
    const { options, answer } = shuffleChoice(fracStr(larger), [fracStr(fs[0] === larger ? fs[1] : fs[0])]);
    return { skillId: 'lo5', level, prompt: `Which is larger?`, answerType: 'choice', options, answer,
      steps: [`As decimals: ${fs.map((f) => `${fracStr(f)} = ${clean(f.n / f.d, 3)}`).join(', ')}.`, `So ${fracStr(larger)} is larger.`],
      hint: 'Decimals make it easy.' };
  }
  const smallest = fs.reduce((a, b) => (a.n / a.d <= b.n / b.d ? a : b));
  const { options, answer } = shuffleChoice(fracStr(smallest), fs.filter((f) => f !== smallest).map(fracStr));
  return { skillId: 'lo5', level, prompt: `Which is the smallest?`, answerType: 'choice', options, answer,
    steps: [`As decimals: ${fs.map((f) => `${fracStr(f)} = ${clean(f.n / f.d, 3)}`).join(', ')}.`, `Smallest is ${fracStr(smallest)}.`],
    hint: 'Convert to decimals and find the lowest.' };
}

// LO6 — Prime factorisation
function lo6(level) {
  const ranges = { 1: [12, 50], 2: [50, 99], 3: [100, 199], 4: [200, 399] };
  const [lo, hi] = ranges[level];
  let N = randInt(lo, hi);
  while (Object.values(primeFactors(N)).reduce((a, b) => a + b, 0) < 2) N = randInt(lo, hi);
  return { skillId: 'lo6', level, prompt: `Express ${N} as a product of powers of its prime factors`,
    answerType: 'primefac', answer: N,
    steps: [`Keep dividing by the smallest prime that fits (2, then 3, then 5 …).`, `${N} = ${primeFacStr(N)}.`],
    hint: 'Use a factor tree with primes only.' };
}

// LO7 — HCF and LCM from prime factors
function lo7(level) {
  const wantLCM = level === 1 || level === 3;
  const a = randInt(12, 40), b = randInt(12, 40);
  const ans = wantLCM ? lcm(a, b) : gcd(a, b);
  return { skillId: 'lo7', level,
    prompt: `${a} = ${primeFacStr(a)} and ${b} = ${primeFacStr(b)}. Find the ${wantLCM ? 'LCM' : 'HCF'} of ${a} and ${b}.`,
    answerType: 'integer', answer: ans,
    steps: wantLCM
      ? [`LCM uses the highest power of every prime that appears.`, `LCM = ${ans}.`]
      : [`HCF uses the lowest power of the primes they share.`, `HCF = ${ans}.`],
    hint: wantLCM ? 'LCM: highest power of each prime.' : 'HCF: only the shared primes.' };
}

// LO8 — Add & subtract fractions, same denominator
function lo8(level) {
  const d = randInt(5, 12);
  if (level <= 2) {
    const op = level === 2 ? '-' : choice(['+', '-']);
    let a = randInt(1, d - 1), b = randInt(1, d - 1);
    if (op === '-' && a < b) [a, b] = [b, a];
    const raw = op === '+' ? a + b : a - b;
    const ans = simplify(raw, d);
    return { skillId: 'lo8', level, prompt: `${a}/${d} ${op} ${b}/${d}`, answerType: 'fraction', answer: ans,
      steps: [`Same bottom, so ${op === '+' ? 'add' : 'subtract'} the tops: ${a} ${op} ${b} = ${raw}.`, `= ${raw}/${d}${ans.n !== raw || ans.d !== d ? ` = ${fracStr(ans)}` : ''}`],
      hint: 'Keep the bottom, work on the tops.' };
  }
  const a = randInt(Math.ceil(d / 2), d - 1), b = randInt(Math.ceil(d / 2), d - 1);
  const raw = a + b;
  const ans = toMixed(raw, d);
  return { skillId: 'lo8', level, prompt: `${a}/${d} + ${b}/${d}  (answer as a mixed number)`, answerType: 'mixed', answer: ans,
    steps: [`Add the tops: ${a} + ${b} = ${raw}, so ${raw}/${d}.`, `Top-heavy → mixed number: ${mixedStr(ans)}.`],
    hint: 'Add the tops, then convert to a mixed number.' };
}

// LO9 — Simplify ratios (and justify)
function lo9(level) {
  if (level === 2) {
    const coprime = Math.random() < 0.5;
    let a, b;
    if (coprime) { do { a = randInt(2, 14); b = randInt(2, 14); } while (gcd(a, b) !== 1 || a === b); }
    else { const base = simplifyRatio([randInt(1, 5), randInt(1, 5)]); const k = randInt(2, 5); a = base[0] * k; b = base[1] * k; }
    const correct = coprime ? 'No, already simplest' : 'Yes, it can be simplified';
    const { options, answer } = shuffleChoice(correct, [coprime ? 'Yes, it can be simplified' : 'No, already simplest']);
    return { skillId: 'lo9', level, prompt: `Can the ratio ${a}:${b} be simplified?`, answerType: 'choice', options, answer,
      steps: [`Check the HCF of ${a} and ${b}: it is ${gcd(a, b)}.`, gcd(a, b) === 1 ? `HCF is 1 → already simplest.` : `HCF is ${gcd(a, b)} → yes it simplifies.`],
      hint: 'Share a factor above 1? Then it simplifies.' };
  }
  const parts = level === 3 ? 3 : 2;
  const base = Array.from({ length: parts }, () => randInt(1, 6));
  const k = randInt(2, level === 4 ? 18 : 6);
  const given = base.map((x) => x * k);
  const ans = simplifyRatio(given);
  const g = given.reduce((a, b) => gcd(a, b));
  return { skillId: 'lo9', level, prompt: `Simplify the ratio ${ratioStr(given)}`, answerType: 'ratio', answer: ans,
    steps: [`Highest common factor of the parts is ${g}.`, `Divide each part by ${g} → ${ratioStr(ans)}.`],
    hint: 'Divide every part by the same number.' };
}

// LO10 — Simplify fractions
function lo10(level) {
  const q = randInt(2, level >= 3 ? 9 : 6);
  let p = randInt(1, q - 1);
  while (gcd(p, q) !== 1) p = randInt(1, q - 1);
  const k = randInt(2, level === 1 ? 4 : level === 2 ? 6 : 9);
  const n = p * k, d = q * k;
  return { skillId: 'lo10', level, prompt: `Simplify ${n}/${d}`, answerType: 'fraction', answer: { n: p, d: q },
    steps: [`HCF of ${n} and ${d} is ${k}.`, `Divide both by ${k}: ${p}/${q}.`],
    hint: 'Divide top and bottom by their HCF.' };
}

// LO11 — Fractions of fractions
function lo11(level) {
  const f1 = properFrac(level >= 3 ? 9 : 6);
  const f2 = properFrac(level >= 3 ? 9 : 6);
  if (level === 4) {
    const ans = simplify(f1.n * f2.n, f1.d * f2.d);
    return { skillId: 'lo11', level, prompt: `A tank is ${fracStr(f1)} full. ${fracStr(f2)} of the water is used. What fraction of the whole tank is used?`,
      answerType: 'fraction', answer: ans,
      steps: [`"of" means multiply: ${fracStr(f2)} × ${fracStr(f1)}.`, `${f2.n}×${f1.n}/${f2.d}×${f1.d} → ${fracStr(ans)}.`],
      hint: '"of" means multiply.' };
  }
  const ans = simplify(f1.n * f2.n, f1.d * f2.d);
  return { skillId: 'lo11', level, prompt: `Work out ${fracStr(f1)} of ${fracStr(f2)}`, answerType: 'fraction', answer: ans,
    steps: [`"of" means multiply: ${f1.n}×${f2.n}=${f1.n * f2.n}, ${f1.d}×${f2.d}=${f1.d * f2.d}.`, `Simplify → ${fracStr(ans)}.`],
    hint: '"of" means multiply.' };
}

// LO12 — Fraction of whole -> part:part ratio
function lo12(level) {
  const d = randInt(4, 12);
  const n = randInt(1, d - 1);
  const rest = d - n;
  if (level === 4) {
    const part = randInt(2, 9);
    const restCount = rest * part;
    const answer = n * part;
    return { skillId: 'lo12', level, prompt: `${n}/${d} of visitors are adults, the rest children. There are ${restCount} children. How many adults?`,
      answerType: 'integer', answer,
      steps: [`Children = ${rest} parts = ${restCount}, so one part = ${part}.`, `Adults = ${n} parts = ${answer}.`],
      hint: 'Find one part, then scale up.' };
  }
  const ans = simplifyRatio([n, rest]);
  return { skillId: 'lo12', level, prompt: `${n}/${d} of the counters are red, the rest blue. Write the ratio red:blue.`,
    answerType: 'ratio', answer: ans,
    steps: [`Red = ${n} parts, blue = ${rest} parts.`, `red:blue = ${n}:${rest}${ratioStr(ans) !== `${n}:${rest}` ? ` = ${ratioStr(ans)}` : ''}.`],
    hint: 'The rest = bottom − top.' };
}

// LO13 — Multiplicative relationships
function lo13(level) {
  if (level === 2 || level === 4) {
    const m = randInt(2, 6);
    const correct = `y = ${m + 1}x`;
    const { options, answer } = shuffleChoice(correct, [`x:y = 1:${m}`, `a table showing ×${m}`]);
    return { skillId: 'lo13', level, prompt: `Two of these show the same rule, one is different. Which is different?`,
      answerType: 'choice', options, answer,
      steps: [`Two options multiply x by ${m}; the odd one multiplies by ${m + 1}.`, `So "${correct}" is different.`],
      hint: 'Find the multiplier in each.' };
  }
  const m = level === 1 ? randInt(2, 5) : clean(randInt(20, 30) / 10);
  const x = randInt(2, 6);
  const y = clean(x * m);
  return { skillId: 'lo13', level, prompt: level === 3
      ? `A straight-line graph through the origin passes through (${x}, ${y}). What is the multiplier from x to y?`
      : `A table maps ${x} → ${y}. What is the multiplier from x to y?`,
    answerType: 'decimal', answer: m,
    steps: [`Divide y by x: ${y} ÷ ${x} = ${m}.`],
    hint: 'Multiplier = y ÷ x.' };
}

// LO14 — Expand and simplify
function lo14(level) {
  if (level === 1) {
    const k = randInt(2, 6), c = randInt(2, 9);
    return { skillId: 'lo14', level, prompt: `Expand ${k}(x + ${c})`, answerType: 'linear', answer: { coeff: k, c: k * c, v: 'x' },
      steps: [`Multiply each term by ${k}: ${k}×x and ${k}×${c}.`, `= ${k}x + ${k * c}`], hint: 'Multiply everything inside.' };
  }
  if (level === 2) {
    const k = randInt(2, 4), a = randInt(2, 5), c = randInt(2, 6), extra = randInt(1, 5);
    return { skillId: 'lo14', level, prompt: `Expand and simplify ${k}(${a}x − ${c}) + ${extra}x`, answerType: 'linear', answer: { coeff: k * a + extra, c: -k * c, v: 'x' },
      steps: [`Expand: ${k * a}x − ${k * c}.`, `Add ${extra}x: (${k * a}+${extra})x = ${k * a + extra}x.`, `= ${k * a + extra}x − ${k * c}`],
      hint: 'Expand, then collect the x terms.' };
  }
  if (level === 3) {
    const k1 = randInt(2, 5), a1 = randInt(2, 3), c1 = randInt(2, 5), k2 = randInt(2, 3), c2 = randInt(2, 5);
    return { skillId: 'lo14', level, prompt: `Expand and simplify ${k1}(${a1}a + ${c1}) − ${k2}(a − ${c2})`, answerType: 'linear', answer: { coeff: k1 * a1 - k2, c: k1 * c1 + k2 * c2, v: 'a' },
      steps: [`First: ${k1 * a1}a + ${k1 * c1}.`, `Second: −${k2}a + ${k2 * c2} (minus flips the signs).`, `Collect: ${k1 * a1 - k2}a + ${k1 * c1 + k2 * c2}`],
      hint: 'Watch the minus before the second bracket.' };
  }
  const k1 = randInt(2, 4), a1 = randInt(2, 3), c1 = randInt(3, 6), k2 = randInt(2, 4), a2 = randInt(2, 3), c2 = randInt(2, 4), extra = randInt(3, 9);
  const con = -k1 * c1 + k2 * c2 - extra;
  return { skillId: 'lo14', level, prompt: `Expand and simplify ${k1}(${a1}x − ${c1}) + ${k2}(${a2}x + ${c2}) − ${extra}`, answerType: 'linear', answer: { coeff: k1 * a1 + k2 * a2, c: con, v: 'x' },
    steps: [`Expand: ${k1 * a1}x − ${k1 * c1}, then ${k2 * a2}x + ${k2 * c2}.`, `x terms: ${k1 * a1 + k2 * a2}x. Numbers: −${k1 * c1}+${k2 * c2}−${extra} = ${con}.`, `= ${k1 * a1 + k2 * a2}x ${con < 0 ? '−' : '+'} ${Math.abs(con)}`],
    hint: 'Expand all brackets, then gather like terms.' };
}

// LO15 — Fractions to decimals
function lo15(level) {
  const pool = { 1: [['3', '4'], ['1', '4'], ['1', '2']], 2: [['7', '10'], ['3', '10'], ['9', '10']],
    3: [['3', '8'], ['5', '8'], ['7', '8']], 4: [['7', '16'], ['5', '16'], ['3', '16']] };
  const [n, d] = choice(pool[level]).map(Number);
  const answer = clean(n / d);
  return { skillId: 'lo15', level, prompt: `Write ${n}/${d} as a decimal`, answerType: 'decimal', answer,
    steps: [`Top ÷ bottom: ${n} ÷ ${d} = ${answer}.`], hint: 'Divide the top by the bottom.' };
}

// LO16 — Ratio recipes
function lo16(level) {
  const a = randInt(2, 7), b = randInt(2, 7);
  const part = randInt(4, 18);
  const givenA = a * part;
  const answer = b * part;
  const names = choice([['flour', 'sugar'], ['oil', 'water'], ['red', 'blue']]);
  return { skillId: 'lo16', level, prompt: `${names[0]}:${names[1]} = ${a}:${b}. If ${givenA} of ${names[0]} is used, how much ${names[1]} is needed?`,
    answerType: 'integer', answer,
    steps: [`One part = ${givenA} ÷ ${a} = ${part}.`, `${names[1]} = ${b} parts = ${answer}.`],
    hint: 'Find one part, then multiply.' };
}

// LO16b — Scale factor multiplier
function lo16b(level) {
  const have = randInt(4, 10);
  const need = randInt(have + 1, have + 12);
  const answer = clean(need / have);
  return { skillId: 'lo16b', level, prompt: `A recipe makes ${have} portions. You need ${need}. What multiplier should you use?`,
    answerType: 'decimal', answer,
    steps: [`Multiplier = new ÷ old = ${need} ÷ ${have} = ${answer}.`], hint: 'New ÷ old.' };
}

// LO17 — Remaining fraction
function lo17(level) {
  const maxD = level >= 3 ? 12 : 6;
  const f1 = properFrac(maxD);
  let f2 = properFrac(maxD);
  let guard = 0;
  const used = () => { const L = lcm(f1.d, f2.d); return { L, u: f1.n * (L / f1.d) + f2.n * (L / f2.d) }; };
  while (used().u >= used().L && guard < 80) { f2 = properFrac(maxD); guard++; }
  const { L, u } = used();
  const ans = simplify(L - u, L);
  return { skillId: 'lo17', level, prompt: `A bowl is ${fracStr(f1)} apples and ${fracStr(f2)} bananas. The rest are oranges. What fraction are oranges?`,
    answerType: 'fraction', answer: ans,
    steps: [`Common bottom ${L}: ${f1.n * (L / f1.d)}/${L} + ${f2.n * (L / f2.d)}/${L} = ${u}/${L} used.`, `Oranges = ${L}/${L} − ${u}/${L} = ${fracStr(ans)}.`],
    hint: 'Add the two, then take from 1.' };
}

// LO18 — Find the whole from a fraction
function lo18(level) {
  if (level >= 3) {
    const mk = () => { const d = randInt(2, 6); const n = randInt(1, d - 1); const whole = randInt(3, 12) * d; return { n, d, whole, part: (n * whole) / d }; };
    const A = mk(), B = mk();
    const correct = A.whole >= B.whole ? 'A' : 'B';
    const { options, answer } = shuffleChoice(correct, [correct === 'A' ? 'B' : 'A']);
    return { skillId: 'lo18', level, prompt: `A: ${A.n}/${A.d} of a number is ${A.part}.  B: ${B.n}/${B.d} of a number is ${B.part}.  Whose number is greater?`,
      answerType: 'choice', options, answer,
      steps: [`A's number = ${A.part} ÷ ${A.n} × ${A.d} = ${A.whole}.`, `B's number = ${B.part} ÷ ${B.n} × ${B.d} = ${B.whole}.`, `So ${correct} is greater.`],
      hint: 'Find each whole, then compare.' };
  }
  const d = randInt(2, 6), n = randInt(1, d - 1);
  const whole = randInt(4, 14) * d;
  const part = (n * whole) / d;
  return { skillId: 'lo18', level, prompt: `${n}/${d} of a number is ${part}. What is the number?`,
    answerType: 'integer', answer: whole,
    steps: [`${n} parts = ${part}, so one part = ${part / n}.`, `Whole = ${d} parts = ${part / n} × ${d} = ${whole}.`],
    hint: 'Find one part, then × the bottom.' };
}

// LO19 — Algebraic terms and constants
function lo19(level) {
  const coeff = randInt(2, 9), con = randInt(2, 11), v = choice(['x', 'a', 'y']);
  if (level === 1)
    return { skillId: 'lo19', level, prompt: `In ${coeff}${v} + ${con}, what is the coefficient of ${v}?`,
      answerType: 'integer', answer: coeff, steps: [`The coefficient is the number multiplying ${v} → ${coeff}.`], hint: 'The number stuck to the letter.' };
  if (level === 2)
    return { skillId: 'lo19', level, prompt: `In ${coeff}${v} − ${con}, what is the constant term?`,
      answerType: 'integer', answer: -con, steps: [`The constant is the number on its own (with sign) → −${con}.`], hint: 'The number with no letter.' };
  if (level === 3) {
    const correct = 'No — every term has a letter';
    const { options, answer } = shuffleChoice(correct, ['Yes — there is a constant']);
    return { skillId: 'lo19', level, prompt: `In ${randInt(2, 6)}${v}² + ${coeff}${v}, is there a constant term?`,
      answerType: 'choice', options, answer, steps: [`A constant has no letter.`, `Both terms contain ${v}, so there is none.`], hint: 'A constant has no letter.' };
  }
  const sq = randInt(2, 5);
  return { skillId: 'lo19', level, prompt: `For ${sq}${v}² − ${coeff}${v} + ${con}, what is the coefficient of ${v}?`,
    answerType: 'integer', answer: -coeff, steps: [`The ${v} term is −${coeff}${v}, coefficient = −${coeff}.`], hint: 'Include the minus sign.' };
}

// LO20 — Like terms
function lo20(level) {
  const v = choice(['x', 'y', 'p', 'a']);
  if (level === 1) {
    const c1 = randInt(2, 6), c2 = randInt(2, 6);
    const correct = `${c1}${v} and ${c2}${v}`;
    const { options, answer } = shuffleChoice(correct, [`${c1}${v} and ${c1}`, `${c1}${v} and ${c2}${v}²`]);
    return { skillId: 'lo20', level, prompt: `Which pair are like terms?`, answerType: 'choice', options, answer,
      steps: [`Like terms share the same letter and power.`, `${c1}${v} and ${c2}${v} match.`], hint: 'Same letter, same power.' };
  }
  if (level === 2) {
    const c = randInt(2, 6);
    const correct = 'No — different powers';
    const { options, answer } = shuffleChoice(correct, ['Yes — they are like terms']);
    return { skillId: 'lo20', level, prompt: `Are ${c}${v} and ${c}${v}² like terms?`, answerType: 'choice', options, answer,
      steps: [`${v} and ${v}² are different powers → not like terms.`], hint: `${v} and ${v}² differ.` };
  }
  const c1 = randInt(3, 8), c2 = randInt(1, c1 - 1), k1 = randInt(2, 9), k2 = randInt(2, 9);
  return { skillId: 'lo20', level, prompt: `Simplify ${c1}${v} + ${k1} − ${c2}${v} + ${k2}`, answerType: 'linear', answer: { coeff: c1 - c2, c: k1 + k2, v },
    steps: [`${v} terms: ${c1}${v} − ${c2}${v} = ${c1 - c2}${v}.`, `Numbers: ${k1} + ${k2} = ${k1 + k2}.`, `= ${c1 - c2}${v} + ${k1 + k2}`],
    hint: 'Group letters, then numbers.' };
}

// LO22 — Midpoint of two coordinates
function lo22(level) {
  const span = level === 1 ? 8 : 12;
  const mk = () => randInt(-span, span);
  let x1 = mk(), x2 = mk(); while ((x1 + x2) % 2 !== 0) x2 = mk();
  let y1 = level === 1 ? 4 : mk(), y2 = level === 1 ? 4 : mk(); while ((y1 + y2) % 2 !== 0) y2 = mk();
  const mid = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  return { skillId: 'lo22', level, prompt: `Find the midpoint of A(${x1}, ${y1}) and B(${x2}, ${y2})`, answerType: 'coord', answer: mid,
    steps: [`x: (${x1} + ${x2}) ÷ 2 = ${mid.x}.`, `y: (${y1} + ${y2}) ÷ 2 = ${mid.y}.`, `Midpoint = (${mid.x}, ${mid.y}).`],
    hint: 'Average the x-values, then the y-values.' };
}

// LO23 — Divide fractions (and spot errors)
function lo23(level) {
  if (level === 2) {
    const correct = 'The first fraction should NOT be flipped';
    const { options, answer } = shuffleChoice(correct, ['Both fractions should be flipped', 'The working is correct']);
    return { skillId: 'lo23', level, prompt: `Dividing fractions: which statement is right? (Spot the common error.)`,
      answerType: 'choice', options, answer,
      steps: [`Keep the first fraction.`, `Flip ONLY the second, then multiply.`], hint: 'Keep, flip, multiply — only the second flips.' };
  }
  const f1 = properFrac(9), f2 = properFrac(9);
  const rn = f1.n * f2.d, rd = f1.d * f2.n;
  if (level === 3) {
    const ans = toMixed(rn, rd);
    return { skillId: 'lo23', level, prompt: `${fracStr(f1)} ÷ ${fracStr(f2)}  (answer as a mixed number)`, answerType: 'mixed', answer: ans,
      steps: [`Flip and multiply: ${fracStr(f1)} × ${f2.d}/${f2.n} = ${rn}/${rd}.`, `= ${mixedStr(ans)}`], hint: 'Keep, flip, multiply.' };
  }
  if (level === 4) {
    const cupD = choice([6, 8, 10]);
    const jug = randInt(2, cupD - 1);
    return { skillId: 'lo23', level, prompt: `A jug holds ${jug}/${cupD} litre. Each cup holds 1/${cupD} litre. How many cups can be filled?`,
      answerType: 'integer', answer: jug,
      steps: [`${jug}/${cupD} ÷ 1/${cupD} = ${jug}/${cupD} × ${cupD}/1 = ${jug}.`], hint: 'Flip the second fraction and multiply.' };
  }
  const ans = simplify(rn, rd);
  return { skillId: 'lo23', level, prompt: `${fracStr(f1)} ÷ ${fracStr(f2)}`, answerType: 'fraction', answer: ans,
    steps: [`Flip and multiply: ${fracStr(f1)} × ${f2.d}/${f2.n} = ${rn}/${rd}.`, `Simplify → ${fracStr(ans)}.`], hint: 'Keep, flip, multiply.' };
}

// LO24 — Subtract mixed numbers
function lo24(level) {
  const d = level <= 2 ? randInt(2, 6) : choice([3, 4, 5, 6, 10]);
  const w1 = randInt(3, 8), w2 = randInt(1, w1 - 1);
  let n1 = randInt(1, d - 1), n2 = randInt(1, d - 1);
  if (level <= 2) { n1 = randInt(1, d - 1); n2 = randInt(1, n1); }
  const imp1 = w1 * d + n1, imp2 = w2 * d + n2;
  const ans = toMixed(imp1 - imp2, d);
  return { skillId: 'lo24', level, prompt: `${w1} ${n1}/${d} − ${w2} ${n2}/${d}`, answerType: 'mixed', answer: ans,
    steps: [`Top-heavy: ${imp1}/${d} − ${imp2}/${d}.`, `Subtract: ${imp1 - imp2}/${d} = ${mixedStr(ans)}.`],
    hint: 'Turn both into top-heavy fractions first.' };
}

// LO26 — Sharing in a ratio from partial information
function lo26(level) {
  const a = randInt(2, 5), b = randInt(2, 5), c = randInt(2, 6);
  const total = a + b + c;
  const part = randInt(4, 12);
  if (level >= 3) {
    const known = b * part;
    return { skillId: 'lo26', level, prompt: `M:N:P = ${a}:${b}:${c}. N is ${known}. Find the total amount.`,
      answerType: 'integer', answer: total * part,
      steps: [`N = ${b} parts = ${known}, so one part = ${part}.`, `Total = ${total} parts = ${total * part}.`],
      hint: 'Find one part, then the whole.' };
  }
  const twoSum = (a + b) * part;
  return { skillId: 'lo26', level, prompt: `A:B:C = ${a}:${b}:${c}. A and B together are ${twoSum}. Find the total amount.`,
    answerType: 'integer', answer: total * part,
    steps: [`A + B = ${a + b} parts = ${twoSum}, so one part = ${part}.`, `Total = ${total} parts = ${total * part}.`],
    hint: 'Work out one part, then × all the parts.' };
}

// LO27 — Negative numbers in context
function lo27(level) {
  if (level === 1) { const start = -randInt(3, 12), rise = randInt(4, 16);
    return { skillId: 'lo27', level, prompt: `The temperature is ${start}°C. It rises by ${rise}°C. What is the new temperature?`, answerType: 'integer', answer: start + rise,
      steps: [`Start at ${start}, count up ${rise} → ${start + rise}°C.`], hint: 'Rising moves up the number line.' }; }
  if (level === 2) { const start = randInt(1, 6), fall = randInt(8, 16);
    return { skillId: 'lo27', level, prompt: `The temperature is ${start}°C. It falls by ${fall}°C. What is the new temperature?`, answerType: 'integer', answer: start - fall,
      steps: [`Start at ${start}, count down ${fall} → ${start - fall}°C.`], hint: 'Falling moves down past zero.' }; }
  if (level === 3) { const a = -randInt(10, 18), b = -randInt(2, 9);
    return { skillId: 'lo27', level, prompt: `A freezer is normally ${a}°C. It rises to ${b}°C. How many degrees did it rise?`, answerType: 'integer', answer: b - a,
      steps: [`End − start = ${b} − (${a}) = ${b - a}.`, `It rose ${b - a}°C.`], hint: 'End minus start.' }; }
  const start = randInt(1, 5), target = -randInt(12, 22);
  return { skillId: 'lo27', level, prompt: `A freezer is at ${start}°C. It needs to reach ${target}°C. How many degrees must it fall?`, answerType: 'integer', answer: start - target,
    steps: [`Start − target = ${start} − (${target}) = ${start - target}.`, `Must fall ${start - target}°C.`], hint: 'Count the gap down the line.' };
}

// LO29 — Largest decimal from a pair
function lo29(level) {
  const mk = () => {
    const sign = level >= 3 ? -1 : choice([1, -1, 1]);
    const dp = level === 1 ? choice([1, 2]) : choice([2, 3]);
    return clean((sign * randInt(1, 999)) / Math.pow(10, dp));
  };
  let a = mk(), b = mk();
  while (a === b) b = mk();
  const larger = a > b ? a : b;
  const { options, answer } = shuffleChoice(String(larger), [String(a === larger ? b : a)]);
  return { skillId: 'lo29', level, prompt: `Which is larger?`, answerType: 'choice', options, answer,
    steps: [`Compare place value digit by digit. For negatives, closer to zero is larger.`, `${larger} is larger.`],
    hint: 'For negatives, closer to zero is bigger.' };
}

// ===========================================================================
// Diagram pass — LO21, LO25, LO28, LO30.
// These four carry a `diagram` descriptor (plain data, rendered to SVG by
// Diagram.jsx) or an `items` list for the drag/reorder input, so generators.js
// stays pure and testable.
// ===========================================================================

// A coordinate-grid descriptor for a straight line y = mx + c.
function lineDiagram(m, c, dots) {
  const xMin = -5, xMax = 5, yMin = -6, yMax = 6;
  if (!dots) {
    const inY = (y) => y >= yMin && y <= yMax;
    dots = [[0, c]];
    if (inY(c + m)) dots.push([1, c + m]);
    else if (inY(c - m)) dots.push([-1, c - m]);
  }
  return { kind: 'line', m, c, xMin, xMax, yMin, yMax, dots };
}

// LO21 — Equation of a line read from a graph
function lo21(level) {
  if (level === 1) {
    const m = randInt(1, 3), c = randInt(1, 4);
    return { skillId: 'lo21', level, prompt: `Where does this line cross the y-axis?`,
      answerType: 'integer', answer: c, diagram: lineDiagram(m, c),
      steps: [`The y-intercept is where the line cuts the vertical (y) axis.`, `Here it crosses at y = ${c}.`],
      hint: 'Look at where the line meets the up-and-down axis.' };
  }
  if (level === 2) {
    const m = randInt(1, 3), c = randInt(-2, 3);
    return { skillId: 'lo21', level, prompt: `What is the gradient of this line?`,
      answerType: 'integer', answer: m, diagram: lineDiagram(m, c),
      steps: [`Gradient = how many squares up for every 1 square across.`, `Going 1 right, the line goes ${m} up, so the gradient is ${m}.`],
      hint: 'Count the up-squares for every 1 across.' };
  }
  if (level === 3) {
    const m = choice([1, 2, 3, -1, -2]), c = randInt(-3, 4);
    return { skillId: 'lo21', level, prompt: `Write the equation of this line in the form y = mx + c`,
      answerType: 'linear', answer: { coeff: m, c, v: 'x' }, diagram: lineDiagram(m, c),
      steps: [`Gradient m = ${m} (${m < 0 ? 'down' : 'up'} ${Math.abs(m)} for each 1 across).`, `It crosses the y-axis at ${c}, so c = ${c}.`, `Equation: y = ${m}x ${c < 0 ? '− ' : '+ '}${Math.abs(c)}.`],
      hint: 'Find the gradient, then the y-intercept.' };
  }
  const m = choice([-2, -1, 1, 2, 3]), c = randInt(-3, 3);
  const dots = [[-1, c - m], [1, c + m]];
  return { skillId: 'lo21', level, prompt: `The line passes through the two marked points. Find its equation (y = mx + c)`,
    answerType: 'linear', answer: { coeff: m, c, v: 'x' }, diagram: lineDiagram(m, c, dots),
    steps: [`From the marked points, going 1 right the line moves ${m} ${m < 0 ? 'down' : 'up'} → gradient ${m}.`, `Following it back to the y-axis gives c = ${c}.`, `Equation: y = ${m}x ${c < 0 ? '− ' : '+ '}${Math.abs(c)}.`],
    hint: 'Use the two points for the gradient, then track back to the y-axis.' };
}

// Shuffle a set of {label, value} into a presentation order that is NOT already
// correct, returning items with stable ids for the reorder UI.
function buildOrder(skillId, level, raw, direction, prompt, intro) {
  const items = raw.map((r, i) => ({ id: `o${i}`, label: r.label, value: r.value }));
  const sortedOK = (arr) => arr.every((it, k) => k === 0 ||
    (direction === 'desc' ? it.value < arr[k - 1].value : it.value > arr[k - 1].value));
  let pres = shuffle(items), guard = 0;
  while (sortedOK(pres) && items.length > 1 && guard < 50) { pres = shuffle(items); guard++; }
  const sorted = [...items].sort((a, b) => (direction === 'desc' ? b.value - a.value : a.value - b.value));
  const sep = direction === 'desc' ? ' > ' : ' < ';
  const piece = (it) => { const d = String(clean(it.value, 3)); return d === it.label ? it.label : `${it.label} = ${d}`; };
  return { skillId, level, prompt, answerType: 'order', items: pres, direction,
    steps: [intro, sorted.map(piece).join(',  '), `In order: ${sorted.map((it) => it.label).join(sep)}.`],
    hint: direction === 'desc' ? 'Largest goes at the top.' : 'Smallest goes at the top.' };
}

// LO25 — Order fractions & mixed numbers
function lo25(level) {
  const distinctFracs = (n, maxD) => {
    const out = [], seen = new Set();
    let guard = 0;
    while (out.length < n && guard < 400) {
      guard++;
      const d = randInt(2, maxD), nn = randInt(1, d - 1), v = nn / d;
      const key = Math.round(v * 1e6);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ label: `${nn}/${d}`, value: v });
    }
    return out;
  };
  if (level === 4) {
    // mix of mixed numbers (>1) and proper fractions (<1), largest first
    const fr = distinctFracs(2, 8);
    const mixed = [], seen = new Set();
    let guard = 0;
    while (mixed.length < 2 && guard < 400) {
      guard++;
      const w = randInt(1, 3), d = randInt(2, 6), nn = randInt(1, d - 1), v = w + nn / d;
      const key = Math.round(v * 1e6);
      if (seen.has(key)) continue;
      seen.add(key);
      mixed.push({ label: `${w} ${nn}/${d}`, value: v });
    }
    return buildOrder('lo25', level, [...fr, ...mixed], 'desc',
      'Put these in order, largest first.', 'Turn each one into a decimal to compare.');
  }
  const n = level === 1 ? 3 : 4;
  const maxD = level === 1 ? 6 : level === 2 ? 9 : 12;
  return buildOrder('lo25', level, distinctFracs(n, maxD), 'asc',
    'Put these in order, smallest first.', 'Turn each one into a decimal to compare.');
}

// LO28 — Order decimals
function lo28(level) {
  const distinctDecimals = (n, dps, allowNeg, maxInt) => {
    const out = [], seen = new Set();
    let guard = 0;
    while (out.length < n && guard < 500) {
      guard++;
      const dp = choice(dps);
      const sign = allowNeg ? choice([1, -1, 1]) : 1;
      const intPart = randInt(0, maxInt);
      const fracDigits = randInt(0, Math.pow(10, dp) - 1);
      const v = clean(sign * (intPart + fracDigits / Math.pow(10, dp)));
      if (v === 0) continue;
      if (seen.has(v)) continue;
      seen.add(v);
      out.push({ label: String(v), value: v });
    }
    return out;
  };
  let raw, direction, prompt;
  if (level === 1) { raw = distinctDecimals(3, [1, 2], false, 1); direction = 'asc'; prompt = 'Put these in order, smallest first.'; }
  else if (level === 2) { raw = distinctDecimals(4, [1, 2, 3], false, 1); direction = 'asc'; prompt = 'Put these in order, smallest first.'; }
  else if (level === 3) { raw = distinctDecimals(4, [1, 2], true, 2); direction = 'asc'; prompt = 'Put these in order, smallest first.'; }
  else { raw = distinctDecimals(4, [1, 2, 3], true, 2); direction = 'desc'; prompt = 'Put these in order, largest first.'; }
  return buildOrder('lo28', level, raw, direction, prompt,
    'Line up the decimal points and compare place value (closer to zero is larger for negatives).');
}

// An L-shaped (rectilinear hexagon) descriptor: big W×H rectangle with an a×b
// notch removed from the top-right corner. `labels` are the side lengths shown
// on each of the 6 edges (null = the learner must work it out).
function lShape(W, H, a, b, labels) {
  const verts = [[0, 0], [W, 0], [W, H - b], [W - a, H - b], [W - a, H], [0, H]];
  return { kind: 'poly', verts, labels, unit: 'cm' };
}

// LO30 — Area & perimeter of compound shapes
function lo30(level) {
  const range = {
    1: { W: [6, 10], H: [6, 10] },
    2: { W: [7, 11], H: [7, 11] },
    3: { W: [9, 15], H: [8, 14] },
    4: { W: [12, 20], H: [11, 18] },
  }[level];
  const W = randInt(range.W[0], range.W[1]);
  const H = randInt(range.H[0], range.H[1]);
  const a = randInt(2, W - 3);           // notch width  (leaves top ≥ 3)
  const b = randInt(2, H - 3);           // notch height (leaves right side ≥ 3)
  const area = W * H - a * b;
  const perim = 2 * (W + H);

  if (level === 1) {
    const labels = [`${W}`, `${H - b}`, `${a}`, `${b}`, `${W - a}`, `${H}`];
    return { skillId: 'lo30', level, prompt: `Find the area of this shape (cm²)`,
      answerType: 'integer', answer: area, diagram: lShape(W, H, a, b, labels),
      steps: [`Split it into two rectangles.`,
        `Left part: ${W - a} × ${H} = ${(W - a) * H}.  Right part: ${a} × ${H - b} = ${a * (H - b)}.`,
        `Add them: ${(W - a) * H} + ${a * (H - b)} = ${area} cm².`],
      hint: 'Cut it into two rectangles and add the areas.' };
  }
  if (level === 2) {
    const labels = [`${W}`, `${H - b}`, `${a}`, `${b}`, null, null];
    return { skillId: 'lo30', level, prompt: `Find the perimeter of this shape (cm)`,
      answerType: 'integer', answer: perim, diagram: lShape(W, H, a, b, labels),
      steps: [`Two sides aren't labelled — work them out first.`,
        `Top: ${W} − ${a} = ${W - a}.  Left: ${H - b} + ${b} = ${H}.`,
        `Add right round: ${W} + ${H - b} + ${a} + ${b} + ${W - a} + ${H} = ${perim} cm.`],
      hint: 'Opposite sides must match — use that to find the two unlabelled lengths.' };
  }
  if (level === 3) {
    const labels = [`${W}`, `${H - b}`, null, null, `${W - a}`, `${H}`];
    return { skillId: 'lo30', level, prompt: `Find the area of this shape (cm²)`,
      answerType: 'integer', answer: area, diagram: lShape(W, H, a, b, labels),
      steps: [`First find the missing width: ${W} − ${W - a} = ${a}.`,
        `Left rectangle: ${W - a} × ${H} = ${(W - a) * H}.`,
        `Right rectangle: ${a} × ${H - b} = ${a * (H - b)}.`,
        `Area = ${(W - a) * H} + ${a * (H - b)} = ${area} cm².`],
      hint: 'Work out the missing width first, then split into two rectangles.' };
  }
  const labels = [`${W}`, `${H - b}`, `${a}`, `${b}`, null, null];
  return { skillId: 'lo30', level, prompt: `Find the perimeter of this shape (cm)`,
    answerType: 'integer', answer: perim, diagram: lShape(W, H, a, b, labels),
    steps: [`Find the two unlabelled sides.`,
      `Top: ${W} − ${a} = ${W - a}.  Left: ${H - b} + ${b} = ${H}.`,
      `Total perimeter: ${W} + ${H - b} + ${a} + ${b} + ${W - a} + ${H} = ${perim} cm.`],
    hint: 'Find the two missing lengths, then add every side.' };
}

export const GENERATORS = {
  lo1, lo2, lo3, lo4, lo5, lo6, lo7, lo8, lo9, lo10, lo11, lo12, lo13, lo14,
  lo15, lo16, lo16b, lo17, lo18, lo19, lo20, lo21, lo22, lo23, lo24, lo25,
  lo26, lo27, lo28, lo29, lo30,
};

export function generate(skillId, level) {
  const lvl = Math.max(1, Math.min(4, level || 1));
  return GENERATORS[skillId](lvl);
}
