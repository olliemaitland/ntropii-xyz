"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Pool, PoolExtended, CapitalFlowData } from "@/lib/api/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CanvasContentSubjectProps {
  pool: Pool;
  extendedPool?: PoolExtended | null;
  capitalFlowData?: CapitalFlowData[];
  activeTab: string;
  onTabChange: (tab: string) => void;
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

  const monthlyData: { cumulativePosition: number; month: string }[] = [];
  const monthMap = new Map<string, number>();

  data.forEach((d) => {
    const month = d.date.substring(0, 7);
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

  const values = monthlyData.map((d) => d.cumulativePosition);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const width = 80;
  const height = 32;
  const padding = 2;

  const points = monthlyData.map((d, i) => {
    const x = padding + (i / (monthlyData.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.cumulativePosition - minVal) / range) * (height - padding * 2);
    return { x, y, value: d.cumulativePosition, month: d.month };
  });

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

export function CanvasContentSubject({
  pool,
  extendedPool,
  capitalFlowData,
  activeTab,
  onTabChange,
}: CanvasContentSubjectProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loanSummary = extendedPool?.loan_summary;
  const nav = extendedPool?.nav;

  const netChange = capitalFlowData?.reduce(
    (sum, d) => sum + parseFloat(d.net_flow),
    0
  ) || 0;
  const isPositiveChange = netChange >= 0;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMinimized(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Sentinel element to detect scroll - must be in normal flow */}
      <div ref={sentinelRef} className="h-px w-full" />

      {/* Sticky header */}
      <div
        ref={headerRef}
        className={cn(
          "sticky top-0 z-20 bg-background transition-all duration-200 px-6 pt-6",
          isMinimized && "shadow-md border-b pb-3"
        )}
      >
        {/* Full header when not minimized */}
        <div className={cn(
          "transition-all duration-200 overflow-hidden",
          isMinimized ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
        )}>
          <Card className="border-border mb-4">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
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

                    {extendedPool?.asset && (
                      <Badge variant="outline" className="font-mono text-xs">
                        {extendedPool.asset.symbol}
                      </Badge>
                    )}

                    {loanSummary && loanSummary.defaulted > 0 && (
                      <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                      >
                        {loanSummary.defaulted} Defaulted
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground">6 Month Trend</span>
                  <MicroChart data={capitalFlowData || []} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Minimized header when scrolled */}
        <div className={cn(
          "transition-all duration-200 overflow-hidden",
          isMinimized ? "max-h-20 opacity-100 py-3" : "max-h-0 opacity-0"
        )}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-foreground">
                {pool.name}
              </h2>
              {isPositiveChange ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono text-xs">
                TVL {formatCurrency(pool.tvl)}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {loanSummary?.active || pool.activeLoansCount} Loans
              </Badge>
              <Badge variant="outline" className="text-xs">
                {pool.protocolId
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs - always visible and sticky */}
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className={cn(
            "h-12 w-full max-w-md",
            isMinimized && "mt-0"
          )}>
            <TabsTrigger value="performance" className="h-10 flex-1 text-base font-semibold">
              Performance
            </TabsTrigger>
            <TabsTrigger value="loans" className="h-10 flex-1 text-base font-semibold">
              Loans
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
