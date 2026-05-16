'use client';

import { type Lang, translations } from '@/lib/i18n';
import { PERSONALITIES } from '@/lib/personalities';

type Props = { unlockedIds: string[]; lang: Lang };

export function CollectionGrid({ unlockedIds, lang }: Props) {
  const t = translations[lang].result;
  const progress = `${unlockedIds.length} / ${PERSONALITIES.length}`;

  return (
    <div className="space-y-3 font-mono">
      <div className="flex justify-between text-xs text-terminal-green-dark tracking-widest">
        <span>{t.collection}</span>
        <span>{progress}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {PERSONALITIES.map((p) => {
          const unlocked = unlockedIds.includes(p.id);
          return (
            <div
              key={p.id}
              className={`border p-2 text-center text-xs ${
                unlocked
                  ? 'border-terminal-border text-terminal-green'
                  : 'border-[#111] text-[#333]'
              }`}
            >
              <div className="text-lg">{unlocked ? p.emoji : '🔒'}</div>
              <div className="text-xs mt-1 tracking-wider truncate">
                {unlocked ? p.name : '???'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
