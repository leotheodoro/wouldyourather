'use client';

import { ShareDialog } from '@/components/ui/share-dialog';
import type { ArchetypeProfile } from '@/types';
import { TraitBar } from './trait-bar';

type Props = {
  profile: ArchetypeProfile;
  shareId: string | null;
  readOnly?: boolean;
};

export function ArchetypeCard({ profile, shareId, readOnly = false }: Props) {
  return (
    <div className="space-y-6 font-mono">
      <div>
        <p className="text-terminal-green-dark text-xs tracking-widest mb-2">
          {'ANÁLISE CONCLUÍDA // PERFIL GERADO'}
        </p>
        <h1 className="text-terminal-green text-xl font-bold tracking-widest mb-3">
          {profile.archetypeName}
        </h1>
        <p className="text-terminal-green-dim text-xs italic leading-relaxed">
          &quot;{profile.quote}&quot;
        </p>
      </div>

      <div className="space-y-3">
        <TraitBar trait="empathy" value={profile.traits.empathy} />
        <TraitBar trait="pragmatism" value={profile.traits.pragmatism} />
        <TraitBar trait="chaos" value={profile.traits.chaos} />
        <TraitBar trait="cruelty" value={profile.traits.cruelty} />
      </div>

      <div className="border-t border-[#111] pt-4 text-xs leading-relaxed">
        <p className="text-terminal-green-muted">
          Similar a:{' '}
          <span className="text-terminal-green-dim">{profile.historicalFigure.name}</span>
        </p>
        <p className="text-terminal-green-muted mt-1">{profile.historicalFigure.reason}</p>
      </div>

      <p className="text-terminal-green-muted text-xs italic leading-relaxed">{profile.verdict}</p>

      {!readOnly && <ShareDialog shareId={shareId} />}
    </div>
  );
}
