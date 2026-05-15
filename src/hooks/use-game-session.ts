'use client';

import { useCallback, useRef, useState } from 'react';
import type { Lang } from '@/lib/i18n';
import { api } from '@/trpc/react';
import type { ArchetypeProfile, DilemmaResponse, GameState, HistoryItem } from '@/types';
import { useSSEStream } from './use-sse-stream';

const TOTAL_DILEMMAS = 7;

function initialState(): GameState {
  return {
    phase: 'intro',
    dilemmaIndex: 0,
    history: [],
    currentDilemma: null,
    profile: null,
    error: null,
    language: 'pt',
  };
}

export function useGameSession() {
  const [state, setState] = useState<GameState>(initialState);
  const [streamedText, setStreamedText] = useState('');
  const [shareId, setShareId] = useState<string | null>(null);
  const { stream, streaming, error: streamError } = useSSEStream();
  const saveProfileMutation = api.share.saveProfile.useMutation();

  const stateRef = useRef(state);
  stateRef.current = state;
  const langRef = useRef<Lang>('pt');

  const addToken = useCallback((token: string) => {
    setStreamedText((t) => t + token);
  }, []);

  const loadDilemma = useCallback(
    (history: HistoryItem[]) => {
      setState((s) => ({ ...s, phase: 'streaming', currentDilemma: null, error: null }));
      setStreamedText('');

      stream('/api/dilemma', { history, language: langRef.current }, addToken, (payload) => {
        const data = (payload as { dilemmaResponse: DilemmaResponse }).dilemmaResponse;
        if (!data) return;

        setState((s) => {
          const updatedHistory =
            history.length > 0
              ? history.map((item, i) =>
                  i === history.length - 1 ? { ...item, consequence: data.consequence } : item,
                )
              : history;

          return {
            ...s,
            phase: 'dilemma',
            currentDilemma: { text: data.dilemma, choices: data.choices },
            history: updatedHistory,
          };
        });
      });
    },
    [stream, addToken],
  );

  const loadProfile = useCallback(
    (history: HistoryItem[]) => {
      setState((s) => ({ ...s, phase: 'streaming', error: null }));
      setStreamedText('');

      stream('/api/profile', { history, language: langRef.current }, addToken, async (payload) => {
        const profile = (payload as { profile: ArchetypeProfile }).profile;
        if (!profile) return;
        setState((s) => ({ ...s, phase: 'result', profile }));
        try {
          const { id } = await saveProfileMutation.mutateAsync({
            profile,
            history,
            language: langRef.current,
          });
          setShareId(id);
        } catch {
          // Share saving failure is non-fatal — game still shows result
        }
      });
    },
    [stream, addToken, saveProfileMutation],
  );

  const startGame = useCallback(
    (lang: Lang) => {
      langRef.current = lang;
      setState({ ...initialState(), language: lang });
      setStreamedText('');
      setShareId(null);
      loadDilemma([]);
    },
    [loadDilemma],
  );

  const choose = useCallback(
    (choiceIndex: 0 | 1) => {
      const s = stateRef.current;
      if (!s.currentDilemma || s.phase !== 'dilemma') return;

      const newItem: HistoryItem = {
        dilemma: s.currentDilemma.text,
        choices: s.currentDilemma.choices,
        chosen: choiceIndex,
        consequence: '',
      };
      const newHistory = [...s.history, newItem];
      const newIndex = s.dilemmaIndex + 1;

      setState((prev) => ({
        ...prev,
        history: newHistory,
        dilemmaIndex: newIndex,
        currentDilemma: null,
      }));

      if (newIndex >= TOTAL_DILEMMAS) {
        loadProfile(newHistory);
      } else {
        loadDilemma(newHistory);
      }
    },
    [loadDilemma, loadProfile],
  );

  const restart = useCallback(() => {
    setState(initialState());
    setStreamedText('');
    setShareId(null);
  }, []);

  return {
    state,
    streamedText,
    streaming,
    shareId,
    lang: state.language,
    error: streamError,
    startGame,
    choose,
    restart,
  };
}
