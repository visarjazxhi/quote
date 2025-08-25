"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Quote", href: "/quote" },
  { name: "Job Estimation", href: "/estimate" },
  { name: "Finance", href: "/finance" },
  { name: "Priority", href: "/priority" },
  { name: "Decision", href: "/decision" },
  { name: "Course", href: "/course" },
  { name: "Knowledge Bank", href: "/knowledge_bank" },
  { name: "Emails", href: "/emails" },
];

export default function MainNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsClient(true);
  }, []);

  // Show loading state during hydration
  if (!mounted || !isClient) {
    return (
      <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" suppressHydrationWarning>
        <div className="container flex h-16 items-center" suppressHydrationWarning>
          <div className="mr-4 hidden md:flex" suppressHydrationWarning>
            <Link className="mr-6 flex items-center space-x-2" href="/" suppressHydrationWarning>
              <span className="hidden font-bold sm:inline-block" suppressHydrationWarning>
                Integritas Technologies
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium" suppressHydrationWarning>
              {navigation.map((item) => (
                <div
                  key={item.href}
                  className="h-4 w-16 bg-muted rounded animate-pulse"
                  suppressHydrationWarning
                />
              ))}
            </nav>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" suppressHydrationWarning>
      <div className="container flex h-16 items-center" suppressHydrationWarning>
        <div className="mr-4 hidden md:flex" suppressHydrationWarning>
          <Link className="mr-6 flex items-center space-x-2" href="/" suppressHydrationWarning>
            <span className="hidden font-bold sm:inline-block" suppressHydrationWarning>
              Integritas Technologies
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium" suppressHydrationWarning>
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
                suppressHydrationWarning
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
} 