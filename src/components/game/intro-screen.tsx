'use client';

import { useState } from 'react';
import { type Lang, translations } from '@/lib/i18n';

type Props = {
  onStart: (lang: Lang) => void;
};

export function IntroScreen({ onStart }: Props) {
  const [lang, setLang] = useState<Lang>('pt');
  const t = translations[lang].intro;

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full space-y-8 font-mono">
        <div>
          <p className="text-terminal-green-dark text-xs tracking-widest mb-6">{t.protocol}</p>
          <h1 className="text-terminal-green text-2xl font-bold tracking-widest mb-6">
            WOULD YOU RATHER
          </h1>
          <div className="text-terminal-green-dim text-sm leading-loose space-y-1">
            <p>{t.welcome}</p>
            <p>
              {t.scenarios} <span className="text-terminal-green">{t.scenariosHighlight}</span>.
            </p>
            <p>{t.analyzed}</p>
          </div>
          <p className="text-[#444] text-sm mt-3">{t.noRightAnswer}</p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setLang('pt')}
            className={
              lang === 'pt'
                ? 'border border-terminal-green text-terminal-green px-3 py-1 text-xs tracking-widest font-mono'
                : 'border border-terminal-border text-terminal-green-muted px-3 py-1 text-xs tracking-widest font-mono hover:border-terminal-green hover:text-terminal-green transition-colors'
            }
          >
            PT
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={
              lang === 'en'
                ? 'border border-terminal-green text-terminal-green px-3 py-1 text-xs tracking-widest font-mono'
                : 'border border-terminal-border text-terminal-green-muted px-3 py-1 text-xs tracking-widest font-mono hover:border-terminal-green hover:text-terminal-green transition-colors'
            }
          >
            EN
          </button>
        </div>

        <button
          type="button"
          onClick={() => onStart(lang)}
          className="border border-terminal-green text-terminal-green
                     px-6 py-2.5 text-xs tracking-widest font-mono
                     hover:bg-terminal-green hover:text-terminal-bg
                     transition-colors duration-150"
        >
          {t.startButton}
        </button>
      </div>
    </div>
  );
}
