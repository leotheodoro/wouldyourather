export type Personality = {
  id: string;
  name: string;
  emoji: string;
  traits: { empathy: number; pragmatism: number; chaos: number; cruelty: number };
};

export const PERSONALITIES: Personality[] = [
  {
    id: 'mandela',
    name: 'Nelson Mandela',
    emoji: '✊',
    traits: { empathy: 90, pragmatism: 75, chaos: 20, cruelty: 5 },
  },
  {
    id: 'diddy',
    name: 'P Diddy',
    emoji: '💰',
    traits: { empathy: 8, pragmatism: 75, chaos: 35, cruelty: 90 },
  },
  {
    id: 'teresa',
    name: 'Mother Teresa',
    emoji: '🕊️',
    traits: { empathy: 95, pragmatism: 25, chaos: 10, cruelty: 5 },
  },
  {
    id: 'joker',
    name: 'The Joker',
    emoji: '🃏',
    traits: { empathy: 5, pragmatism: 15, chaos: 95, cruelty: 88 },
  },
  {
    id: 'white',
    name: 'Walter White',
    emoji: '⚗️',
    traits: { empathy: 20, pragmatism: 90, chaos: 30, cruelty: 70 },
  },
  {
    id: 'robin',
    name: 'Robin Hood',
    emoji: '🏹',
    traits: { empathy: 85, pragmatism: 25, chaos: 80, cruelty: 10 },
  },
  {
    id: 'machiavel',
    name: 'Machiavelli',
    emoji: '👑',
    traits: { empathy: 15, pragmatism: 95, chaos: 15, cruelty: 55 },
  },
  {
    id: 'che',
    name: 'Che Guevara',
    emoji: '⭐',
    traits: { empathy: 65, pragmatism: 50, chaos: 75, cruelty: 45 },
  },
];

export function matchPersonality(traits: {
  empathy: number;
  pragmatism: number;
  chaos: number;
  cruelty: number;
}): Personality {
  let best = PERSONALITIES[0]!;
  let bestDist = Infinity;
  for (const p of PERSONALITIES) {
    const dist = Math.sqrt(
      (traits.empathy - p.traits.empathy) ** 2 +
        (traits.pragmatism - p.traits.pragmatism) ** 2 +
        (traits.chaos - p.traits.chaos) ** 2 +
        (traits.cruelty - p.traits.cruelty) ** 2,
    );
    if (dist < bestDist) {
      bestDist = dist;
      best = p;
    }
  }
  return best;
}
