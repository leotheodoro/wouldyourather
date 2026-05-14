'use client';

type Props = {
  text: string;
  isStreaming?: boolean;
  className?: string;
};

export function TypewriterText({ text, isStreaming = false, className }: Props) {
  return (
    <span className={className}>
      {text}
      {isStreaming && <span className="inline-block animate-pulse ml-px">█</span>}
    </span>
  );
}
