"use client"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo mark - "n" block */}
      <div className="size-8 shrink-0 text-sidebar-foreground">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left vertical stem - 3 blocks */}
          <rect x="6" y="6" width="5" height="6" fill="currentColor" rx="1" />
          <rect x="6" y="13" width="5" height="6" fill="currentColor" rx="1" />
          <rect x="6" y="20" width="5" height="6" fill="currentColor" rx="1" />

          {/* Diagonal connection - 2 blocks */}
          <rect x="12" y="10" width="5" height="5" fill="currentColor" rx="1" />
          <rect x="17" y="14" width="5" height="5" fill="currentColor" rx="1" />

          {/* Right vertical stem - 2 blocks (shorter than left) */}
          <rect x="21" y="13" width="5" height="6" fill="currentColor" rx="1" />
          <rect x="21" y="20" width="5" height="6" fill="currentColor" rx="1" />
        </svg>
      </div>
      
      {/* Logo text - hidden when collapsed */}
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight text-sidebar-foreground">
            ntropii
          </span>
          <span className="text-xs italic leading-tight text-sidebar-foreground/70">
            insights
          </span>
        </div>
      )}
    </div>
  )
}
