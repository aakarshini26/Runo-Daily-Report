import { Suspense } from "react";
import FilterBar from "@/components/FilterBar";
import SummaryCards from "@/components/SummaryCards";
import TrendChart from "@/components/TrendChart";
import { fetchCalls } from "@/lib/sheets";
import { applyFilters, computeTotals, groupByDate, resolvePeriod, Period } from "@/lib/aggregate";
import { formatDisplayDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  let calls: Awaited<ReturnType<typeof fetchCalls>> = [];
  let loadError: string | null = null;
  try {
    calls = await fetchCalls();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Could not load data from the sheet.";
  }

  const period = (searchParams.period as Period) || "today";
  const { from, to } = resolvePeriod(period, searchParams.from, searchParams.to);

  const filtered = applyFilters(calls, {
    from,
    to,
    centre: searchParams.centre,
    callType: searchParams.type,
    agentId: searchParams.agent,
  });

  const totals = computeTotals(filtered);
  const daily = groupByDate(filtered);

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-display text-xl font-semibold">Overview</h2>
        <p className="text-sm text-base-muted mt-0.5">
          {from && to && from === to
            ? `Showing ${formatDisplayDate(from)}`
            : from && to
            ? `Showing ${formatDisplayDate(from)} – ${formatDisplayDate(to)}`
            : "Showing all logged data"}
        </p>
      </div>

      {loadError && (
        <div className="bg-brand-magenta/10 border border-brand-magenta/40 text-sm rounded-xl2 p-4 mb-5">
          <p className="font-semibold text-brand-magenta mb-1">Couldn&rsquo;t load the sheet</p>
          <p className="text-base-muted">{loadError}</p>
        </div>
      )}

      <Suspense>
        <FilterBar showCentre showAgent showType />
      </Suspense>

      <SummaryCards totals={totals} />

      <TrendChart daily={daily} />
    </div>
  );
}
