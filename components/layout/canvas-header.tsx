"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserMenu } from "@/components/layout/user-menu"
import { Breadcrumb, type BreadcrumbItem } from "@/components/layout/breadcrumb"
import { Separator } from "@/components/ui/separator"

interface CanvasHeaderProps {
  breadcrumbs?: BreadcrumbItem[]
}

export function CanvasHeader({ breadcrumbs }: CanvasHeaderProps) {
  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logout clicked")
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        {breadcrumbs && breadcrumbs.length > 0 && (
          <>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Breadcrumb items={breadcrumbs} />
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <UserMenu onLogout={handleLogout} />
      </div>
    </header>
  )
}
