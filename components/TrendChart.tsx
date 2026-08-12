"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { DailyPoint } from "@/lib/aggregate";
import { formatShortDate } from "@/lib/format";

const COLORS = { Outbound: "#4B2AF0", Inbound: "#D6299B", rate: "#E9D8FD" };

export default function TrendChart({ daily }: { daily: DailyPoint[] }) {
  if (daily.length === 0) {
    return (
      <div className="bg-base-panel border border-base-line rounded-xl2 p-4 mb-5">
        <h3 className="font-display text-base font-semibold mb-3">Trend</h3>
        <div className="h-64 flex items-center justify-center text-sm text-base-muted">
          No calls logged in this range.
        </div>
      </div>
    );
  }

  const data = daily.map((d) => ({
    name: formatShortDate(d.date),
    Outbound: d.outbound.calls,
    Inbound: d.inbound.calls,
    "Connected %": d.total.calls > 0 ? Math.round((d.total.connected / d.total.calls) * 100) : 0,
  }));

  return (
    <div className="bg-base-panel border border-base-line rounded-xl2 p-4 mb-5">
      <h3 className="font-display text-base font-semibold mb-1">Trend</h3>
      <p className="text-xs text-base-muted mb-3">Bars = calls by day · Line = connected %</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#26262F" />
            <XAxis dataKey="name" stroke="#8C8C99" fontSize={11} interval="preserveStartEnd" />
            <YAxis yAxisId="left" stroke="#8C8C99" fontSize={12} allowDecimals={false} />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#8C8C99"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{ background: "#17171F", border: "1px solid #26262F", borderRadius: 8 }}
              labelStyle={{ color: "#F2F1F6" }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="Outbound" fill={COLORS.Outbound} radius={[3, 3, 0, 0]} />
            <Bar yAxisId="left" dataKey="Inbound" fill={COLORS.Inbound} radius={[3, 3, 0, 0]} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Connected %"
              stroke={COLORS.rate}
              strokeWidth={2.5}
              dot={{ r: 3, fill: COLORS.rate }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
