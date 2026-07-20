import { useState } from "react";
import { Check, Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  url: string;
  text?: string;
  className?: string;
}

export function ShareButton({ title, url, text, className = "" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // user cancelled or share failed; fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; silently no-op
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-surface-muted ${className}`}
      aria-label={`Share ${title}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" /> Copied
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5" aria-hidden="true" /> Share
        </>
      )}
    </button>
  );
}
