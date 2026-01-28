"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PoolCapacityData } from "@/lib/api/types";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

interface PoolCapacityChartProps {
  data: PoolCapacityData[];
  isLoading?: boolean;
  onPeriodChange?: (days: number) => void;
}

type TimePeriod = 30 | 90 | 365;

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface ChartDataPoint {
  date: string;
  displayDate: string;
  liquidityCap: number;
  outstandingBalance: number;
  idleCash: number;
  utilizationRate: number;
}

function transformData(data: PoolCapacityData[]): ChartDataPoint[] {
  return data.map((d) => ({
    date: d.date,
    displayDate: formatDate(d.date),
    liquidityCap: parseFloat(d.liquidity_cap),
    outstandingBalance: parseFloat(d.outstanding_balance),
    idleCash: parseFloat(d.idle_cash),
    utilizationRate: d.utilization_rate,
  }));
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const utilizationEntry = payload.find((p) => p.dataKey === "utilizationRate");
  const otherEntries = payload.filter((p) => p.dataKey !== "utilizationRate");

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <div className="space-y-1">
        {otherEntries.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {entry.dataKey === "liquidityCap" && "Liquidity Cap"}
                {entry.dataKey === "outstandingBalance" && "Outstanding Balance"}
                {entry.dataKey === "idleCash" && "Idle Cash"}
              </span>
            </span>
            <span className="font-medium text-foreground">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
        {utilizationEntry && (
          <div className="mt-2 border-t border-border pt-2">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: utilizationEntry.color }}
                />
                <span className="text-muted-foreground">Utilization Rate</span>
              </span>
              <span className="font-medium text-foreground">
                {formatPercent(utilizationEntry.value)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PoolCapacityChart({
  data,
  isLoading,
  onPeriodChange,
}: PoolCapacityChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(90);

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  const chartData = transformData(data);

  // Sample data for display if too many points
  const displayData =
    chartData.length > 30
      ? chartData.filter((_, i) => i % Math.ceil(chartData.length / 30) === 0)
      : chartData;

  // Get the max liquidity cap for the reference line
  const maxLiquidityCap =
    displayData.length > 0
      ? Math.max(...displayData.map((d) => d.liquidityCap))
      : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">
              Pool Capacity
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Loading chart data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Pool Capacity</CardTitle>
          <div className="flex gap-1">
            {([30, 90, 365] as TimePeriod[]).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => handlePeriodChange(period)}
                className="h-7 px-2 text-xs"
              >
                {period === 365 ? "1Y" : `${period}D`}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {displayData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={displayData}
                margin={{ top: 10, right: 50, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="outstandingGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient
                    id="idleCashGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="amount"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                  width={60}
                  domain={[0, "auto"]}
                />
                <YAxis
                  yAxisId="percent"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatPercent(value)}
                  width={50}
                  domain={[0, 1]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: "12px" }}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      outstandingBalance: "Outstanding Balance",
                      idleCash: "Idle Cash",
                      liquidityCap: "Liquidity Cap",
                      utilizationRate: "Utilization Rate",
                    };
                    return labels[value] || value;
                  }}
                />

                {/* Liquidity Cap - Black horizontal reference line */}
                <ReferenceLine
                  yAxisId="amount"
                  y={maxLiquidityCap}
                  stroke="#000000"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: "Liquidity Cap",
                    position: "insideTopRight",
                    fontSize: 10,
                    fill: "var(--muted-foreground)",
                  }}
                />

                {/* Stacked Areas - Outstanding Balance (bottom) + Idle Cash (top) */}
                <Area
                  yAxisId="amount"
                  type="monotone"
                  dataKey="outstandingBalance"
                  stackId="capacity"
                  stroke="#3b82f6"
                  fill="url(#outstandingGradient)"
                  name="outstandingBalance"
                />
                <Area
                  yAxisId="amount"
                  type="monotone"
                  dataKey="idleCash"
                  stackId="capacity"
                  stroke="#10b981"
                  fill="url(#idleCashGradient)"
                  name="idleCash"
                />

                {/* Liquidity Cap Line (on top of areas) */}
                <Line
                  yAxisId="amount"
                  type="monotone"
                  dataKey="liquidityCap"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={false}
                  name="liquidityCap"
                />

                {/* Utilization Rate - Right axis */}
                <Line
                  yAxisId="percent"
                  type="monotone"
                  dataKey="utilizationRate"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                  name="utilizationRate"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend explanation */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-black" />
            <span>Liquidity Cap</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span>Outstanding Balance (Deployed)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Idle Cash (Undeployed)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 border-t-2 border-dashed border-amber-500" />
            <span>Utilization Rate %</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
