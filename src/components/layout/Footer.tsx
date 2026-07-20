import type { SVGProps } from "react";
import { NavLink } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Radio, Youtube } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ministryInfo } from "@/data/ministry";
import { socialLinks } from "@/data/social";
import { env } from "@/lib/env";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

const SOCIAL_ICON = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  x: XIcon,
};

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-surface-warm pb-24">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="h-14 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-ink-soft">
            Redemption Radio is a ministry of Redemption Hour Ministries, sharing the Gospel and
            equipping believers through teaching, worship, and prayer.
          </p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map((link) => {
              const Icon = SOCIAL_ICON[link.id];
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink-soft hover:border-brand-600 hover:text-brand-700"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        <nav aria-label="Quick links">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink">Quick Links</h2>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><NavLink to="/about" className="hover:text-brand-700">About Us</NavLink></li>
            <li><NavLink to="/programmes" className="hover:text-brand-700">Programmes</NavLink></li>
            <li><NavLink to="/schedule" className="hover:text-brand-700">Schedule</NavLink></li>
            <li><NavLink to="/messages" className="hover:text-brand-700">Messages</NavLink></li>
            <li><NavLink to="/testimonies" className="hover:text-brand-700">Testimonies</NavLink></li>
            <li><NavLink to="/contact" className="hover:text-brand-700">Contact Us</NavLink></li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink">Get In Touch</h2>
          <ul className="space-y-3 text-sm text-ink-soft">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              <a href={`tel:${env.contactPhone.replace(/[^\d+]/g, "")}`} className="hover:text-brand-700">
                {env.contactPhone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              <a href={`mailto:${env.contactEmail}`} className="hover:text-brand-700">
                {env.contactEmail}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              <span>{ministryInfo.address}</span>
            </li>
          </ul>
          <p className="mt-3 text-xs text-ink-faint">{ministryInfo.officeHours}</p>
          <NavLink to="/listen-live" className="btn-ghost mt-4 !px-0">
            <Radio className="h-4 w-4" aria-hidden="true" /> Listen Live
          </NavLink>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink">Stay Connected</h2>
          <p className="mb-3 text-sm text-ink-soft">
            Subscribe to get updates on new programmes, events, and messages.
          </p>
          <NewsletterForm compact />
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-faint sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Redemption Hour Ministries. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <NavLink to="/privacy" className="hover:text-brand-700">Privacy Policy</NavLink>
            <NavLink to="/terms" className="hover:text-brand-700">Terms</NavLink>
            <span className="font-semibold text-brand-700">Faith. Hope. Redemption.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
