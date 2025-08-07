"use client";

import { Calculator, PiggyBank, TrendingUp } from "lucide-react";

export type CalculatorType = "tvm" | "currency" | "compound" | "loan";

interface CalculatorOption {
  id: CalculatorType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  available: boolean;
}

const CALCULATORS: CalculatorOption[] = [
  {
    id: "tvm",
    name: "Time Value of Money",
    description:
      "Calculate present/future value, payments, interest rate, or periods",
    icon: Calculator,
    available: true,
  },
  // {
  //   id: "currency",
  //   name: "Currency Converter",
  //   description:
  //     "Convert between 200+ currencies with real-time exchange rates",
  //   icon: Globe,
  //   available: true,
  // },
  {
    id: "compound",
    name: "Compound Interest",
    description:
      "Calculate investment growth with compound interest and contributions",
    icon: TrendingUp,
    available: true,
  },
  {
    id: "loan",
    name: "Loan Calculator",
    description:
      "Calculate loan payments, total interest, and amortization schedules",
    icon: PiggyBank,
    available: true,
  },
];

interface CalculatorNavProps {
  readonly currentCalculator: CalculatorType;
  readonly onCalculatorChange: (calculator: CalculatorType) => void;
}

export default function CalculatorNav({
  currentCalculator,
  onCalculatorChange,
}: CalculatorNavProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {CALCULATORS.map((calc) => {
              const IconComponent = calc.icon;
              const isActive = currentCalculator === calc.id;

              return (
                <button
                  key={calc.id}
                  onClick={() => calc.available && onCalculatorChange(calc.id)}
                  disabled={!calc.available}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-blue-600"
                      : calc.available
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent hover:border-gray-300"
                      : "text-gray-400 cursor-not-allowed border-transparent"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline whitespace-nowrap">
                    {calc.name}
                  </span>
                  {!calc.available && (
                    <span className="ml-1 text-xs bg-gray-200 px-2 py-1 rounded-full">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
