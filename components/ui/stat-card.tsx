"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  helperText?: string;
  className?: string;
}

const toneToClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-muted",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
};

export function StatCard({ label, value, icon: Icon, tone = "default", helperText, className }: StatCardProps) {
  const toneClass = toneToClasses[tone];
  return (
    <div className={cn("p-4 rounded-lg border", className)}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
        {Icon && (
          <div className={cn("p-2 rounded-full", toneClass)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {helperText && <div className="text-xs text-muted-foreground mt-2">{helperText}</div>}
    </div>
  );
}
