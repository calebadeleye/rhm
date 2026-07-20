function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toIcsDate(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T` +
    `${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

export interface IcsEventInput {
  title: string;
  description: string;
  start: Date;
  end: Date;
  url?: string;
}

/** Generates a minimal, RFC5545-compliant .ics file and triggers a download.
 * Used as the reminder fallback when browser notifications aren't granted. */
export function downloadIcsReminder(event: IcsEventInput): void {
  const uid = `${event.start.getTime()}-${Math.random().toString(36).slice(2)}@redemptionradio`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Redemption Radio//Programme Reminder//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(event.start)}`,
    `DTEND:${toIcsDate(event.end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    event.url ? `URL:${event.url}` : undefined,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeIcsText(text: string): string {
  return text.replace(/[\\,;]/g, (match) => `\\${match}`).replace(/\n/g, "\\n");
}

/** Requests notification permission and schedules an in-page timeout to fire
 * a Notification when the broadcast starts. Falls back silently if the API
 * or permission is unavailable — callers should offer the .ics download too. */
export async function scheduleBrowserReminder(
  title: string,
  body: string,
  start: Date
): Promise<boolean> {
  if (!("Notification" in window)) return false;

  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }
  if (permission !== "granted") return false;

  const delay = start.getTime() - Date.now();
  if (delay <= 0 || delay > 24 * 60 * 60 * 1000) return false;

  window.setTimeout(() => {
    new Notification(title, { body });
  }, delay);

  return true;
}
