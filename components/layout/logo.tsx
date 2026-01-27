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
      <div className="flex size-8 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground">
        <span className="text-lg font-bold leading-none">n</span>
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
