"use client";

import CalculatorNav, {
  CalculatorType,
} from "@/components/finance/navigation/calculator-nav";

import ClientOnly from "@/components/finance/client-only";
import CompoundInterestCalculator from "@/components/finance/calculators/compound-interest-calculator";
import CurrencyConverter from "@/components/finance/calculators/currency-converter";
import ErrorBoundary from "@/components/finance/error-boundary";
import Header from "@/components/finance/layout/header";
import LoanCalculator from "@/components/finance/calculators/loan-calculator";
import TVMCalculator from "@/components/finance/calculators/tvm-calculator";
import { useState } from "react";

export default function Home() {
  const [currentCalculator, setCurrentCalculator] =
    useState<CalculatorType>("tvm");

  const renderCalculator = () => {
    switch (currentCalculator) {
      case "tvm":
        return <TVMCalculator />;
      case "currency":
        return <CurrencyConverter />;
      case "compound":
        return <CompoundInterestCalculator />;
      case "loan":
        return <LoanCalculator />;
      default:
        return <TVMCalculator />;
    }
  };

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <CalculatorNav
          currentCalculator={currentCalculator}
          onCalculatorChange={setCurrentCalculator}
        />
        <ErrorBoundary>
          <ClientOnly
            fallback={
              <div className="flex items-center justify-center py-12">
                Loading calculator...
              </div>
            }
          >
            {renderCalculator()}
          </ClientOnly>
        </ErrorBoundary>
      </div>
    </main>
  );
}
