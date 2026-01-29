"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CanvasSidebarHeaderProps {
  name: string;
  tvl: number;
  activePoolsCount: number;
  lastSyncBlock?: number;
  lastSyncAge?: string;
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
  lastSyncBlock = 21926451,
  lastSyncAge = "1 day",
  className,
}: CanvasSidebarHeaderProps) {
  return (
    <div className={cn("space-y-4 border-b p-4", className)}>
      <h2 className="text-lg font-semibold text-foreground">{name}</h2>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">TVL</p>
          <p className="text-sm font-medium font-mono">{formatCurrency(tvl)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Pools</p>
          <p className="text-sm font-medium font-mono">{activePoolsCount}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Sync</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="text-xs px-2 py-0.5 cursor-default">
                  {lastSyncAge}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Last synced at block #{lastSyncBlock.toLocaleString()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
