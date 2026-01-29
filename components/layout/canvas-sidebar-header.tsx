"use client";

import { cn } from "@/lib/utils";

interface CanvasSidebarHeaderProps {
  name: string;
  tvl: number;
  activePoolsCount: number;
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

export function CanvasSidebarHeader({
  name,
  tvl,
  activePoolsCount,
  className,
}: CanvasSidebarHeaderProps) {
  return (
    <div className={cn("space-y-4 border-b p-4", className)}>
      <h2 className="text-lg font-semibold text-foreground">{name}</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">TVL</p>
          <p className="text-sm font-medium font-mono">{formatCurrency(tvl)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Pools</p>
          <p className="text-sm font-medium font-mono">{activePoolsCount}</p>
        </div>
      </div>
    </div>
  );
}
