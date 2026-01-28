"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Pool, PoolExtended, CapitalFlowData } from "@/lib/api/types";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

interface PoolDetailsCardProps {
  pool: Pool;
  extendedPool?: PoolExtended | null;
  capitalFlowData?: CapitalFlowData[];
}

function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

function MicroChart({ data }: { data: CapitalFlowData[] }) {
  if (!data || data.length === 0) {
    return (
      <svg width="80" height="32" className="text-muted">
        <line x1="0" y1="16" x2="80" y2="16" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
      </svg>
    );
  }

  // Get last 6 months of cumulative position data
  const monthlyData: { cumulativePosition: number; month: string }[] = [];
  const monthMap = new Map<string, number>();

  data.forEach((d) => {
    const month = d.date.substring(0, 7); // YYYY-MM
    // Use the latest cumulative position for each month
    monthMap.set(month, parseFloat(d.cumulative_position));
  });

  Array.from(monthMap.entries())
    .slice(-6)
    .forEach(([month, cumulativePosition]) => {
      monthlyData.push({ month, cumulativePosition });
    });

  if (monthlyData.length < 2) {
    return (
      <svg width="80" height="32" className="text-muted">
        <line x1="0" y1="16" x2="80" y2="16" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
      </svg>
    );
  }

  // Calculate min/max for Y scaling
  const values = monthlyData.map((d) => d.cumulativePosition);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const width = 80;
  const height = 32;
  const padding = 2;

  // Generate points
  const points = monthlyData.map((d, i) => {
    const x = padding + (i / (monthlyData.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.cumulativePosition - minVal) / range) * (height - padding * 2);
    return { x, y, value: d.cumulativePosition, month: d.month };
  });

  // Generate line segments with colors based on direction
  const segments: { x1: number; y1: number; x2: number; y2: number; increasing: boolean }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    segments.push({
      x1: points[i].x,
      y1: points[i].y,
      x2: points[i + 1].x,
      y2: points[i + 1].y,
      increasing: points[i + 1].value >= points[i].value,
    });
  }

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Line segments */}
      {segments.map((seg, i) => (
        <line
          key={i}
          x1={seg.x1}
          y1={seg.y1}
          x2={seg.x2}
          y2={seg.y2}
          stroke={seg.increasing ? "#10b981" : "#ef4444"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="2"
          fill={i === 0 || points[i].value >= points[i - 1].value ? "#10b981" : "#ef4444"}
        >
          <title>{`${p.month}: ${formatCurrency(p.value)}`}</title>
        </circle>
      ))}
    </svg>
  );
}

export function PoolDetailsCard({
  pool,
  extendedPool,
  capitalFlowData,
}: PoolDetailsCardProps) {
  const loanSummary = extendedPool?.loan_summary;
  const asset = extendedPool?.asset;
  const nav = extendedPool?.nav;
  const hasDefaults = loanSummary && loanSummary.defaulted > 0;

  // Calculate net change from capital flow data
  const netChange = capitalFlowData?.reduce(
    (sum, d) => sum + parseFloat(d.net_flow),
    0
  ) || 0;
  const isPositiveChange = netChange >= 0;

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left side - Pool info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">
                {pool.name}
              </h1>
              {isPositiveChange ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-mono text-xs">
                TVL {formatCurrency(pool.tvl)}
              </Badge>

              {nav && (
                <Badge variant="secondary" className="font-mono text-xs">
                  NAV {formatCurrency(nav)}
                </Badge>
              )}

              <Badge
                variant={pool.status === "open" ? "default" : "outline"}
                className={
                  pool.status === "open"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : pool.status === "defaulted"
                      ? "bg-red-500/10 text-red-600 border-red-500/20"
                      : ""
                }
              >
                {pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}
              </Badge>

              <Badge variant="outline" className="text-xs">
                {pool.protocolId
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </Badge>

              <Badge variant="secondary" className="text-xs">
                {loanSummary?.active || pool.activeLoansCount} Active Loans
              </Badge>

              {asset && (
                <Badge variant="outline" className="font-mono text-xs">
                  {asset.symbol}
                </Badge>
              )}

              {hasDefaults && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  {loanSummary.defaulted} Defaulted
                </Badge>
              )}
            </div>
          </div>

          {/* Right side - Micro chart */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-muted-foreground">6 Month Trend</span>
            <MicroChart data={capitalFlowData || []} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
