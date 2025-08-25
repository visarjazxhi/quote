"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, icon: Icon, actions, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6", className)}>
      <div className="flex items-start sm:items-center gap-3">
        {Icon && (
          <div className="rounded-full p-2 bg-primary/10 text-primary shrink-0">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5 max-w-prose">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
