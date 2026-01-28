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
      <div className="flex h-10 items-center gap-0.5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-6 w-4 rounded-sm bg-muted"
          />
        ))}
      </div>
    );
  }

  // Get last 6 months of data (aggregate by month if daily)
  const monthlyData: { netFlow: number; month: string }[] = [];
  const monthMap = new Map<string, number>();

  data.forEach((d) => {
    const month = d.date.substring(0, 7); // YYYY-MM
    const current = monthMap.get(month) || 0;
    monthMap.set(month, current + parseFloat(d.net_flow));
  });

  Array.from(monthMap.entries())
    .slice(-6)
    .forEach(([month, netFlow]) => {
      monthlyData.push({ month, netFlow });
    });

  // Calculate max absolute value for scaling
  const maxAbsValue = Math.max(
    ...monthlyData.map((d) => Math.abs(d.netFlow)),
    1
  );

  return (
    <div className="flex h-10 items-end gap-0.5">
      {monthlyData.map((d, i) => {
        const heightPercent = Math.abs(d.netFlow) / maxAbsValue;
        const height = Math.max(heightPercent * 32, 4); // 32px max, 4px min
        const isPositive = d.netFlow >= 0;

        return (
          <div
            key={i}
            className={`w-4 rounded-sm transition-all ${
              isPositive ? "bg-emerald-500" : "bg-red-500"
            }`}
            style={{ height: `${height}px` }}
            title={`${d.month}: ${isPositive ? "+" : ""}${formatCurrency(d.netFlow)}`}
          />
        );
      })}
    </div>
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
