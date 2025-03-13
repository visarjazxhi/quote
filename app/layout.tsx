'use client';
import "./globals.css";
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import Image from 'next/image';
import { useState } from "react";
import { Toaster } from "react-hot-toast";


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
          <main className="flex-1">{children}
          <Toaster />
          </main>
          <footer className="border-t">
            <div className="container flex h-16 items-center justify-between">
              <p className="text-sm text-muted-foreground">© 2025 IAA App. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

function MainNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-6">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/logo.png" width={100} height={100} alt="Logo" className="mx-auto" />
      </Link>

      {/* Desktop Navigation Links (Visible on Larger Screens) */}
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-sm font-medium text-muted-foreground">
          Home
        </Link>
        <Link href="/quote" className="text-sm font-medium text-muted-foreground">
          Quotes
        </Link>
        <Link href="/emails" className="text-sm font-medium text-muted-foreground">
          Email Templates
        </Link>
        <Link href="#" className="text-sm font-medium text-muted-foreground">
          Links
        </Link>
        <Link href="#" className="text-sm font-medium text-muted-foreground">
          Coming Soon
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        className="md:hidden ml-auto" // Pushes the button to the right in mobile view
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
        <Link href="/" className="text-sm font-medium text-muted-foreground">
          Home
        </Link>
        <Link href="/quote" className="text-sm font-medium text-muted-foreground">
          Quotes
        </Link>
        <Link href="/emails" className="text-sm font-medium text-muted-foreground">
          Email Templates
        </Link>
        <Link href="#" className="text-sm font-medium text-muted-foreground">
          Links
        </Link>
        <Link href="#" className="text-sm font-medium text-muted-foreground">
          Coming Soon
        </Link>
      </nav>
    </div>
  );
}