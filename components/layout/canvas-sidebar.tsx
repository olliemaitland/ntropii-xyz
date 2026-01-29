"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
                  "w-full px-4 py-3 text-left transition-colors hover:bg-muted/50",
                  selectedPoolId === pool.id && "bg-muted"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground line-clamp-1">
                    {pool.name}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "capitalize shrink-0 text-xs px-2 py-0.5",
                      getPoolStatusStyles(pool.status)
                    )}
                  >
                    {pool.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="font-mono">{formatCurrency(pool.tvl)}</span>
                  <span className="font-mono">{pool.apy.toFixed(1)}% APY</span>
                  <span>{pool.utilizationRate.toFixed(0)}% util</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
