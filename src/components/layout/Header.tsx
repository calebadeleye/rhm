import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, Heart, Menu } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { NavDrawer } from "@/components/layout/NavDrawer";
import { env } from "@/lib/env";
import type { NavGroup } from "@/components/layout/navItems";
import { NAV_ITEMS } from "@/components/layout/navItems";

function NavDropdown({ label, items }: NavGroup) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-ink-soft transition-colors hover:text-brand-700"
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-40 mt-3 w-48 -translate-x-1/2 rounded-xl border border-ink/10 bg-white p-2 shadow-lg">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-semibold normal-case tracking-normal ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-surface-muted"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <a href="#main-content" className="sr-only-focusable fixed left-4 top-4 z-[60] rounded-full bg-brand-600 px-4 py-2 text-white">
        Skip to content
      </a>
      <header
        className={`sticky top-0 z-30 border-b bg-white/95 backdrop-blur transition-all supports-[backdrop-filter]:bg-white/80 ${
          scrolled ? "border-ink/10 shadow-sm" : "border-transparent"
        }`}
      >
        <div className={`container-page flex items-center justify-between transition-all ${scrolled ? "py-2.5" : "py-4"}`}>
          <NavLink to="/" className="flex items-center gap-2" aria-label="Redemption Hour Ministries home">
            <Logo className={`w-auto transition-all ${scrolled ? "h-12" : "h-14"}`} />
          </NavLink>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map((entry) =>
              "items" in entry ? (
                <NavDropdown key={entry.label} label={entry.label} items={entry.items} />
              ) : (
                <NavLink
                  key={entry.to}
                  to={entry.to}
                  end={entry.to === "/"}
                  className={({ isActive }) =>
                    `text-sm font-semibold uppercase tracking-wide transition-colors ${
                      isActive ? "text-brand-700" : "text-ink-soft hover:text-brand-700"
                    }`
                  }
                >
                  {entry.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={env.donationUrl || "/donate"}
              target={env.donationUrl ? "_blank" : undefined}
              rel={env.donationUrl ? "noreferrer" : undefined}
              className="btn-primary hidden sm:inline-flex"
            >
              <Heart className="h-4 w-4" aria-hidden="true" /> Donate
            </a>
            <button
              type="button"
              className="rounded-lg p-2 text-ink hover:bg-surface-muted lg:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} items={NAV_ITEMS} />
    </>
  );
}
