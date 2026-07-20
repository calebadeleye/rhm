import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Heart, Menu } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { NavDrawer } from "@/components/layout/NavDrawer";
import { env } from "@/lib/env";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programmes", label: "Programmes" },
  { to: "/schedule", label: "Schedule" },
  { to: "/listen-live", label: "Listen Live" },
  { to: "/messages", label: "Messages" },
  { to: "/prayer-request", label: "Prayer Request" },
  { to: "/contact", label: "Contact" },
];

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
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `text-sm font-semibold uppercase tracking-wide transition-colors ${
                    isActive ? "text-brand-700" : "text-ink-soft hover:text-brand-700"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
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
