// Twelfth Night characters for the English Trainer. KS3-friendly. Kept separate
// from maths data. `relatedExtractId` links a character into the PEEL practice
// page (null = open PEEL with the default extract).

const twelfthNightCharacters = [
  {
    name: 'Viola',
    emoji: '🌊',
    description: 'Viola is shipwrecked in Illyria and disguises herself as a boy called Cesario. She is clever, loyal and brave.',
    traits: ['Brave', 'Intelligent', 'Loyal', 'Confused about identity'],
    role: 'The heroine of the play. Her disguise drives much of the comedy and confusion.',
    quotes: ['I am not what I am', 'Disguise, I see, thou art a wickedness'],
    peelStarter: 'Shakespeare presents Viola as clever and brave because…',
    relatedExtractId: 1,
  },
  {
    name: 'Malvolio',
    emoji: '🎩',
    description: "Olivia's strict steward. He dreams of rising above his place and is tricked by a forged letter.",
    traits: ['Proud', 'Ambitious', 'Serious', 'Easily fooled'],
    role: 'The target of a famous prank. His ambition makes him an easy victim.',
    quotes: ["Some are born great, some achieve greatness, and some have greatness thrust upon 'em", "this is my lady's hand"],
    peelStarter: "Shakespeare presents Malvolio as ambitious and proud because…",
    relatedExtractId: 2,
  },
  {
    name: 'Orsino',
    emoji: '🎶',
    description: 'The Duke of Illyria. He is in love with the idea of being in love and listens to music to feed his feelings.',
    traits: ['Romantic', 'Dramatic', 'Moody', 'Self-absorbed'],
    role: "Pines for Olivia at the start, but ends up falling for Viola.",
    quotes: ['If music be the food of love, play on', 'one habit, and two persons'],
    peelStarter: 'Shakespeare presents Orsino as dramatic and romantic because…',
    relatedExtractId: 3,
  },
  {
    name: 'Olivia',
    emoji: '🖤',
    description: 'A wealthy countess in mourning for her brother. She surprises herself by falling for Cesario (Viola in disguise).',
    traits: ['Grieving', 'Strong-willed', 'Passionate', 'Quick to love'],
    role: 'Refuses Orsino, then falls for a disguised Viola — fuelling the confusion.',
    quotes: ['an invisible and subtle stealth', 'creep in at mine eyes'],
    peelStarter: "Shakespeare presents Olivia's emotions as powerful and sudden because…",
    relatedExtractId: 8,
  },
  {
    name: 'Sir Toby Belch',
    emoji: '🍷',
    description: "Olivia's loud, fun-loving uncle who enjoys drinking and playing tricks on others.",
    traits: ['Mischievous', 'Loud', 'Fun-loving', 'Reckless'],
    role: 'A leader of the comic plots, including the trick on Malvolio.',
    quotes: ['Dost thou think, because thou art virtuous, there shall be no more cakes and ale?'],
    peelStarter: 'Shakespeare presents Sir Toby as mischievous and fun-loving because…',
    relatedExtractId: null,
  },
  {
    name: 'Sir Andrew Aguecheek',
    emoji: '🗡️',
    description: "Sir Toby's foolish friend who hopes to marry Olivia. He is often laughed at by the others.",
    traits: ['Foolish', 'Cowardly', 'Hopeful', 'Easily led'],
    role: 'A comic figure used by Sir Toby for money and entertainment.',
    quotes: ['I was adored once too'],
    peelStarter: 'Shakespeare presents Sir Andrew as foolish and gentle because…',
    relatedExtractId: null,
  },
  {
    name: 'Feste',
    emoji: '🃏',
    description: "Olivia's clever clown. He jokes and sings, but his words often carry real wisdom.",
    traits: ['Witty', 'Clever', 'Musical', 'Wise'],
    role: 'The fool who sees the truth and comments on the other characters.',
    quotes: ['Better a witty fool than a foolish wit'],
    peelStarter: 'Shakespeare presents Feste as wise and witty because…',
    relatedExtractId: 10,
  },
];

export default twelfthNightCharacters;
