"use client";

import { Input } from "@/components/ui/input";
import React from "react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  children?: React.ReactNode;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  className?: string;
}

export function Toolbar({
  children,
  onSearch,
  searchPlaceholder = "Search...",
  className,
}: ToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg bg-muted/30",
        className
      )}
    >
      <div className="flex-1">
        {onSearch && (
          <Input
            type="search"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full sm:w-80"
          />
        )}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
