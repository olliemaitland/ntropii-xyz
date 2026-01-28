"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CapitalFlowData } from "@/lib/api/types";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

interface CapitalFlowChartProps {
  data: CapitalFlowData[];
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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface ChartDataPoint {
  date: string;
  displayDate: string;
  deposits: number;
  loanRepayments: number;
  withdrawals: number;
  loanDrawdowns: number;
  netPosition: number;
}

function transformData(data: CapitalFlowData[]): ChartDataPoint[] {
  return data.map((d) => ({
    date: d.date,
    displayDate: formatDate(d.date),
    deposits: parseFloat(d.inflows.deposits),
    loanRepayments: parseFloat(d.inflows.loan_repayments),
    withdrawals: -parseFloat(d.outflows.withdrawals),
    loanDrawdowns: -parseFloat(d.outflows.loan_drawdowns),
    netPosition: parseFloat(d.cumulative_position),
  }));
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => {
          if (entry.name === "netPosition") return null;
          const isNegative = entry.value < 0;
          return (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">
                  {entry.name === "deposits" && "Deposits"}
                  {entry.name === "loanRepayments" && "Loan Repayments"}
                  {entry.name === "withdrawals" && "Withdrawals"}
                  {entry.name === "loanDrawdowns" && "Loan Drawdowns"}
                </span>
              </span>
              <span className={isNegative ? "text-red-500" : "text-emerald-500"}>
                {isNegative ? "-" : "+"}
                {formatCurrency(Math.abs(entry.value))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CapitalFlowChart({
  data,
  isLoading,
  onPeriodChange,
}: CapitalFlowChartProps) {
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Capital Flows</CardTitle>
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
          <CardTitle className="text-base font-medium">Capital Flows</CardTitle>
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
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
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
                  yAxisId="bars"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                  width={60}
                />
                <YAxis
                  yAxisId="line"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                  width={70}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: "12px" }}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      deposits: "Deposits",
                      loanRepayments: "Loan Repayments",
                      withdrawals: "Withdrawals",
                      loanDrawdowns: "Loan Drawdowns",
                      netPosition: "Net Position",
                    };
                    return labels[value] || value;
                  }}
                />
                <ReferenceLine
                  yAxisId="bars"
                  y={0}
                  stroke="var(--border)"
                  strokeWidth={1}
                />

                {/* Inflows - positive bars */}
                <Bar
                  yAxisId="bars"
                  dataKey="deposits"
                  stackId="inflows"
                  fill="#10b981"
                  radius={[2, 2, 0, 0]}
                  name="deposits"
                />
                <Bar
                  yAxisId="bars"
                  dataKey="loanRepayments"
                  stackId="inflows"
                  fill="#3b82f6"
                  radius={[2, 2, 0, 0]}
                  name="loanRepayments"
                />

                {/* Outflows - negative bars */}
                <Bar
                  yAxisId="bars"
                  dataKey="withdrawals"
                  stackId="outflows"
                  fill="#ef4444"
                  radius={[0, 0, 2, 2]}
                  name="withdrawals"
                />
                <Bar
                  yAxisId="bars"
                  dataKey="loanDrawdowns"
                  stackId="outflows"
                  fill="#f97316"
                  radius={[0, 0, 2, 2]}
                  name="loanDrawdowns"
                />

                {/* Net position line */}
                <Line
                  yAxisId="line"
                  type="monotone"
                  dataKey="netPosition"
                  stroke="var(--foreground)"
                  strokeWidth={2}
                  dot={false}
                  name="netPosition"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend explanation */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="h-2 w-2 rounded-full bg-blue-500" />
            </div>
            <span>Inflows (Deposits, Repayments)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="h-2 w-2 rounded-full bg-orange-500" />
            </div>
            <span>Outflows (Withdrawals, Drawdowns)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
