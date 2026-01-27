"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserMenu } from "@/components/layout/user-menu"

export function CanvasHeader() {
  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logout clicked")
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>
      <div className="flex items-center gap-4">
        <UserMenu onLogout={handleLogout} />
      </div>
    </header>
  )
}
