export const prayerCategories = [
  { id: "healing", label: "Healing" },
  { id: "family", label: "Family & Relationships" },
  { id: "finances", label: "Finances & Provision" },
  { id: "guidance", label: "Guidance & Direction" },
  { id: "salvation", label: "Salvation of a Loved One" },
  { id: "grief", label: "Grief & Loss" },
  { id: "thanksgiving", label: "Thanksgiving" },
  { id: "other", label: "Other" },
] as const;

export type PrayerCategoryId = (typeof prayerCategories)[number]["id"];
