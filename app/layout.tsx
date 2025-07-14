import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import HydrationBoundary from "@/components/HydrationBoundary";
import { Inter } from "next/font/google";
import MainNav from "./components/MainNav";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Professional Services Quote Generator",
  description: "Generate professional quotes for accounting and business services",
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics />
          <HydrationBoundary>
            <div className="flex flex-col min-h-screen" suppressHydrationWarning>
              <header suppressHydrationWarning>
                <Suspense fallback={<div className="h-16 border-b" />}>
                  <MainNav />
                </Suspense>
              </header>
              <main className="flex-1" suppressHydrationWarning>
                {children}
              </main>
              <footer className="border-t" suppressHydrationWarning>
                <div className="container flex h-16 items-center justify-between" suppressHydrationWarning>
                  <p className="text-sm text-muted-foreground">
                    © 2025 Integritas Technologies. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </HydrationBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
