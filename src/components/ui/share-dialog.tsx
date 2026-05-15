'use client';

import { Dialog } from '@base-ui-components/react/dialog';
import { useState } from 'react';
import { type Lang, translations } from '@/lib/i18n';
import { buildShareUrl } from '@/lib/share-url';

type Props = {
  shareId: string | null;
  lang: Lang;
};

export function ShareDialog({ shareId, lang }: Props) {
  const [copied, setCopied] = useState(false);
  const t = translations[lang].share;

  const shareUrl = shareId ? buildShareUrl(shareId) : '';

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        // Clipboard unavailable (non-HTTPS or permission denied) — no-op
      },
    );
  }

  if (!shareId) return null;

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="border border-terminal-border text-terminal-green-muted
                   px-4 py-2.5 text-xs tracking-widest font-mono
                   hover:border-terminal-green hover:text-terminal-green
                   transition-colors"
      >
        {t.trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/80 z-40" />
        <Dialog.Popup
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                                  bg-terminal-bg border border-terminal-border
                                  p-6 w-full max-w-md font-mono space-y-4"
        >
          <Dialog.Title className="text-terminal-green text-xs tracking-widest">
            {t.title}
          </Dialog.Title>
          <p className="text-terminal-green-dim text-xs break-all">{shareUrl}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="border border-terminal-border text-terminal-green-muted
                         px-4 py-2 text-xs tracking-widest
                         hover:border-terminal-green hover:text-terminal-green
                         transition-colors"
            >
              {copied ? t.linkCopied : t.copyLink}
            </button>
            <Dialog.Close
              className="border border-[#1a1a1a] text-[#333] px-4 py-2 text-xs tracking-widest
                          hover:border-terminal-green-dark hover:text-terminal-green-dark
                          transition-colors"
            >
              {t.close}
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
