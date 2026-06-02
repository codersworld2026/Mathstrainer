// Learning objectives from the Year 7 AP3 Revision Pack.
// All 30 are now live: the original 27 type/tap objectives plus the four added
// in the diagram pass — LO21 (read a line off a graph), LO25/LO28 (order
// fractions/decimals), and LO30 (compound-shape area & perimeter).

export const STRAND = 'AP3 Revision';

export const SKILLS = [
  { id: 'lo1',   name: 'Fraction of an amount' },
  { id: 'lo2',   name: 'Improper fractions & mixed numbers' },
  { id: 'lo3',   name: 'Ratio tables' },
  { id: 'lo4',   name: 'Perimeter with a missing side' },
  { id: 'lo5',   name: 'Compare fractions' },
  { id: 'lo6',   name: 'Prime factorisation' },
  { id: 'lo7',   name: 'HCF and LCM from prime factors' },
  { id: 'lo8',   name: 'Add & subtract fractions (same denominator)' },
  { id: 'lo9',   name: 'Simplify ratios' },
  { id: 'lo10',  name: 'Simplify fractions' },
  { id: 'lo11',  name: 'Fractions of fractions' },
  { id: 'lo12',  name: 'Fractions to part-to-part ratios' },
  { id: 'lo13',  name: 'Multiplicative relationships' },
  { id: 'lo14',  name: 'Expand and simplify' },
  { id: 'lo15',  name: 'Fractions to decimals' },
  { id: 'lo16',  name: 'Ratio recipes' },
  { id: 'lo16b', name: 'Scale factors for recipes' },
  { id: 'lo17',  name: 'Remaining fraction' },
  { id: 'lo18',  name: 'Find the whole from a fraction' },
  { id: 'lo19',  name: 'Algebraic terms and constants' },
  { id: 'lo20',  name: 'Like terms' },
  { id: 'lo21',  name: 'Equation of a line from a graph' },
  { id: 'lo22',  name: 'Midpoint of two coordinates' },
  { id: 'lo23',  name: 'Divide fractions' },
  { id: 'lo24',  name: 'Subtract mixed numbers' },
  { id: 'lo25',  name: 'Order fractions & mixed numbers' },
  { id: 'lo26',  name: 'Sharing in a ratio (partial info)' },
  { id: 'lo27',  name: 'Negative numbers in context' },
  { id: 'lo28',  name: 'Order decimals' },
  { id: 'lo29',  name: 'Compare decimals' },
  { id: 'lo30',  name: 'Area & perimeter of compound shapes' },
  { id: 'pow10', name: 'Multiply & divide by 10, 100, 1000' },
];

export const SKILL_NAME = Object.fromEntries(SKILLS.map((s) => [s.id, s.name]));
