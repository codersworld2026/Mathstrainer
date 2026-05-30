# Maths Trainer — AP3 edition (Phase 1)

Adaptive maths practice built to match your son's **Year 7 AP3 Revision Pack** — same
learning objectives, same Bronze / Silver / Gold / Challenge tiers, same supportive
"modified for inclusion" style (a hint on tap, a full worked solution on every miss).

A mix of the three platforms you asked for:
- **MyMaths** → structured practice, instant marking.
- **Hegarty** → step-by-step worked solution whenever a question is missed.
- **Sparx / Numbrise** → adaptive engine that moves a skill up and down the four tiers
  and keeps bringing weak skills back (spaced repetition).

Every question is **auto-generated** — the numbers randomise each time, so it never runs
out and he can't just memorise answers. Content is original, in the pack's style; it does
not copy the worksheet's actual questions.

## Run it
```bash
npm install
npm run dev
```
Opens at http://localhost:5173. No account, saves to the device. Drop the folder into
Antigravity or Claude Code and run the same two commands.

## How it matches the pack
- **Tiers**: Bronze → Silver → Gold → Challenge (levels 1–4). A skill steps up after 3
  correct in a row and drops back after 2 misses in the last 3 — so he settles at the
  right tier per topic, exactly like the pack's columns.
- **27 of the 30 learning objectives** are live as type-the-answer or tap-the-answer
  questions, with answer formats that fit each one: whole numbers, decimals, fractions,
  mixed numbers, ratios, coordinates, linear expressions (e.g. `__x + __`), prime
  factorisations (type `2^2 x 3^2`), and multiple choice for the compare/justify ones.
- **Validated against the pack's answer key** — the maths primitives (mixed numbers,
  prime factors, HCF/LCM, ratio and fraction simplifying, midpoints, etc.) were checked
  directly against the key on pages 14–15, and ~32,000 generated questions all check out.

### Live LOs
LO1 fraction of an amount · LO2 improper/mixed · LO3 ratio tables · LO4 perimeter missing
side · LO5 compare fractions · LO6 prime factorisation · LO7 HCF/LCM · LO8 add/subtract
same-denominator fractions · LO9 simplify ratios · LO10 simplify fractions · LO11 fraction
of a fraction · LO12 fraction→ratio · LO13 multiplicative relationships · LO14 expand &
simplify · LO15 fraction→decimal · LO16 ratio recipes · LO16b scale multipliers · LO17
remaining fraction · LO18 find the whole · LO19 terms & constants · LO20 like terms · LO22
midpoints · LO23 divide fractions · LO24 subtract mixed numbers · LO26 sharing a ratio ·
LO27 negative numbers in context · LO29 compare decimals.

### Deferred to the next (diagram) pass — and why
- **LO21 equation of a line** — Bronze/Silver read the line off a graph (needs a drawn grid).
- **LO25 order fractions/mixed** and **LO28 order decimals** — need a drag-to-order input.
- **LO30 area & perimeter of compound shapes** — needs generated L-shape/notch diagrams.

These four are the natural content of the next pass (I can generate SVG grids and shapes).

## Where things live
```
src/engine/
  math.js        helpers: gcd/lcm, fractions, mixed numbers, ratios, prime factors
  generators.js  one generator per LO, four tiers each  ← add LO21/25/28/30 here
  skills.js      the LO catalogue
  adaptive.js    tiers, skill selection, spacing, answer checking (all answer types)
  storage.js     save/load  ← Phase 2 Firebase swap points marked here
src/components/   Setup, Home, Round, Summary, Progress, Keypad
src/App.jsx       screen + tab orchestration
```

## Phase 2 — cloud login + parent dashboard (Firebase)
Data shape doesn't change, so it's a bolt-on. Create a Firebase project (Auth: Email +
Google, plus Firestore), `npm install firebase`, add your config, and replace the two
`>>> PHASE 2 <<<` lines in `storage.js` (load → getDoc, save → setDoc). The parent PIN
gate on the Progress page stays; progress then syncs across your Manchester/Qatar devices.
> I'll build the login UI, but you create the Firebase project and enter the keys — I don't
> set up accounts or handle credentials.

---
Get him to do a handful of rounds, then tell me what's clunky and which tier each topic
should really start at.
