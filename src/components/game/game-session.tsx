'use client';

import { useGameSession } from '@/hooks/use-game-session';
import { DilemmaScreen } from './dilemma-screen';
import { IntroScreen } from './intro-screen';
import { ResultScreen } from './result-screen';

export function GameSession() {
  const { state, streamedText, streaming, shareId, error, startGame, choose, restart } =
    useGameSession();

  if (state.phase === 'intro') {
    return <IntroScreen onStart={startGame} />;
  }

  if (state.phase === 'result' || state.dilemmaIndex >= 7) {
    return (
      <ResultScreen
        profile={state.profile}
        shareId={shareId}
        streamedText={streamedText}
        streaming={streaming}
        onRestart={restart}
      />
    );
  }

  return (
    <DilemmaScreen
      state={state}
      streamedText={streamedText}
      streaming={streaming}
      error={error}
      onChoose={choose}
      onRetry={startGame}
    />
  );
}
