// Learning objectives from the Year 7 AP3 Revision Pack that work as
// type-the-answer / tap-the-answer questions. The four that need diagrams or
// drag-to-order (LO21 lines from a graph, LO25/LO28 ordering, LO30 compound
// shapes) are deferred to the diagram pass — see README.

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
  { id: 'lo22',  name: 'Midpoint of two coordinates' },
  { id: 'lo23',  name: 'Divide fractions' },
  { id: 'lo24',  name: 'Subtract mixed numbers' },
  { id: 'lo26',  name: 'Sharing in a ratio (partial info)' },
  { id: 'lo27',  name: 'Negative numbers in context' },
  { id: 'lo29',  name: 'Compare decimals' },
];

export const SKILL_NAME = Object.fromEntries(SKILLS.map((s) => [s.id, s.name]));
