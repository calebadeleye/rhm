import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Heart, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { env } from "@/lib/env";
import type { NavEntry } from "@/components/layout/navItems";

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
  items: NavEntry[];
}

export function NavDrawer({ open, onClose, items }: NavDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-3 py-3 text-base font-semibold ${
      isActive ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-surface-muted"
    }`;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Site navigation">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close navigation menu"
        className="absolute inset-0 bg-ink/40"
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col overflow-y-auto bg-white p-6 shadow-xl">
        <div className="mb-8 flex items-center justify-between">
          <Logo className="h-12 w-auto" />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-ink hover:bg-surface-muted"
            aria-label="Close navigation menu"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Primary">
          {items.map((entry) =>
            "items" in entry ? (
              <div key={entry.label} className="mt-3 first:mt-0">
                <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wide text-ink-faint">
                  {entry.label}
                </p>
                {entry.items.map((item) => (
                  <NavLink key={item.to} to={item.to} onClick={onClose} className={linkClass}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ) : (
              <NavLink key={entry.to} to={entry.to} end={entry.to === "/"} onClick={onClose} className={linkClass}>
                {entry.label}
              </NavLink>
            ),
          )}
        </nav>

        <a
          href={env.donationUrl || "/donate"}
          target={env.donationUrl ? "_blank" : undefined}
          rel={env.donationUrl ? "noreferrer" : undefined}
          className="btn-primary mt-4 w-full"
          onClick={onClose}
        >
          <Heart className="h-4 w-4" aria-hidden="true" /> Donate
        </a>
      </div>
    </div>
  );
}
