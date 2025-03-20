"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
              <MainNav />
            </div>
          </header>
          <main className="flex-1">
            {children}
            <Toaster />
          </main>
          <footer className="border-t">
            <div className="container flex h-16 items-center justify-between">
              <p className="text-sm text-muted-foreground">
                © 2025 IAA App. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

function MainNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkStyle = (href: string) =>
    pathname === href
      ? "text-sm font-large text-foreground bg-sky-100" // Active state style
      : "text-sm font-medium text-muted-foreground"; // Default state style

  return (
    <div className="flex items-center gap-6">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/logo.png"
          width={100}
          height={100}
          alt="Logo"
          className="mx-auto"
        />
      </Link>

      {/* Desktop Navigation Links (Visible on Larger Screens) */}
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/" className={linkStyle("/")}>
          Home
        </Link>
        <Link href="/quote" className={linkStyle("/quote")}>
          Quotes
        </Link>
        <Link href="/emails" className={linkStyle("/emails")}>
          Email Templates
        </Link>
        <Link href="/knowledge_bank" className={linkStyle("/knowledge_bank")}>
          Knowledge Bank
        </Link>
        <Link href="/finance" className={linkStyle("/finance")}>
          Finance Tracker
        </Link>
        <Link href="/course" className={linkStyle("/finance")}>
          Course
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        className="md:hidden ml-auto"
        size="icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Mobile Navigation Links */}
      <nav
        className={`${
          isMobileMenuOpen ? "flex" : "hidden"
        } md:hidden flex-col absolute top-16 left-0 w-full bg-background p-4`}
      >
        <Link href="/" className={linkStyle("/")}>
          Home
        </Link>
        <Link href="/quote" className={linkStyle("/quote")}>
          Quotes
        </Link>
        <Link href="/emails" className={linkStyle("/emails")}>
          Email Templates
        </Link>
        <Link href="/knowledge_bank" className={linkStyle("/knowledge_bank")}>
          Knowledge Bank
        </Link>
        <Link href="/finance" className={linkStyle("/finance")}>
          Finance Tracker
        </Link>
        <Link href="/course" className={linkStyle("/finance")}>
          Course
        </Link>
      </nav>
    </div>
  );
}
