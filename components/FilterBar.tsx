"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CENTRES, AGENTS } from "@/lib/constants";
import { PERIOD_LABELS } from "@/lib/aggregate";

export default function FilterBar({
  showCentre = true,
  showAgent = true,
  showType = true,
}: {
  showCentre?: boolean;
  showAgent?: boolean;
  showType?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const period = searchParams.get("period") || "today";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const centre = searchParams.get("centre") || "all";
  const agentId = searchParams.get("agent") || "all";
  const type = searchParams.get("type") || "all";

  function update(patch: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === "" || v === undefined) params.delete(k);
      else params.set(k, v);
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  function selectPeriod(p: string) {
    update({ period: p, from: "", to: "" });
  }

  return (
    <div className="bg-base-panel border border-base-line rounded-xl2 p-4 mb-5">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {PERIOD_LABELS.map((p) => (
          <button
            key={p.value}
            onClick={() => selectPeriod(p.value)}
            className={
              "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors " +
              (period === p.value
                ? "bg-brand-gradient text-white"
                : "bg-base-panel2 text-base-muted hover:text-base-text border border-base-line")
            }
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => update({ period: "custom" })}
          className={
            "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors " +
            (period === "custom"
              ? "bg-brand-gradient text-white"
              : "bg-base-panel2 text-base-muted hover:text-base-text border border-base-line")
          }
        >
          Custom
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        {period === "custom" && (
          <>
            <div>
              <div className="text-[10.5px] uppercase tracking-wide text-base-muted font-semibold mb-1.5">
                From
              </div>
              <input
                type="date"
                value={from}
                onChange={(e) => update({ period: "custom", from: e.target.value })}
                className="bg-base-panel2 border border-base-line rounded-lg px-2.5 py-1.5 text-sm text-base-text"
              />
            </div>
            <div>
              <div className="text-[10.5px] uppercase tracking-wide text-base-muted font-semibold mb-1.5">
                To
              </div>
              <input
                type="date"
                value={to}
                onChange={(e) => update({ period: "custom", to: e.target.value })}
                className="bg-base-panel2 border border-base-line rounded-lg px-2.5 py-1.5 text-sm text-base-text"
              />
            </div>
          </>
        )}

        {showCentre && (
          <div>
            <div className="text-[10.5px] uppercase tracking-wide text-base-muted font-semibold mb-1.5">
              Centre
            </div>
            <select
              value={centre}
              onChange={(e) => update({ centre: e.target.value })}
              className="bg-base-panel2 border border-base-line rounded-lg px-2.5 py-1.5 text-sm text-base-text"
            >
              <option value="all">Both centres</option>
              {CENTRES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {showAgent && (
          <div>
            <div className="text-[10.5px] uppercase tracking-wide text-base-muted font-semibold mb-1.5">
              Person
            </div>
            <select
              value={agentId}
              onChange={(e) => update({ agent: e.target.value })}
              className="bg-base-panel2 border border-base-line rounded-lg px-2.5 py-1.5 text-sm text-base-text"
            >
              <option value="all">All 4</option>
              {AGENTS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {showType && (
          <div>
            <div className="text-[10.5px] uppercase tracking-wide text-base-muted font-semibold mb-1.5">
              Call type
            </div>
            <div className="flex border border-base-line rounded-lg overflow-hidden">
              {["all", "Outbound", "Inbound"].map((t) => (
                <button
                  key={t}
                  onClick={() => update({ type: t })}
                  className={
                    "px-3 py-1.5 text-xs font-semibold " +
                    (type === t ? "bg-brand-violet text-white" : "text-base-muted hover:text-base-text")
                  }
                >
                  {t === "all" ? "Both" : t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
