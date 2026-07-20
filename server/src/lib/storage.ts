import { appendFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "../../data");

/**
 * Appends a JSON record to a local, gitignored data file. This is
 * intentionally simple for v1 — submissions (prayer requests, testimonies,
 * contact messages, newsletter signups) are private and never exposed
 * through any public API route. Swap for a real database/CRM by replacing
 * this module only; callers don't need to change.
 */
export async function appendRecord(file: string, record: Record<string, unknown>): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const line = `${JSON.stringify({ ...record, receivedAt: new Date().toISOString() })}\n`;
  await appendFile(resolve(DATA_DIR, file), line, "utf-8");
}
