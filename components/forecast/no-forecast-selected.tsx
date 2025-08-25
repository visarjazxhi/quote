"use client";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface NoForecastSelectedProps {
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  onGoToForecasts: () => void;
}

export function NoForecastSelected({
  icon: Icon,
  description,
  onGoToForecasts,
}: NoForecastSelectedProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <Icon className="mx-auto h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">No Forecast Selected</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Button onClick={onGoToForecasts}>Go to Forecasts</Button>
        </div>
      </CardContent>
    </Card>
  );
}
