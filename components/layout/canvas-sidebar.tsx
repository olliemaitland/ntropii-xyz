"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import type { Pool, PoolStatus } from "@/lib/api/types";

interface CanvasSidebarProps {
  pools: Pool[];
  selectedPoolId: string | null;
  onPoolSelect: (poolId: string) => void;
  className?: string;
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

function getPoolStatusStyles(status: PoolStatus): string {
  switch (status) {
    case "open":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "closed":
      return "bg-muted text-muted-foreground border-muted";
    case "defaulted":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "";
  }
}

function UtilizationGauge({ value }: { value: number }) {
  const size = 14;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Color based on utilization
  const getColor = () => {
    if (value >= 90) return "#ef4444"; // red
    if (value >= 70) return "#f97316"; // orange
    return "#22c55e"; // green
  };
  
  return (
    <div className="flex items-center gap-1">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span style={{ color: getColor() }}>{value.toFixed(0)}%</span>
    </div>
  );
}

export function CanvasSidebar({
  pools,
  selectedPoolId,
  onPoolSelect,
  className,
}: CanvasSidebarProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="px-4 py-3 border-b">
        <h3 className="text-sm font-medium text-muted-foreground">Pools</h3>
      </div>
      <div className="flex-1 overflow-auto">
        <ul className="divide-y">
          {pools.map((pool) => (
            <li key={pool.id}>
              <button
                onClick={() => onPoolSelect(pool.id)}
                className={cn(
                  "w-full px-4 py-3 text-left transition-colors relative",
                  selectedPoolId === pool.id 
                    ? "bg-emerald-500/10 border-l-2 border-l-emerald-500 hover:bg-emerald-500/10" 
                    : "hover:bg-muted/50"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground line-clamp-1">
                    {pool.name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "capitalize text-xs px-2 py-0.5",
                        getPoolStatusStyles(pool.status)
                      )}
                    >
                      {pool.status}
                    </Badge>
                    {selectedPoolId === pool.id && (
                      <ChevronRight className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-mono">{formatCurrency(pool.tvl)}</span>
                  <span className="font-mono">{pool.apy.toFixed(1)}% APY</span>
                  <UtilizationGauge value={pool.utilizationRate} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
