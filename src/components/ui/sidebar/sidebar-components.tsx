import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { PanelLeft } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_MOBILE, SIDEBAR_WIDTH_ICON } from "./sidebar-provider"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="header"
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="footer"
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="content"
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
      className
    )}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

// ... Additional component exports following the same pattern for:
// SidebarGroup, SidebarGroupLabel, SidebarGroupAction, SidebarGroupContent,
// SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuAction,
// SidebarMenuBadge, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubItem,
// SidebarMenuSubButton, SidebarSeparator, SidebarInput, SidebarInset,
// SidebarRail, SidebarTrigger

// Export all components
export {
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  // ... export all other components
}