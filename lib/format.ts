/**
 * Parses a date cell from the sheet into an ISO yyyy-MM-dd string.
 * Accepts D/M/YYYY (Runo's format, e.g. "08/08/2026") and plain
 * yyyy-MM-dd. Returns null if it doesn't recognise the format.
 */
export function normalizeDate(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (!s) return null;

  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    const [, y, m, d] = iso;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  const dmy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  return null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Formats an ISO date as "08 Aug 2026". */
export function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Formats a duration in seconds as "1h 04m" / "8m 57s" / "42s". */
export function formatTalktime(totalSeconds: number): string {
  const seconds = Math.round(totalSeconds || 0);
  if (seconds <= 0) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

export { DAY_MS };
