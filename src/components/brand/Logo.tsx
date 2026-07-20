interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
}

/**
 * Official RHM logo asset (public/logo.png). The "mark" variant uses the
 * same file — it's a compact stacked lockup already, so no separate
 * icon-only crop is needed; callers just size it smaller via className.
 */
export function Logo({ className = "", variant = "full" }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="Redemption Hour Ministries"
      className={`w-auto object-contain ${variant === "mark" ? "aspect-square" : ""} ${className}`}
    />
  );
}
