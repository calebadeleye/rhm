import { Music, Radio, Mic, HandHeart, BookOpen, MessageCircle, Moon, Sparkles } from "lucide-react";

const CATEGORY_ICON: Record<string, typeof Music> = {
  teaching: BookOpen,
  worship: Music,
  talk: Mic,
  prayer: HandHeart,
  testimony: MessageCircle,
  overnight: Moon,
  sermon: BookOpen,
  "worship-devotional": Music,
  special: Sparkles,
};

const CATEGORY_GRADIENT: Record<string, string> = {
  teaching: "from-brand-700 to-brand-500",
  worship: "from-emerald-700 to-brand-400",
  talk: "from-brand-800 to-brand-600",
  prayer: "from-brand-600 to-emerald-400",
  testimony: "from-brand-700 to-emerald-500",
  overnight: "from-ink to-brand-800",
  sermon: "from-brand-700 to-brand-500",
  "worship-devotional": "from-brand-600 to-brand-400",
  special: "from-pink-600 to-brand-500",
};

interface CoverArtProps {
  src?: string | null;
  alt: string;
  /** Any category key — recognised ones get a matching icon/gradient,
   * anything else falls back to a generic radio icon and brand gradient. */
  category: string;
  className?: string;
}

/** Renders real artwork when available; otherwise a branded gradient with a
 * category icon, so missing artwork never shows a broken image. */
export function CoverArt({ src, alt, category, className = "" }: CoverArtProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`object-cover ${className}`}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    );
  }

  const Icon = CATEGORY_ICON[category] ?? Radio;
  const gradient = CATEGORY_GRADIENT[category] ?? "from-brand-700 to-brand-500";

  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
    >
      <Icon className="h-1/3 w-1/3 text-white/90" strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
}
