"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Pool, PoolExtended, CapitalFlowData } from "@/lib/api/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CanvasContentBannerProps {
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

export function CanvasContentBanner({
  pool,
  extendedPool,
  capitalFlowData,
  activeTab,
  onTabChange,
}: CanvasContentBannerProps) {
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
      { threshold: 0, rootMargin: "-57px 0px 0px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel element to detect scroll */}
      <div ref={sentinelRef} className="h-px w-full" />

      {/* Sticky banner - top-[56px] accounts for CanvasHeader height */}
      <div
        ref={headerRef}
        className={cn(
          "sticky top-[56px] z-20 bg-background border-b transition-all duration-200",
          isMinimized ? "shadow-md" : ""
        )}
      >
        {/* Banner content */}
        <div className={cn(
          "px-6 transition-all duration-200",
          isMinimized ? "py-3" : "py-5"
        )}>
          {/* Main banner row */}
          <div className="flex items-center justify-between gap-6">
            {/* Left: Title and trend */}
            <div className="flex items-center gap-3 min-w-0">
              <h1 className={cn(
                "font-semibold text-foreground truncate transition-all duration-200",
                isMinimized ? "text-base" : "text-xl"
              )}>
                {pool.name}
              </h1>
              {isPositiveChange ? (
                <TrendingUp className={cn(
                  "shrink-0 text-emerald-500 transition-all duration-200",
                  isMinimized ? "h-4 w-4" : "h-5 w-5"
                )} />
              ) : (
                <TrendingDown className={cn(
                  "shrink-0 text-red-500 transition-all duration-200",
                  isMinimized ? "h-4 w-4" : "h-5 w-5"
                )} />
              )}
            </div>

            {/* Center: Key metrics */}
            <div className={cn(
              "flex items-center gap-2 transition-all duration-200",
              isMinimized ? "gap-2" : "gap-3"
            )}>
              <Badge variant="secondary" className={cn(
                "font-mono transition-all duration-200",
                isMinimized ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1"
              )}>
                TVL {formatCurrency(pool.tvl)}
              </Badge>

              {nav && !isMinimized && (
                <Badge variant="secondary" className="font-mono text-sm px-2.5 py-1">
                  NAV {formatCurrency(nav)}
                </Badge>
              )}

              <Badge
                variant={pool.status === "open" ? "default" : "outline"}
                className={cn(
                  "transition-all duration-200",
                  pool.status === "open"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : pool.status === "defaulted"
                      ? "bg-red-500/10 text-red-600 border-red-500/20"
                      : "",
                  isMinimized ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1"
                )}
              >
                {pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}
              </Badge>

              <Badge variant="secondary" className={cn(
                "transition-all duration-200",
                isMinimized ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1"
              )}>
                {loanSummary?.active || pool.activeLoansCount} Loans
              </Badge>

              {!isMinimized && (
                <Badge variant="outline" className="text-sm px-2.5 py-1">
                  {pool.protocolId
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </Badge>
              )}

              {!isMinimized && extendedPool?.asset && (
                <Badge variant="outline" className="font-mono text-sm px-2.5 py-1">
                  {extendedPool.asset.symbol}
                </Badge>
              )}

              {!isMinimized && loanSummary && loanSummary.defaulted > 0 && (
                <Badge variant="destructive" className="text-sm px-2.5 py-1">
                  {loanSummary.defaulted} Defaulted
                </Badge>
              )}
            </div>

            {/* Right: Chart (hidden when minimized) */}
            <div className={cn(
              "flex flex-col items-end gap-1 transition-all duration-200",
              isMinimized ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            )}>
              <span className="text-xs text-muted-foreground">6 Month Trend</span>
              <MicroChart data={capitalFlowData || []} />
            </div>
          </div>

          {/* Tabs row */}
          <div className={cn(
            "transition-all duration-200",
            isMinimized ? "mt-2" : "mt-4"
          )}>
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
              <TabsList className={cn(
                "w-full max-w-md transition-all duration-200",
                isMinimized ? "h-8" : "h-10"
              )}>
                <TabsTrigger 
                  value="performance" 
                  className={cn(
                    "flex-1 font-medium transition-all duration-200",
                    isMinimized ? "h-6 text-xs" : "h-8 text-sm"
                  )}
                >
                  Performance
                </TabsTrigger>
                <TabsTrigger 
                  value="loans" 
                  className={cn(
                    "flex-1 font-medium transition-all duration-200",
                    isMinimized ? "h-6 text-xs" : "h-8 text-sm"
                  )}
                >
                  Loans
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
