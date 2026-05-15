'use client';

import type { GameState } from '@/types';
import { ChoiceCard } from './choice-card';
import { TypewriterText } from './typewriter-text';

type Props = {
  state: GameState;
  streamedText: string;
  streaming: boolean;
  error: string | null;
  onChoose: (index: 0 | 1) => void;
  onRetry: () => void;
};

function complexityBar(index: number): string {
  const filled = Math.ceil(((index + 1) / 7) * 6);
  return '█'.repeat(filled) + '░'.repeat(6 - filled);
}

function StreamingContent({ text }: { text: string }) {
  if (!text.startsWith('> ')) {
    return (
      <div className="text-terminal-green text-sm leading-loose">
        <TypewriterText text={text} isStreaming />
      </div>
    );
  }
  const splitIdx = text.indexOf('\n\n');
  if (splitIdx === -1) {
    return (
      <div className="border-l-2 border-[#1a4a1a] pl-3 text-terminal-green-muted text-xs leading-relaxed italic">
        <TypewriterText text={text} isStreaming />
      </div>
    );
  }
  return (
    <>
      <div className="border-l-2 border-[#1a4a1a] pl-3 text-terminal-green-muted text-xs leading-relaxed italic">
        {text.slice(0, splitIdx)}
      </div>
      <div className="text-terminal-green text-sm leading-loose">
        <TypewriterText text={text.slice(splitIdx + 2)} isStreaming />
      </div>
    </>
  );
}

export function DilemmaScreen({ state, streamedText, streaming, error, onChoose, onRetry }: Props) {
  const lastItem = state.history[state.history.length - 1] ?? null;

  if (streaming && state.dilemmaIndex === 0 && !streamedText) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full font-mono space-y-4">
          <p className="text-terminal-green-dark text-xs tracking-widest">
            INICIALIZANDO PROTOCOLO MNEMOSYNE...
          </p>
          <div className="h-px bg-[#111] overflow-hidden">
            <div
              className="h-full bg-terminal-green w-1/4"
              style={{ animation: 'progress-slide 1.5s linear infinite' }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full space-y-4 font-mono">
          <p className="text-red-500 text-sm">&gt; ERRO: MNEMOSYNE não respondeu.</p>
          <button
            type="button"
            onClick={onRetry}
            className="border border-red-800 text-red-500 px-4 py-2 text-xs
                       tracking-widest hover:border-red-500 transition-colors"
          >
            [TENTAR NOVAMENTE]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full space-y-6 font-mono">
        <div className="flex justify-between text-xs text-terminal-green-dark">
          <span>DILEMA #{state.dilemmaIndex + 1} / 7</span>
          <span>COMPLEXIDADE: {complexityBar(state.dilemmaIndex)}</span>
        </div>

        {streaming && <StreamingContent text={streamedText} />}

        {!streaming && state.phase === 'dilemma' && state.currentDilemma && (
          <>
            {lastItem?.consequence && (
              <div className="border-l-2 border-[#1a4a1a] pl-3 text-terminal-green-muted text-xs leading-relaxed italic">
                &gt; {lastItem.consequence}
              </div>
            )}
            <p className="text-terminal-green text-sm leading-loose">{state.currentDilemma.text}</p>
            <div className="space-y-3">
              <ChoiceCard
                label="A"
                text={state.currentDilemma.choices[0]}
                onClick={() => onChoose(0)}
              />
              <ChoiceCard
                label="B"
                text={state.currentDilemma.choices[1]}
                onClick={() => onChoose(1)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
