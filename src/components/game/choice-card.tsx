'use client';

type Props = {
  label: 'A' | 'B';
  text: string;
  onClick: () => void;
  disabled?: boolean;
};

export function ChoiceCard({ label, text, onClick, disabled = false }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left border border-terminal-border text-terminal-green-muted
                 px-4 py-3 text-sm font-mono
                 hover:border-terminal-green hover:text-terminal-green
                 transition-colors duration-150
                 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <span className="text-terminal-green-dark">[{label}]</span> {text}
    </button>
  );
}
