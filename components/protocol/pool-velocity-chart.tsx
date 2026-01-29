"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PoolVelocityData } from "@/lib/api/types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface PoolVelocityChartProps {
  data: PoolVelocityData[];
  isLoading?: boolean;
  onPeriodChange?: (days: number) => void;
}

type TimePeriod = 30 | 90 | 365;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDays(value: number): string {
  return `${value.toFixed(1)}d`;
}

interface ChartDataPoint {
  date: string;
  displayDate: string;
  avgDaysToFund: number;
  avgDaysToProcess: number;
  loansFunded: number;
  redemptionsProcessed: number;
}

function transformData(data: PoolVelocityData[]): ChartDataPoint[] {
  return data.map((d) => ({
    date: d.period_end,
    displayDate: formatDate(d.period_end),
    avgDaysToFund: d.loan_velocity.avg_days_to_fund,
    avgDaysToProcess: d.redemption_velocity.avg_days_to_process,
    loansFunded: d.loan_velocity.loans_funded,
    redemptionsProcessed: d.redemption_velocity.redemptions_processed,
  }));
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string; payload: ChartDataPoint }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const dataPoint = payload[0]?.payload;

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <div className="space-y-2">
        {payload.map((entry, index) => (
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
                {entry.dataKey === "avgDaysToFund" && "Loan Funding Time"}
                {entry.dataKey === "avgDaysToProcess" && "Redemption Processing Time"}
              </span>
            </span>
            <span className="font-medium text-foreground">
              {formatDays(entry.value)}
            </span>
          </div>
        ))}
        {dataPoint && (
          <div className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Loans funded:</span>
              <span>{dataPoint.loansFunded}</span>
            </div>
            <div className="flex justify-between">
              <span>Redemptions processed:</span>
              <span>{dataPoint.redemptionsProcessed}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PoolVelocityChart({
  data,
  isLoading,
  onPeriodChange,
}: PoolVelocityChartProps) {
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
            <CardTitle className="text-base font-medium">
              Pool Velocity
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
          <CardTitle className="text-base font-medium">Pool Velocity</CardTitle>
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
              <LineChart
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
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}d`}
                  width={40}
                  domain={[0, "auto"]}
                  label={{
                    value: "Days",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      fontSize: 11,
                      fill: "var(--muted-foreground)",
                      textAnchor: "middle",
                    },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: "12px" }}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      avgDaysToFund: "Loan Funding Time",
                      avgDaysToProcess: "Redemption Processing Time",
                    };
                    return labels[value] || value;
                  }}
                />

                {/* Loan Funding Time - Blue line */}
                <Line
                  type="monotone"
                  dataKey="avgDaysToFund"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: "#3b82f6" }}
                  name="avgDaysToFund"
                />

                {/* Redemption Processing Time - Green line */}
                <Line
                  type="monotone"
                  dataKey="avgDaysToProcess"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: "#10b981" }}
                  name="avgDaysToProcess"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend explanation */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-blue-500" />
            <span>Loan Funding Time (InstanceDeployed to LoanFunded)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-emerald-500" />
            <span>Redemption Processing Time (Requested to Processed)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
