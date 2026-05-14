'use client';

import { Progress } from '@base-ui-components/react/progress';

type Props = {
  value: number;
  isCruelty?: boolean;
};

export function ProgressBar({ value, isCruelty = false }: Props) {
  return (
    <Progress.Root value={value} className="flex-1">
      <Progress.Track className="h-2 bg-[#111] border border-terminal-border">
        <Progress.Indicator
          className={
            isCruelty
              ? 'h-full bg-red-500 transition-all duration-1000'
              : 'h-full bg-terminal-green transition-all duration-1000'
          }
          style={{ width: `${value}%` }}
        />
      </Progress.Track>
    </Progress.Root>
  );
}
