interface AvatarProps {
  name: string;
  photoUrl?: string | null;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Avatar({ name, photoUrl, className = "h-12 w-12" }: AvatarProps) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        loading="lazy"
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={name}
      className={`flex items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 ${className}`}
    >
      {initials(name)}
    </div>
  );
}
