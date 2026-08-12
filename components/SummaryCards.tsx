import { Totals } from "@/lib/aggregate";
import { formatTalktime } from "@/lib/format";

export default function SummaryCards({ totals }: { totals: Totals }) {
  const connectionRate = totals.calls > 0 ? Math.round((totals.connected / totals.calls) * 100) : 0;
  const avgTalktime = totals.connected > 0 ? totals.talktimeSeconds / totals.connected : 0;

  const cards = [
    {
      label: "Calls attempted / received",
      value: totals.calls.toLocaleString("en-IN"),
      sub: "total logged calls",
    },
    {
      label: "Connected",
      value: totals.connected.toLocaleString("en-IN"),
      sub: `${connectionRate}% connection rate`,
    },
    {
      label: "Connected %",
      value: `${connectionRate}%`,
      sub: "connected ÷ total",
    },
    {
      label: "Avg talktime / call",
      value: formatTalktime(avgTalktime),
      sub: "per connected call",
    },
    {
      label: "Total talktime",
      value: formatTalktime(totals.talktimeSeconds),
      sub: "across all connected calls",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
      {cards.map((c) => (
        <div key={c.label} className="bg-base-panel border border-base-line rounded-xl2 p-4">
          <div className="text-[10.5px] uppercase tracking-wide text-base-muted font-semibold mb-2">
            {c.label}
          </div>
          <div className="font-display font-bold text-2xl tabular">{c.value}</div>
          <div className="text-xs text-base-muted mt-1">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
