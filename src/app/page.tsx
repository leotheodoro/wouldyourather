'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { GameSession } from '@/components/game/game-session';
import { ResultScreen } from '@/components/game/result-screen';
import type { Lang } from '@/lib/i18n';
import { api } from '@/trpc/react';

function GameRoot() {
  const searchParams = useSearchParams();
  const shareId = searchParams.get('result');

  const profileQuery = api.share.getProfile.useQuery({ id: shareId! }, { enabled: !!shareId });

  if (shareId) {
    if (profileQuery.isPending) {
      return (
        <div className="min-h-screen flex items-center justify-center font-mono text-terminal-green text-xs tracking-widest">
          LOADING... / CARREGANDO...
        </div>
      );
    }
    if (profileQuery.error || !profileQuery.data) {
      return (
        <div className="min-h-screen flex items-center justify-center font-mono text-red-500 text-xs">
          Profile not found. / Perfil não encontrado.
        </div>
      );
    }
    const lang = (profileQuery.data.language ?? 'pt') as Lang;
    return (
      <ResultScreen profile={profileQuery.data.profile} shareId={shareId} lang={lang} readOnly />
    );
  }

  return <GameSession />;
}

export default function Page() {
  return (
    <Suspense>
      <GameRoot />
    </Suspense>
  );
}
