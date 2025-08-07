"use client";

import { Calculator } from "lucide-react";

interface HeaderProps {
  readonly title?: string;
  readonly subtitle?: string;
}

export default function Header({
  title = "Integritas Finance",
  subtitle = "Professional Finance Tools for Smart Decisions",
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {title}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}
