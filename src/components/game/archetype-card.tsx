'use client';

import { ShareDialog } from '@/components/ui/share-dialog';
import { type Lang, translations } from '@/lib/i18n';
import type { Personality } from '@/lib/personalities';
import type { ArchetypeProfile } from '@/types';
import { TraitBar } from './trait-bar';

type Props = {
  profile: ArchetypeProfile;
  shareId: string | null;
  readOnly?: boolean;
  lang: Lang;
  personality: Personality | null;
  isNewUnlock?: boolean;
};

export function ArchetypeCard({
  profile,
  shareId,
  readOnly = false,
  lang,
  personality,
  isNewUnlock = false,
}: Props) {
  const t = translations[lang].result;

  return (
    <div className="space-y-6 font-mono">
      <div>
        <p className="text-terminal-green-dark text-xs tracking-widest mb-2">
          {t.analysisComplete}
        </p>
        {personality && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{personality.emoji}</span>
            <div>
              <h1 className="text-terminal-green text-xl font-bold tracking-widest">
                {personality.name}
              </h1>
              {isNewUnlock && (
                <span className="text-[10px] tracking-widest text-terminal-green-dark border border-terminal-green-dark px-1">
                  NEW
                </span>
              )}
            </div>
          </div>
        )}
        <p className="text-terminal-green-dim text-xs italic leading-relaxed">
          &quot;{profile.quote}&quot;
        </p>
      </div>

      <div className="space-y-3">
        <TraitBar trait="empathy" value={profile.traits.empathy} lang={lang} />
        <TraitBar trait="pragmatism" value={profile.traits.pragmatism} lang={lang} />
        <TraitBar trait="chaos" value={profile.traits.chaos} lang={lang} />
        <TraitBar trait="cruelty" value={profile.traits.cruelty} lang={lang} />
      </div>

      <p className="text-terminal-green-muted text-xs italic leading-relaxed">{profile.verdict}</p>

      {!readOnly && <ShareDialog shareId={shareId} lang={lang} />}
    </div>
  );
}
