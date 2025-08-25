"use client";

import { BarChart3, FileText, Menu, Target, TrendingUp } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const items: NavItem[] = [
  {
    title: "Input Data",
    value: "input",
    icon: FileText,
    description: "Interactive P&L data entry",
  },
  {
    title: "Dashboard",
    value: "dashboard",
    icon: BarChart3,
    description: "Financial dashboard and key metrics",
  },
  {
    title: "KPIs",
    value: "kpis",
    icon: Target,
    description: "Key performance indicators",
  },
  {
    title: "Forecast",
    value: "forecast",
    icon: TrendingUp,
    description: "Forecast engine and projections",
  },
  {
    title: "Reports",
    value: "reports",
    icon: FileText,
    description: "Analytics and report exports",
  },
];

interface MobileNavProps {
  readonly activeTab?: string;
  readonly onTabChange?: (value: string) => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 w-80">
        <div className="flex items-center gap-2 px-4 py-2 border-b">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="font-semibold">Financial Forecast</span>
        </div>
        <nav className="grid gap-2 py-4">
          {items.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.value}
                onClick={() => onTabChange?.(item.value)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-md p-3 text-sm hover:bg-accent transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeTab === item.value && "bg-accent border border-border"
                )}
              >
                <IconComponent className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="border-t mt-4 pt-4 px-4">
          <div className="grid gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              Export P&L Data
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              Import P&L Data
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
