"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function getStoredTheme(): "light" | "dark" | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem("theme");
  return value === "light" || value === "dark" ? value : null;
}

function applyTheme(theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem("theme", theme);
  } catch {}
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = getStoredTheme();
    const shouldUseDark = stored ? stored === "dark" : getSystemPrefersDark();
    const initial: "light" | "dark" = shouldUseDark ? "dark" : "light";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="ml-1"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
