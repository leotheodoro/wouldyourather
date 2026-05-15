'use client';

import { type Lang, translations } from '@/lib/i18n';
import type { ArchetypeProfile } from '@/types';
import { ArchetypeCard } from './archetype-card';
import { TypewriterText } from './typewriter-text';

type Props = {
  profile: ArchetypeProfile | null;
  shareId: string | null;
  streamedText?: string;
  streaming?: boolean;
  onRestart?: () => void;
  readOnly?: boolean;
  lang: Lang;
};

export function ResultScreen({
  profile,
  shareId,
  streamedText = '',
  streaming = false,
  onRestart,
  readOnly = false,
  lang,
}: Props) {
  const t = translations[lang].result;

  if (streaming) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full font-mono space-y-4">
          <p className="text-terminal-green-dark text-xs tracking-widest">{t.processing}</p>
          {!streamedText ? (
            <div className="h-px bg-[#111] overflow-hidden">
              <div
                className="h-full bg-terminal-green w-1/4"
                style={{ animation: 'progress-slide 1.5s linear infinite' }}
              />
            </div>
          ) : (
            <TypewriterText
              text={streamedText}
              isStreaming={streaming}
              className="text-terminal-green text-sm leading-loose"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-6 py-12">
      <div className="max-w-lg w-full space-y-6">
        {profile && (
          <ArchetypeCard profile={profile} shareId={shareId} readOnly={readOnly} lang={lang} />
        )}
        {!readOnly && onRestart && (
          <button
            type="button"
            onClick={onRestart}
            className="w-full border border-[#1a1a1a] text-[#333] px-4 py-2.5
                       text-xs tracking-widest font-mono
                       hover:border-terminal-green-dark hover:text-terminal-green-dark
                       transition-colors"
          >
            {t.newProtocol}
          </button>
        )}
      </div>
    </div>
  );
}
