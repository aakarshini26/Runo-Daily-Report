import { CallRow, CallType } from "./types";
import {
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfMonth,
  endOfMonth,
  subMonths,
  subDays,
  format as formatDate,
} from "date-fns";

export interface Totals {
  calls: number;
  connected: number;
  talktimeSeconds: number;
}

export function computeTotals(rows: CallRow[]): Totals {
  return rows.reduce(
    (acc, r) => {
      acc.calls += r.calls;
      acc.connected += r.connected;
      acc.talktimeSeconds += r.talktimeSeconds;
      return acc;
    },
    { calls: 0, connected: 0, talktimeSeconds: 0 }
  );
}

export interface DailyPoint {
  date: string;
  inbound: Totals;
  outbound: Totals;
  total: Totals;
}

function emptyTotals(): Totals {
  return { calls: 0, connected: 0, talktimeSeconds: 0 };
}

/** Groups rows by date, split into inbound/outbound/total — for trend charts. */
export function groupByDate(rows: CallRow[]): DailyPoint[] {
  const map = new Map<string, DailyPoint>();

  for (const r of rows) {
    if (!map.has(r.date)) {
      map.set(r.date, { date: r.date, inbound: emptyTotals(), outbound: emptyTotals(), total: emptyTotals() });
    }
    const point = map.get(r.date)!;
    const bucket = r.callType === "Inbound" ? point.inbound : point.outbound;
    bucket.calls += r.calls;
    bucket.connected += r.connected;
    bucket.talktimeSeconds += r.talktimeSeconds;
    point.total.calls += r.calls;
    point.total.connected += r.connected;
    point.total.talktimeSeconds += r.talktimeSeconds;
  }

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function applyFilters(
  rows: CallRow[],
  filters: {
    from?: string;
    to?: string;
    centre?: string;
    callType?: string;
    agentId?: string;
  }
): CallRow[] {
  return rows.filter((r) => {
    if (filters.from && r.date < filters.from) return false;
    if (filters.to && r.date > filters.to) return false;
    if (filters.centre && filters.centre !== "all" && r.centre !== filters.centre) return false;
    if (filters.callType && filters.callType !== "all" && r.callType !== (filters.callType as CallType))
      return false;
    if (filters.agentId && filters.agentId !== "all" && r.agentId !== filters.agentId) return false;
    return true;
  });
}

export type Period =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "custom"
  | "all";

export const PERIOD_LABELS: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "thisWeek", label: "This week" },
  { value: "lastWeek", label: "Last week" },
  { value: "thisMonth", label: "This month" },
  { value: "lastMonth", label: "Last month" },
  { value: "all", label: "All time" },
];

/** Today's date in India, as an ISO yyyy-MM-dd string — independent of
 * whatever timezone the server happens to be running in. */
function todayIST(): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

function iso(date: Date): string {
  return formatDate(date, "yyyy-MM-dd");
}

/** Parses an ISO date as a fixed noon-UTC instant so date-fns week/month
 * math can't shift the calendar day due to local timezone quirks. */
function toAnchorDate(isoStr: string): Date {
  return new Date(`${isoStr}T12:00:00Z`);
}

/**
 * Resolves a named period into a {from, to} range. "custom" passes through
 * whatever the person picked; "all" (or an unrecognised period) applies no
 * date filter at all.
 */
export function resolvePeriod(
  period: Period | string | undefined,
  customFrom?: string,
  customTo?: string
): { from?: string; to?: string } {
  if (period === "custom") return { from: customFrom, to: customTo };

  const today = todayIST();
  const anchor = toAnchorDate(today);

  switch (period) {
    case "today":
      return { from: today, to: today };
    case "yesterday": {
      const y = iso(subDays(anchor, 1));
      return { from: y, to: y };
    }
    case "thisWeek":
      return { from: iso(startOfWeek(anchor, { weekStartsOn: 1 })), to: today };
    case "lastWeek": {
      const lastWeekAnchor = subWeeks(anchor, 1);
      return {
        from: iso(startOfWeek(lastWeekAnchor, { weekStartsOn: 1 })),
        to: iso(endOfWeek(lastWeekAnchor, { weekStartsOn: 1 })),
      };
    }
    case "thisMonth":
      return { from: iso(startOfMonth(anchor)), to: today };
    case "lastMonth": {
      const lastMonthAnchor = subMonths(anchor, 1);
      return {
        from: iso(startOfMonth(lastMonthAnchor)),
        to: iso(endOfMonth(lastMonthAnchor)),
      };
    }
    case "all":
    default:
      return {};
  }
}
