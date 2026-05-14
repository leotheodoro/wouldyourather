'use client';

import { ProgressBar } from '@/components/ui/progress-bar';

const TRAIT_LABELS: Record<string, string> = {
  empathy: 'Empatia',
  pragmatism: 'Pragmatismo',
  chaos: 'Caos',
  cruelty: 'Crueldade',
};

type Props = {
  trait: 'empathy' | 'pragmatism' | 'chaos' | 'cruelty';
  value: number;
};

export function TraitBar({ trait, value }: Props) {
  const isCruelty = trait === 'cruelty';

  return (
    <div className="flex items-center gap-3 text-xs font-mono">
      <span className="text-terminal-green-muted w-24">{TRAIT_LABELS[trait]}</span>
      <ProgressBar value={value} isCruelty={isCruelty} />
      <span className={`w-6 text-right ${isCruelty ? 'text-red-500' : 'text-terminal-green-dark'}`}>
        {value}
      </span>
    </div>
  );
}
