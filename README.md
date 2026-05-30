# Maths Trainer — AP3 edition (Phase 1 + diagram pass)

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
- **Tiers**: Bronze → Silver → Gold → Challenge → **Challenge+** (levels 1–5). The first
  four mirror the pack's columns; Challenge+ is a stretch tier (same question types, larger
  / nastier numbers) for when he maxes a topic out. A skill steps up after 3 correct in a
  row and drops back after 2 misses in the last 3 — so he settles at the right tier per topic.
- **All 30 learning objectives** are live, with answer formats that fit each one: whole
  numbers, decimals, fractions, mixed numbers, ratios, coordinates, linear expressions
  (e.g. `__x + __`), prime factorisations (type `2^2 x 3^2`), multiple choice for the
  compare/justify ones, **reorder lists** for ordering, and **drawn diagrams** (a
  coordinate grid for reading a line, an L-shape for compound area/perimeter).
- **Validated against the pack's answer key** — the maths primitives (mixed numbers,
  prime factors, HCF/LCM, ratio and fraction simplifying, midpoints, etc.) were checked
  directly against the key on pages 14–15. Every generator is also re-checked against its
  own answer key across all five tiers (~186k generated questions) on each change.

### Practice modes (Home screen)
- **Start round** — the default adaptive mix (weak + untried + spaced repetition).
- **Weak spots** — a round built only from his lowest-mastery topics (off until he's
  attempted a few).
- **Quickfire** — 8 questions with a 25-second timer each; running out counts as a miss.
- **Pick a topic** — a whole round on one objective at its current tier (good for homework
  that's stuck on one thing).

### Live LOs (all 30)
LO1 fraction of an amount · LO2 improper/mixed · LO3 ratio tables · LO4 perimeter missing
side · LO5 compare fractions · LO6 prime factorisation · LO7 HCF/LCM · LO8 add/subtract
same-denominator fractions · LO9 simplify ratios · LO10 simplify fractions · LO11 fraction
of a fraction · LO12 fraction→ratio · LO13 multiplicative relationships · LO14 expand &
simplify · LO15 fraction→decimal · LO16 ratio recipes · LO16b scale multipliers · LO17
remaining fraction · LO18 find the whole · LO19 terms & constants · LO20 like terms · **LO21
equation of a line from a graph** · LO22 midpoints · LO23 divide fractions · LO24 subtract
mixed numbers · **LO25 order fractions/mixed** · LO26 sharing a ratio · LO27 negative
numbers in context · **LO28 order decimals** · LO29 compare decimals · **LO30 area &
perimeter of compound shapes**.

### The diagram pass (LO21 · LO25 · LO28 · LO30) — how it works
- **LO21 equation of a line** — generated SVG coordinate grid. Bronze reads the
  y-intercept, Silver the gradient, Gold writes `y = mx + c`, Challenge finds the equation
  from two marked points.
- **LO25 / LO28 ordering** — a reorder list (tap ▲/▼ to arrange smallest- or largest-first).
  Touch-friendly, no drag library. Decimals include the classic `0.5` vs `0.45` trap and
  negatives at the higher tiers; LO25 mixes fractions and mixed numbers.
- **LO30 compound shapes** — generated L-shapes (a rectangle with a corner notch). Area
  tiers split into two rectangles; perimeter tiers leave two sides unlabelled so he has to
  work them out before adding. Diagrams are pure-data descriptors rendered by `Diagram.jsx`.

## Where things live
```
src/engine/
  math.js        helpers: gcd/lcm, fractions, mixed numbers, ratios, primes, shuffle
  generators.js  one generator per LO, four tiers each (incl. diagram/order descriptors)
  skills.js      the LO catalogue (all 30)
  adaptive.js    tiers, skill selection + round modes, spacing, answer checking, migration
  storage.js     save/load  ← Phase 2 Firebase swap points marked here
src/components/   Setup, Home, Round, Summary, Progress, Keypad
  Diagram.jsx     SVG renderer for line graphs (LO21) and compound shapes (LO30)
  OrderList.jsx   reorder input for the ordering LOs (LO25, LO28)
  TopicPicker.jsx topic-drill list for the "Pick a topic" mode
src/App.jsx       screen + tab orchestration (home / topics / round / summary)
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
