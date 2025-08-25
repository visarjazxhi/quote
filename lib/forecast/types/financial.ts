export type PeriodType = "weekly" | "monthly" | "yearly";

export type CategoryType =
  | "sales_revenue"
  | "cogs"
  | "gross_profit"
  | "operating_expenses"
  | "operating_profit"
  | "other_income"
  | "financial_expenses"
  | "other_expenses"
  | "net_profit_before_tax"
  | "income_tax_expense"
  | "net_profit_after_tax"
  | "calculated";

export type OperatingExpenseType =
  | "staff_costs"
  | "premises_expenses"
  | "office_admin"
  | "marketing"
  | "travel_vehicle"
  | "depreciation"
  | "other_operating";

export interface FinancialValue {
  value: number;
  year: number;
  month: number; // 1-12
  date: string; // ISO date string for the month
  isProjected: boolean;
}

export interface MonthPeriod {
  year: number;
  month: number;
  label: string; // e.g., "2024 Jan"
  date: string; // e.g., "2024-01-01"
}

export interface Subcategory {
  id: string;
  name: string;
  order: number;
  rows: FinancialRow[];
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  order: number;
  isExpanded: boolean;
  subcategories: Subcategory[];
  isCalculated?: boolean; // For Gross Profit, Operating Profit, etc.
  formula?: string; // For calculated categories
}

export interface FinancialRow {
  id: string;
  name: string;
  type: CategoryType;
  categoryId: string;
  subcategoryId: string;
  order: number;
  values: FinancialValue[];
}

export interface FinancialData {
  categories: Category[];
  forecastPeriods: MonthPeriod[]; // 84 periods from 2024-2030
  lastUpdated: string;
  taxRate: number; // 25 or 30 percent
  targetIncome: number; // User-defined target income for the year
  balanceSheet: BalanceSheetData;
}

// Balance Sheet Types
export type BalanceSheetSection =
  | "current_assets"
  | "non_current_assets"
  | "current_liabilities"
  | "non_current_liabilities"
  | "equity";

export interface BalanceSheetAccount {
  id: string;
  name: string;
  section: BalanceSheetSection;
  order: number;
  values: FinancialValue[];
}

export interface BalanceSheetData {
  accounts: BalanceSheetAccount[];
}

// Helper function to generate forecast periods (2024-2030)
export function generateForecastPeriods(): MonthPeriod[] {
  const periods: MonthPeriod[] = [];
  const startYear = 2024;
  const endYear = 2030;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      const date = new Date(year, month - 1);
      periods.push({
        year,
        month,
        label: `${year} ${monthNames[month - 1]}`,
        date: date.toISOString().split("T")[0],
      });
    }
  }

  return periods;
}

// Helper function to create empty values for a row
export function createEmptyValues(): FinancialValue[] {
  const periods = generateForecastPeriods();
  return periods.map((period) => ({
    value: 0,
    year: period.year,
    month: period.month,
    date: period.date,
    isProjected: true,
  }));
}

export interface FinancialMetrics {
  grossProfitMargin: number;
  operatingMargin: number;
  netProfitMargin: number;
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
}

// Legacy ScenarioConfig interface (to be removed after migration)
export interface LegacyScenarioConfig {
  id: string;
  name: string;
  description: string;
  adjustments: {
    rowId: string;
    rate: number;
    startDate: string;
  }[];
}

export interface DateRange {
  start: string;
  end: string;
}

export type ViewMode = {
  period: PeriodType;
  range: DateRange;
};

// Advanced AI Prediction Types
export type ForecastMethod =
  | "linear_trend"
  | "exponential_smoothing"
  | "seasonal"
  | "growth_rate" // Percentage scenario (compounding month over month)
  | "fixed_amount" // Fixed amount per month scenario
  | "percentage_of_revenue"
  | "arima"
  | "monte_carlo"
  | "machine_learning"
  | "polynomial_regression"
  | "seasonal_decomposition"
  | "holt_winters";

// Enhanced Scenario Types for the new requirements
export type ScenarioType = "percentage" | "amount";

export interface ScenarioConfig {
  id: string;
  name: string;
  description: string;
  type: ScenarioType;
  value: number; // Percentage (e.g., 5 for 5%) or Amount (e.g., 1000 for $1000)
  accountIds: string[]; // Array of account/row IDs this scenario applies to
  startDate: string; // Start month (YYYY-MM-01 format)
  endDate: string; // End month (YYYY-MM-01 format)
  createdAt: string;
  status: "active" | "paused";
}

export type TrendDirection = "up" | "down" | "stable";

export interface ForecastResult {
  accuracy: number; // 0-1
  confidence: number; // 0-1
  trendDirection: TrendDirection;
  seasonalityDetected: boolean;
  recommendations: string[];
  method: ForecastMethod;
  parameters: Record<string, unknown>;
  forecastData: number[];
  confidenceIntervals?: {
    lower: number[];
    upper: number[];
  };
  statistics?: {
    mape: number; // Mean Absolute Percentage Error
    rmse: number; // Root Mean Square Error
    mae: number; // Mean Absolute Error
    r_squared: number;
  };
}

export interface ScenarioAnalysis {
  id: string;
  name: string;
  description: string;
  baseCase: number[];
  optimisticCase: number[];
  pessimisticCase: number[];
  probability: {
    optimistic: number;
    base: number;
    pessimistic: number;
  };
  keyDrivers: {
    variable: string;
    impact: number;
    sensitivity: number;
  }[];
}

export interface CashFlowForecast {
  operatingCashFlow: number[];
  investingCashFlow: number[];
  financingCashFlow: number[];
  netCashFlow: number[];
  cumulativeCashFlow: number[];
  workingCapitalChanges: number[];
  cashConversionCycle: number[];
}

export interface FinancialRatios {
  profitabilityRatios: {
    grossProfitMargin: number[];
    operatingMargin: number[];
    netProfitMargin: number[];
    returnOnAssets: number[];
    returnOnEquity: number[];
  };
  liquidityRatios: {
    currentRatio: number[];
    quickRatio: number[];
    cashRatio: number[];
  };
  leverageRatios: {
    debtToEquity: number[];
    debtToAssets: number[];
    interestCoverage: number[];
  };
  efficiencyRatios: {
    assetTurnover: number[];
    inventoryTurnover: number[];
    receivablesTurnover: number[];
  };
}

export interface BudgetVariance {
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  cumulativeVariance: number;
  trend: TrendDirection;
  category: "favorable" | "unfavorable" | "neutral";
}

// Forecast Records System
export interface ForecastRecord {
  id: string;
  name: string;
  accountIds: string[]; // Array of account/row IDs this forecast applies to
  method: ForecastMethod;
  parameters: Record<string, unknown>;
  startDate: string;
  endDate: string;
  createdAt: string;
  status: "active" | "paused" | "completed";
}

export interface DateOverlap {
  hasOverlap: boolean;
  overlappingRecords: ForecastRecord[];
  overlappingAccountIds: string[];
}

// Enhanced overlap checking for scenarios
export interface ScenarioOverlap {
  hasOverlap: boolean;
  overlappingScenarios: ScenarioConfig[];
  overlappingAccountIds: string[];
}
