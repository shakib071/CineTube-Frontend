"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

interface Purchase {
  id: string;
  type: string;
  amount: number;
  status: string;
  currency: string;
  createdAt: string;
  user:  { name: string } | null;
  media: { title: string } | null;
}

interface Props {
  purchases: Purchase[];
}

// Group the last 5 purchases by day into a bar chart
// Also show a breakdown by purchase type as a second mini chart
const buildDailyData = (purchases: Purchase[]) => {
  const map: Record<string, number> = {};
  purchases.forEach((p) => {
    if (p.status !== "SUCCESS") return;
    const day = new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    map[day] = (map[day] ?? 0) + p.amount;
  });
  return Object.entries(map).map(([date, revenue]) => ({ date, revenue: +revenue.toFixed(2) }));
};

const buildTypeData = (purchases: Purchase[]) => {
  const map: Record<string, number> = { BUY: 0, RENT: 0, SUBSCRIPTION: 0 };
  purchases.forEach((p) => {
    if (p.status !== "SUCCESS") return;
    if (map[p.type] !== undefined) map[p.type] += p.amount;
  });
  return [
    { name: "Buy",          value: +map.BUY.toFixed(2),          color: "#3b82f6" },
    { name: "Rent",         value: +map.RENT.toFixed(2),         color: "#f59e0b" },
    { name: "Subscription", value: +map.SUBSCRIPTION.toFixed(2), color: "#ef4444" },
  ].filter((d) => d.value > 0);
};

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-card px-3 py-2 text-xs shadow-lg">
      {label && <p className="text-muted-foreground mb-1">{label}</p>}
      <p className="font-semibold text-foreground">${payload[0].value.toFixed(2)}</p>
    </div>
  );
};

export default function RevenueChart({ purchases }: Props) {
  const daily = buildDailyData(purchases);
  const byType = buildTypeData(purchases);

  if (daily.length === 0 && byType.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-12">
        No successful payments to display yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Daily revenue bar chart */}
      {daily.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-3">Revenue by day (last 5 purchases)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                tickFormatter={(v: any) => `$${v}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={48} fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Revenue by type */}
      {byType.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-3">Revenue by purchase type</p>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={byType} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                tickFormatter={(v: any) => `$${v}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={24}>
                {byType.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
