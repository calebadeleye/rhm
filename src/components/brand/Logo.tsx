interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
}

/**
 * SVG recreation of the RHM wordmark, matching the approved brand mockup.
 * Swap the markup here for the official logo asset if/when one is supplied
 * — every consumer imports this single component.
 */
export function Logo({ className = "", variant = "full" }: LogoProps) {
  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 64 64"
        className={className}
        role="img"
        aria-label="Redemption Hour Ministries"
      >
        <text
          x="2"
          y="46"
          fontFamily="Inter, sans-serif"
          fontWeight="800"
          fontSize="44"
          fill="#2c8438"
          letterSpacing="-2"
        >
          R
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 260 60"
      className={className}
      role="img"
      aria-label="RHM Redemption Hour Ministries"
    >
      <text
        x="0"
        y="34"
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        fontSize="34"
        fill="#2c8438"
        letterSpacing="-1"
      >
        RHM
      </text>
      <text
        x="2"
        y="49"
        fontFamily="Inter, sans-serif"
        fontWeight="700"
        fontSize="9"
        fill="#1f2422"
        letterSpacing="1.2"
      >
        REDEMPTION HOUR
      </text>
      <text
        x="2"
        y="59"
        fontFamily="Inter, sans-serif"
        fontWeight="700"
        fontSize="9"
        fill="#1f2422"
        letterSpacing="1.2"
      >
        MINISTRIES
      </text>
    </svg>
  );
}
