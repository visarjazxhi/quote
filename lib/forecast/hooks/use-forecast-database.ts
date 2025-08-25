import { useCallback, useState } from "react";

import type { FinancialData } from "../types/financial";

export interface ForecastInstance {
  id: string;
  name: string;
  description?: string;
  companyName?: string;
  industry?: string;
  businessType?: string;
  establishedYear?: number;
  employeeCount?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastUpdated: string;
  _count?: {
    categories: number;
    forecastRecords: number;
    scenarios: number;
  };
}

export interface CreateForecastData {
  name: string;
  description?: string;
  companyName?: string;
  industry?: string;
  businessType?: string;
  establishedYear?: number;
  employeeCount?: number;
  taxRate?: number;
  targetIncome?: number;
  userId?: string;
}

/**
 * Hook for managing forecast database operations
 */
export function useForecastDatabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createForecast = useCallback(async (data: CreateForecastData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/forecasts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create forecast");
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getForecasts = useCallback(
    async (userId?: string): Promise<ForecastInstance[]> => {
      setLoading(true);
      setError(null);

      try {
        const url = userId
          ? `/api/forecasts?userId=${userId}`
          : "/api/forecasts";
        const response = await fetch(url);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch forecasts");
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getForecast = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/forecasts/${id}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch forecast");
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveForecast = useCallback(
    async (id: string, financialData: FinancialData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/forecasts/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ financialData }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to save forecast");
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteForecast = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/forecasts/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to delete forecast");
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createForecastRecord = useCallback(
    async (
      forecastId: string,
      record: {
        name: string;
        accountIds: string[];
        method: string;
        parameters?: Record<string, unknown>;
        startDate: string;
        endDate: string;
        status?: string;
      }
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/forecasts/${forecastId}/records`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(record),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to create forecast record");
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createScenario = useCallback(
    async (
      forecastId: string,
      scenario: {
        name: string;
        description?: string;
        type: string;
        value: number;
        accountIds: string[];
        startDate: string;
        endDate: string;
        status?: string;
      }
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/forecasts/${forecastId}/scenarios`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(scenario),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to create scenario");
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    createForecast,
    getForecasts,
    getForecast,
    saveForecast,
    deleteForecast,
    createForecastRecord,
    createScenario,
  };
}
