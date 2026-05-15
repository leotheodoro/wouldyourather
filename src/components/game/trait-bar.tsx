'use client';

import { ProgressBar } from '@/components/ui/progress-bar';
import { type Lang, translations } from '@/lib/i18n';

type Props = {
  trait: 'empathy' | 'pragmatism' | 'chaos' | 'cruelty';
  value: number;
  lang: Lang;
};

export function TraitBar({ trait, value, lang }: Props) {
  const isCruelty = trait === 'cruelty';
  const label = translations[lang].traits[trait];

  return (
    <div className="flex items-center gap-3 text-xs font-mono">
      <span className="text-terminal-green-muted w-24">{label}</span>
      <ProgressBar value={value} isCruelty={isCruelty} />
      <span className={`w-6 text-right ${isCruelty ? 'text-red-500' : 'text-terminal-green-dark'}`}>
        {value}
      </span>
    </div>
  );
}
