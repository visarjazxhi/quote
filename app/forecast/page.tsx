"use client";

import { ForecastManager } from "@/components/forecast/forecast-manager";
import { useHydration } from "@/lib/forecast/hooks/use-hydration";

export default function ForecastsPage() {
  const isHydrated = useHydration();

  // Handle forecast selection - navigate to forecast editor
  const handleForecastSelect = (forecastId: string) => {
    // Navigate to the forecast editor page
    window.location.href = `/forecast/${forecastId}`;
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
{/* I don't want a header in here */}
      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <ForecastManager onForecastSelect={handleForecastSelect} />
      </main>
    </div>
  );
}
