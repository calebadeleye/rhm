export interface NavLeaf {
  to: string;
  label: string;
}

export interface NavGroup {
  label: string;
  items: NavLeaf[];
}

export type NavEntry = NavLeaf | NavGroup;

/** Top-level nav is kept short (a couple of direct links plus grouped
 * dropdowns) so the header doesn't get choked with too many items —
 * Listen Live and Programmes were removed from here, but their routes
 * still exist and are reachable from the homepage / footer. */
export const NAV_ITEMS: NavEntry[] = [
  { to: "/", label: "Home" },
  { to: "/schedule", label: "Schedule" },
  {
    label: "About",
    items: [
      { to: "/about", label: "About Us" },
      { to: "/messages", label: "Messages" },
    ],
  },
  {
    label: "Connect",
    items: [
      { to: "/prayer-request", label: "Prayer Request" },
      { to: "/app", label: "Get the App" },
      { to: "/contact", label: "Contact" },
    ],
  },
];
