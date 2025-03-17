"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
)
Chart.displayName = "Chart"

export const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
)
ChartContainer.displayName = "ChartContainer"

export const ChartTooltip = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-2 rounded-lg border bg-background shadow-md", className)} {...props} />
)
ChartTooltip.displayName = "ChartTooltip"

export const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1 text-sm", className)} {...props} />
  ),
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-wrap items-center justify-center gap-4 text-sm", className)} {...props} />
  ),
)
ChartLegend.displayName = "ChartLegend"

export interface ChartLegendItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  color: string
}

export const ChartLegendItem = ({ name, color, className, ...props }: ChartLegendItemProps) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>
    <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
    <span>{name}</span>
  </div>
)
ChartLegendItem.displayName = "ChartLegendItem"

