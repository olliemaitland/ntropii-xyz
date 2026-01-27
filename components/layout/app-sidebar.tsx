"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Layers,
  FileCheck,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/layout/logo"

const protocols = [
  { name: "Maple Finance", href: "/protocols/maple" },
  { name: "Centrifuge", href: "/protocols/centrifuge" },
  { name: "Goldfinch", href: "/protocols/goldfinch" },
  { name: "Trufi", href: "/protocols/trufi" },
]

const creditDesk = [
  { name: "Available pools", href: "/credit-desk/pools", icon: Layers },
  { name: "Pre-clearance", href: "/credit-desk/pre-clearance", icon: FileCheck },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>
      
      <SidebarContent>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  tooltip="Dashboard"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="size-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Protocols */}
        <SidebarGroup>
          <SidebarGroupLabel>Protocols</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {protocols.map((protocol) => (
                <SidebarMenuItem key={protocol.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === protocol.href}
                    tooltip={protocol.name}
                  >
                    <Link href={protocol.href}>
                      <span>{protocol.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Credit desk */}
        <SidebarGroup>
          <SidebarGroupLabel>Credit desk</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {creditDesk.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.name}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/settings"}
              tooltip="Settings"
            >
              <Link href="/settings">
                <Settings className="size-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
