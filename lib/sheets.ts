import Papa from "papaparse";
import { CallRow } from "./types";
import { agentByName } from "./constants";
import { normalizeDate } from "./format";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CALLS_TAB = process.env.GOOGLE_SHEET_TAB_NAME || "Runo Report";

function csvUrlForTab(tabName: string): string {
  if (!SHEET_ID) {
    throw new Error(
      "GOOGLE_SHEET_ID is not set. Add it to your environment variables (see README)."
    );
  }
  const encodedTab = encodeURIComponent(tabName);
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodedTab}`;
}

/** Fetches a tab as a raw grid (array of rows, each an array of cell strings). */
async function fetchCsvGrid(tabName: string): Promise<string[][]> {
  const url = csvUrlForTab(tabName);
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(
      `Could not load the "${tabName}" tab (status ${res.status}). Make sure the sheet is shared as "Anyone with the link can view".`
    );
  }
  const text = await res.text();
  const parsed = Papa.parse<string[]>(text, {
    header: false,
    skipEmptyLines: true,
  });
  return parsed.data;
}

function num(cell: string | undefined): number {
  if (!cell) return 0;
  const n = parseFloat(cell.replace(/,/g, "").trim());
  return isNaN(n) ? 0 : n;
}

/**
 * Parses Runo's export layout. Column positions (0-indexed):
 *  0 Date (only present on the FIRST row of each day's block — a merged
 *    cell visually spans the whole block, but the underlying value only
 *    lives on that first row; every other row in the block has a blank
 *    column A)
 *  1 Agent Name
 *  2 Total Calls
 *  3 Inbound Calls
 *  4 Outbound Calls
 *  5 Total Connected Calls
 *  6 Connection %
 *  7 Inbound Connected Calls
 *  8 Inbound Connection %
 *  9 Outbound Connected Calls
 *  10 Outbound Connection %
 *  11 Total Talk Time (H:MM:SS)
 *  12 Total Talk Time (sec)
 *  13 Inbound Talk Time
 *  14 Inbound Talk Time (sec)
 *  15 Outbound Talk Time
 *  16 Outbound Talk Time (sec)
 *
 * We check EVERY row's column A for a parseable date (not just a special
 * header row) and carry that date forward for any following rows whose
 * column A is blank — that's what makes the merged-cell layout work. A row
 * whose Agent Name cell literally reads "Agent Name" is the column header
 * and is skipped as data (but its date, if any, is still picked up). A row
 * whose Agent Name is "Total" is that day's aggregate row and is skipped.
 * Every agent row produces TWO CallRow entries (Inbound and Outbound),
 * since Runo already splits them into columns rather than separate rows.
 */
function parseRunoRows(grid: string[][]): CallRow[] {
  const out: CallRow[] = [];
  let currentDate: string | null = null;

  for (const row of grid) {
    const rowDate = normalizeDate(row[0]);
    if (rowDate) currentDate = rowDate;

    const agentCell = (row[1] || "").trim();
    const agentCellLower = agentCell.toLowerCase();

    if (!agentCell) continue;
    if (agentCellLower === "agent name") continue; // column header row
    if (agentCellLower === "total") continue; // day's aggregate row

    if (!currentDate) continue; // no date context yet, skip stray rows

    const agent = agentByName(agentCell);
    if (!agent) continue; // unrecognised name — skip rather than guess

    const inboundCalls = num(row[3]);
    const outboundCalls = num(row[4]);
    const inboundConnected = num(row[7]);
    const outboundConnected = num(row[9]);
    const inboundTalktimeSec = num(row[14]);
    const outboundTalktimeSec = num(row[16]);

    out.push({
      date: currentDate,
      centre: agent.centre,
      agentId: agent.id,
      agentName: agent.name,
      callType: "Inbound",
      calls: inboundCalls,
      connected: inboundConnected,
      talktimeSeconds: inboundTalktimeSec,
    });

    out.push({
      date: currentDate,
      centre: agent.centre,
      agentId: agent.id,
      agentName: agent.name,
      callType: "Outbound",
      calls: outboundCalls,
      connected: outboundConnected,
      talktimeSeconds: outboundTalktimeSec,
    });
  }

  return out;
}

export async function fetchCalls(): Promise<CallRow[]> {
  const grid = await fetchCsvGrid(CALLS_TAB);
  return parseRunoRows(grid);
}
