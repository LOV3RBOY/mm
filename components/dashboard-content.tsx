import * as React from "react"
import { cn } from "@/lib/utils"

interface DashboardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardContent({ children, className, ...props }: DashboardContentProps) {
  // TODO: Fetch and display actual dashboard data
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* Render actual data or children. Placeholder shown if no children are passed. */}
      {children ? children : <p className="text-sm text-muted-foreground">Dashboard content will appear here.</p>}
    </div>
  )
}
