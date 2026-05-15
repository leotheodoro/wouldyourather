"use client";

import { useCallback, useState } from "react";

type SSEPayload = Record<string, unknown>;

type UseSSEStream = {
  streaming: boolean;
  error: string | null;
  stream: (
    url: string,
    body: unknown,
    onToken: (token: string) => void,
    onDone: (payload: SSEPayload) => void | Promise<void>,
  ) => Promise<void>;
};

export function useSSEStream(): UseSSEStream {
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stream = useCallback(
    async (
      url: string,
      body: unknown,
      onToken: (token: string) => void,
      onDone: (payload: SSEPayload) => void | Promise<void>,
    ) => {
      setStreaming(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let receivedDone = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (!data) continue;

            try {
              const parsed = JSON.parse(data) as SSEPayload;
              if (parsed.done === true) {
                receivedDone = true;
                setStreaming(false);
                if (parsed.error) {
                  setError("MNEMOSYNE não respondeu");
                } else {
                  await onDone(parsed);
                }
                return;
              }
              if (typeof parsed.token === "string") {
                onToken(parsed.token);
              }
            } catch {
              // skip malformed chunk
            }
          }
        }

        if (!receivedDone) {
          setError("MNEMOSYNE não respondeu");
          setStreaming(false);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(message);
        setStreaming(false);
      }
    },
    [],
  );

  return { streaming, error, stream };
}
