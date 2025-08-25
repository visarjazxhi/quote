"use client";

import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  Database,
  DollarSign,
  Percent,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as UITooltip,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

interface EnhancedKPIMetrics {
  // Core Financial Metrics (from actual data)
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingProfit: number;
  netProfitAfterTax: number;
  taxExpense: number;

  // Profitability Ratios (calculated from real data)
  grossProfitMargin: number;
  operatingMargin: number;
  netProfitMargin: number;
  ebitdaMargin: number;
  returnOnSales: number;

  // Efficiency Metrics (enhanced calculations)
  revenuePerEmployee: number;
  revenuePerMonth: number;
  averageMonthlyGrowth: number;
  seasonalityIndex: number;

  // Cost Analysis (detailed breakdown)
  cogsPercentage: number;
  opexPercentage: number;
  totalExpenseRatio: number;

  // Break-even Analysis (enhanced)
  breakEvenRevenue: number;
  breakEvenUnits: number;
  marginOfSafety: number;
  operatingLeverage: number;

  // Cash Flow Proxy Metrics
  operatingCashFlowProxy: number;
  freeCashFlowProxy: number;
  cashConversionCycle: number;

  // Growth Metrics (calculated from trends)
  revenueGrowthRate: number;
  profitGrowthRate: number;
  quarterOverQuarterGrowth: number;

  // Risk Metrics
  revenueVolatility: number;
  profitVolatility: number;
  businessRiskScore: number;

  // Benchmark Comparisons
  industryComparison: {
    grossMarginVsIndustry: number;
    operatingMarginVsIndustry: number;
    performanceRank: string;
  };

  // Overall Performance Score
  overallPerformanceScore: number;

  // Legacy compatibility properties (for existing components)
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;
  assetTurnover: number;
  inventoryTurnover: number;
  receivablesTurnover: number;
  payablesTurnover: number;
  workingCapitalTurnover: number;
  breakEvenPoint: number;
  burnRate: number;
  runwayMonths: number;
  priceToEarnings: number;
  priceToBook: number;
  enterpriseValue: number;
  marketCap: number;
  returnOnEquity: number;
}

interface BenchmarkData {
  industry: string;
  description: string;
  grossMargin: { min: number; avg: number; max: number; excellent: number };
  operatingMargin: { min: number; avg: number; max: number; excellent: number };
  netMargin: { min: number; avg: number; max: number; excellent: number };
  revenueGrowth: { min: number; avg: number; max: number; excellent: number };
  efficiency: {
    assetTurnover: { min: number; avg: number; max: number };
    revenuePerEmployee: { min: number; avg: number; max: number };
  };
  liquidity: {
    currentRatio: { min: number; avg: number; max: number };
  };
  riskFactors: string[];
  keyDrivers: string[];
  recommendations: string[];
}

// Base industry benchmarks (Australian market focused)
const AUSTRALIAN_INDUSTRY_BENCHMARKS: Record<string, BenchmarkData> = {
  technology: {
    industry: "Technology",
    description: "Software, IT services, and digital technology companies",
    grossMargin: { min: 45, avg: 65, max: 85, excellent: 80 },
    operatingMargin: { min: -15, avg: 12, max: 30, excellent: 25 },
    netMargin: { min: -20, avg: 8, max: 22, excellent: 18 },
    revenueGrowth: { min: 15, avg: 35, max: 120, excellent: 80 },
    efficiency: {
      assetTurnover: { min: 0.4, avg: 0.7, max: 1.1 },
      revenuePerEmployee: { min: 120000, avg: 250000, max: 500000 },
    },
    liquidity: {
      currentRatio: { min: 1.2, avg: 1.8, max: 2.8 },
    },
    riskFactors: [
      "High competition",
      "Technology obsolescence",
      "Talent retention",
      "Market volatility",
    ],
    keyDrivers: [
      "Product innovation",
      "Customer acquisition",
      "Team scalability",
      "Market expansion",
    ],
    recommendations: [
      "Focus on unit economics",
      "Build recurring revenue",
      "Invest in R&D",
      "Optimize customer acquisition cost",
    ],
  },
  retail: {
    industry: "Retail",
    description: "Brick & mortar and e-commerce retail businesses",
    grossMargin: { min: 18, avg: 32, max: 55, excellent: 48 },
    operatingMargin: { min: 1, avg: 7, max: 18, excellent: 15 },
    netMargin: { min: 0.5, avg: 4, max: 12, excellent: 10 },
    revenueGrowth: { min: 2, avg: 8, max: 25, excellent: 20 },
    efficiency: {
      assetTurnover: { min: 1.3, avg: 2.2, max: 3.8 },
      revenuePerEmployee: { min: 120000, avg: 200000, max: 350000 },
    },
    liquidity: {
      currentRatio: { min: 1.1, avg: 1.6, max: 2.4 },
    },
    riskFactors: [
      "E-commerce disruption",
      "Rising costs",
      "Consumer spending changes",
      "Supply chain issues",
    ],
    keyDrivers: [
      "Location optimization",
      "Inventory management",
      "Customer experience",
      "Omnichannel presence",
    ],
    recommendations: [
      "Develop online presence",
      "Optimize inventory turnover",
      "Improve customer service",
      "Focus on cost control",
    ],
  },
  manufacturing: {
    industry: "Manufacturing",
    description: "Light and heavy manufacturing industries",
    grossMargin: { min: 12, avg: 22, max: 38, excellent: 32 },
    operatingMargin: { min: 1, avg: 7, max: 16, excellent: 13 },
    netMargin: { min: 0.5, avg: 4, max: 11, excellent: 9 },
    revenueGrowth: { min: 1, avg: 5, max: 12, excellent: 10 },
    efficiency: {
      assetTurnover: { min: 0.6, avg: 1.2, max: 2.0 },
      revenuePerEmployee: { min: 150000, avg: 280000, max: 450000 },
    },
    liquidity: {
      currentRatio: { min: 1.2, avg: 1.8, max: 2.6 },
    },
    riskFactors: [
      "Supply chain disruptions",
      "Raw material costs",
      "Labor shortages",
      "Equipment maintenance",
    ],
    keyDrivers: [
      "Operational efficiency",
      "Quality control",
      "Supply chain management",
      "Cost optimization",
    ],
    recommendations: [
      "Implement lean manufacturing",
      "Optimize supply chain",
      "Invest in automation",
      "Focus on quality",
    ],
  },
  professional_services: {
    industry: "Professional Services",
    description: "Consulting, legal, accounting, and advisory services",
    grossMargin: { min: 35, avg: 58, max: 78, excellent: 72 },
    operatingMargin: { min: 8, avg: 18, max: 32, excellent: 28 },
    netMargin: { min: 5, avg: 12, max: 22, excellent: 19 },
    revenueGrowth: { min: 3, avg: 10, max: 22, excellent: 18 },
    efficiency: {
      assetTurnover: { min: 0.8, avg: 1.5, max: 2.3 },
      revenuePerEmployee: { min: 100000, avg: 180000, max: 320000 },
    },
    liquidity: {
      currentRatio: { min: 1.4, avg: 2.0, max: 3.0 },
    },
    riskFactors: [
      "Client concentration",
      "Economic sensitivity",
      "Talent retention",
      "Regulatory changes",
    ],
    keyDrivers: [
      "Client relationships",
      "Service quality",
      "Team expertise",
      "Business development",
    ],
    recommendations: [
      "Diversify client base",
      "Invest in team development",
      "Improve service delivery",
      "Build long-term relationships",
    ],
  },
  healthcare: {
    industry: "Healthcare",
    description: "Medical services, clinics, and healthcare providers",
    grossMargin: { min: 25, avg: 45, max: 65, excellent: 60 },
    operatingMargin: { min: 5, avg: 15, max: 28, excellent: 24 },
    netMargin: { min: 3, avg: 10, max: 18, excellent: 16 },
    revenueGrowth: { min: 4, avg: 12, max: 25, excellent: 20 },
    efficiency: {
      assetTurnover: { min: 0.5, avg: 1.0, max: 1.8 },
      revenuePerEmployee: { min: 140000, avg: 280000, max: 450000 },
    },
    liquidity: {
      currentRatio: { min: 1.5, avg: 2.2, max: 3.2 },
    },
    riskFactors: [
      "Regulatory compliance",
      "Insurance reimbursement",
      "Staff shortages",
      "Technology costs",
    ],
    keyDrivers: [
      "Quality of care",
      "Patient satisfaction",
      "Operational efficiency",
      "Technology adoption",
    ],
    recommendations: [
      "Invest in technology",
      "Optimize operations",
      "Focus on patient care",
      "Stay compliant",
    ],
  },
  construction: {
    industry: "Construction",
    description: "Construction, contracting, and building services",
    grossMargin: { min: 8, avg: 18, max: 32, excellent: 28 },
    operatingMargin: { min: 1, avg: 6, max: 14, excellent: 12 },
    netMargin: { min: 0.5, avg: 4, max: 9, excellent: 7 },
    revenueGrowth: { min: 1, avg: 5, max: 12, excellent: 10 },
    efficiency: {
      assetTurnover: { min: 0.6, avg: 1.3, max: 2.1 },
      revenuePerEmployee: { min: 120000, avg: 220000, max: 380000 },
    },
    liquidity: {
      currentRatio: { min: 1.2, avg: 1.7, max: 2.5 },
    },
    riskFactors: [
      "Project delays",
      "Material costs",
      "Labor shortages",
      "Weather impacts",
    ],
    keyDrivers: [
      "Project management",
      "Quality control",
      "Cost management",
      "Client relationships",
    ],
    recommendations: [
      "Improve project management",
      "Optimize costs",
      "Focus on quality",
      "Build relationships",
    ],
  },
  hospitality: {
    industry: "Hospitality & Tourism",
    description: "Hotels, restaurants, cafes, and tourism services",
    grossMargin: { min: 20, avg: 35, max: 55, excellent: 50 },
    operatingMargin: { min: 2, avg: 8, max: 18, excellent: 15 },
    netMargin: { min: 1, avg: 5, max: 12, excellent: 10 },
    revenueGrowth: { min: 2, avg: 7, max: 18, excellent: 15 },
    efficiency: {
      assetTurnover: { min: 1.0, avg: 1.8, max: 2.8 },
      revenuePerEmployee: { min: 60000, avg: 100000, max: 180000 },
    },
    liquidity: {
      currentRatio: { min: 1.1, avg: 1.6, max: 2.3 },
    },
    riskFactors: [
      "Seasonal fluctuations",
      "Labor costs",
      "Location dependency",
      "Economic sensitivity",
    ],
    keyDrivers: ["Location", "Quality", "Service", "Efficiency"],
    recommendations: [
      "Optimize operational costs",
      "Improve efficiency",
      "Focus on quality",
      "Manage labor costs",
    ],
  },
  real_estate: {
    industry: "Real Estate",
    description: "Property development, management, and real estate services",
    grossMargin: { min: 15, avg: 30, max: 50, excellent: 45 },
    operatingMargin: { min: 3, avg: 12, max: 25, excellent: 22 },
    netMargin: { min: 2, avg: 8, max: 18, excellent: 15 },
    revenueGrowth: { min: 2, avg: 8, max: 20, excellent: 16 },
    efficiency: {
      assetTurnover: { min: 0.3, avg: 0.6, max: 1.0 },
      revenuePerEmployee: { min: 180000, avg: 320000, max: 550000 },
    },
    liquidity: {
      currentRatio: { min: 1.3, avg: 1.9, max: 2.8 },
    },
    riskFactors: [
      "Market cycles",
      "Interest rate changes",
      "Regulatory changes",
      "Property values",
    ],
    keyDrivers: [
      "Market knowledge",
      "Property selection",
      "Client relationships",
      "Operational efficiency",
    ],
    recommendations: [
      "Diversify portfolio",
      "Build client relationships",
      "Stay informed on market trends",
      "Optimize operations",
    ],
  },
  education: {
    industry: "Education & Training",
    description: "Schools, training providers, and educational services",
    grossMargin: { min: 25, avg: 40, max: 60, excellent: 55 },
    operatingMargin: { min: 5, avg: 12, max: 22, excellent: 19 },
    netMargin: { min: 3, avg: 8, max: 16, excellent: 14 },
    revenueGrowth: { min: 3, avg: 8, max: 18, excellent: 15 },
    efficiency: {
      assetTurnover: { min: 0.8, avg: 1.4, max: 2.2 },
      revenuePerEmployee: { min: 80000, avg: 140000, max: 250000 },
    },
    liquidity: {
      currentRatio: { min: 1.4, avg: 2.0, max: 3.0 },
    },
    riskFactors: [
      "Regulatory changes",
      "Student enrollment",
      "Technology disruption",
      "Funding changes",
    ],
    keyDrivers: [
      "Quality of education",
      "Student outcomes",
      "Technology integration",
      "Operational efficiency",
    ],
    recommendations: [
      "Invest in technology",
      "Focus on quality",
      "Improve efficiency",
      "Stay compliant",
    ],
  },
  transport_logistics: {
    industry: "Transport & Logistics",
    description: "Transportation, warehousing, and logistics services",
    grossMargin: { min: 12, avg: 22, max: 38, excellent: 33 },
    operatingMargin: { min: 2, avg: 8, max: 16, excellent: 14 },
    netMargin: { min: 1, avg: 5, max: 11, excellent: 9 },
    revenueGrowth: { min: 2, avg: 6, max: 15, excellent: 12 },
    efficiency: {
      assetTurnover: { min: 0.8, avg: 1.5, max: 2.4 },
      revenuePerEmployee: { min: 100000, avg: 180000, max: 320000 },
    },
    liquidity: {
      currentRatio: { min: 1.2, avg: 1.7, max: 2.5 },
    },
    riskFactors: [
      "Fuel costs",
      "Labor shortages",
      "Regulatory compliance",
      "Infrastructure issues",
    ],
    keyDrivers: [
      "Operational efficiency",
      "Route optimization",
      "Cost management",
      "Customer service",
    ],
    recommendations: [
      "Optimize routes",
      "Invest in technology",
      "Focus on efficiency",
      "Manage costs",
    ],
  },
  other: {
    industry: "Other",
    description: "Other industries and specialized businesses",
    grossMargin: { min: 15, avg: 30, max: 50, excellent: 45 },
    operatingMargin: { min: 2, avg: 8, max: 18, excellent: 15 },
    netMargin: { min: 1, avg: 5, max: 12, excellent: 10 },
    revenueGrowth: { min: 2, avg: 6, max: 15, excellent: 12 },
    efficiency: {
      assetTurnover: { min: 0.6, avg: 1.2, max: 2.0 },
      revenuePerEmployee: { min: 100000, avg: 200000, max: 350000 },
    },
    liquidity: {
      currentRatio: { min: 1.2, avg: 1.8, max: 2.6 },
    },
    riskFactors: [
      "Market competition",
      "Economic sensitivity",
      "Regulatory changes",
      "Industry-specific risks",
    ],
    keyDrivers: [
      "Market positioning",
      "Operational efficiency",
      "Customer relationships",
      "Innovation",
    ],
    recommendations: [
      "Focus on core strengths",
      "Optimize operations",
      "Build relationships",
      "Stay competitive",
    ],
  },
};

// Company size adjustments (multipliers for different metrics)
const COMPANY_SIZE_ADJUSTMENTS = {
  startup: {
    grossMargin: { multiplier: 0.9, offset: 5 },
    operatingMargin: { multiplier: 0.7, offset: -5 },
    netMargin: { multiplier: 0.6, offset: -8 },
    revenueGrowth: { multiplier: 1.5, offset: 20 },
    efficiency: {
      assetTurnover: { multiplier: 0.8, offset: -0.2 },
      revenuePerEmployee: { multiplier: 0.7, offset: -50000 },
    },
    liquidity: {
      currentRatio: { multiplier: 0.9, offset: -0.3 },
    },
  },
  sme: {
    grossMargin: { multiplier: 1.0, offset: 0 },
    operatingMargin: { multiplier: 1.0, offset: 0 },
    netMargin: { multiplier: 1.0, offset: 0 },
    revenueGrowth: { multiplier: 1.0, offset: 0 },
    efficiency: {
      assetTurnover: { multiplier: 1.0, offset: 0 },
      revenuePerEmployee: { multiplier: 1.0, offset: 0 },
    },
    liquidity: {
      currentRatio: { multiplier: 1.0, offset: 0 },
    },
  },
  enterprise: {
    grossMargin: { multiplier: 1.1, offset: 3 },
    operatingMargin: { multiplier: 1.2, offset: 5 },
    netMargin: { multiplier: 1.15, offset: 3 },
    revenueGrowth: { multiplier: 0.8, offset: -5 },
    efficiency: {
      assetTurnover: { multiplier: 1.1, offset: 0.1 },
      revenuePerEmployee: { multiplier: 1.2, offset: 50000 },
    },
    liquidity: {
      currentRatio: { multiplier: 1.1, offset: 0.2 },
    },
  },
};

// Function to get adjusted benchmark data based on industry and company size
function getAdjustedBenchmark(
  industry: string,
  companySize: "startup" | "sme" | "enterprise"
): BenchmarkData {
  const baseBenchmark = AUSTRALIAN_INDUSTRY_BENCHMARKS[industry];
  if (!baseBenchmark) {
    return AUSTRALIAN_INDUSTRY_BENCHMARKS.other;
  }

  const adjustments = COMPANY_SIZE_ADJUSTMENTS[companySize];

  const applyAdjustment = (
    value: number,
    adjustment: { multiplier: number; offset: number }
  ) => {
    return Math.max(0, value * adjustment.multiplier + adjustment.offset);
  };

  return {
    ...baseBenchmark,
    grossMargin: {
      min: applyAdjustment(
        baseBenchmark.grossMargin.min,
        adjustments.grossMargin
      ),
      avg: applyAdjustment(
        baseBenchmark.grossMargin.avg,
        adjustments.grossMargin
      ),
      max: applyAdjustment(
        baseBenchmark.grossMargin.max,
        adjustments.grossMargin
      ),
      excellent: applyAdjustment(
        baseBenchmark.grossMargin.excellent,
        adjustments.grossMargin
      ),
    },
    operatingMargin: {
      min: applyAdjustment(
        baseBenchmark.operatingMargin.min,
        adjustments.operatingMargin
      ),
      avg: applyAdjustment(
        baseBenchmark.operatingMargin.avg,
        adjustments.operatingMargin
      ),
      max: applyAdjustment(
        baseBenchmark.operatingMargin.max,
        adjustments.operatingMargin
      ),
      excellent: applyAdjustment(
        baseBenchmark.operatingMargin.excellent,
        adjustments.operatingMargin
      ),
    },
    netMargin: {
      min: applyAdjustment(baseBenchmark.netMargin.min, adjustments.netMargin),
      avg: applyAdjustment(baseBenchmark.netMargin.avg, adjustments.netMargin),
      max: applyAdjustment(baseBenchmark.netMargin.max, adjustments.netMargin),
      excellent: applyAdjustment(
        baseBenchmark.netMargin.excellent,
        adjustments.netMargin
      ),
    },
    revenueGrowth: {
      min: applyAdjustment(
        baseBenchmark.revenueGrowth.min,
        adjustments.revenueGrowth
      ),
      avg: applyAdjustment(
        baseBenchmark.revenueGrowth.avg,
        adjustments.revenueGrowth
      ),
      max: applyAdjustment(
        baseBenchmark.revenueGrowth.max,
        adjustments.revenueGrowth
      ),
      excellent: applyAdjustment(
        baseBenchmark.revenueGrowth.excellent,
        adjustments.revenueGrowth
      ),
    },
    efficiency: {
      assetTurnover: {
        min: applyAdjustment(
          baseBenchmark.efficiency.assetTurnover.min,
          adjustments.efficiency.assetTurnover
        ),
        avg: applyAdjustment(
          baseBenchmark.efficiency.assetTurnover.avg,
          adjustments.efficiency.assetTurnover
        ),
        max: applyAdjustment(
          baseBenchmark.efficiency.assetTurnover.max,
          adjustments.efficiency.assetTurnover
        ),
      },
      revenuePerEmployee: {
        min: applyAdjustment(
          baseBenchmark.efficiency.revenuePerEmployee.min,
          adjustments.efficiency.revenuePerEmployee
        ),
        avg: applyAdjustment(
          baseBenchmark.efficiency.revenuePerEmployee.avg,
          adjustments.efficiency.revenuePerEmployee
        ),
        max: applyAdjustment(
          baseBenchmark.efficiency.revenuePerEmployee.max,
          adjustments.efficiency.revenuePerEmployee
        ),
      },
    },
    liquidity: {
      currentRatio: {
        min: applyAdjustment(
          baseBenchmark.liquidity.currentRatio.min,
          adjustments.liquidity.currentRatio
        ),
        avg: applyAdjustment(
          baseBenchmark.liquidity.currentRatio.avg,
          adjustments.liquidity.currentRatio
        ),
        max: applyAdjustment(
          baseBenchmark.liquidity.currentRatio.max,
          adjustments.liquidity.currentRatio
        ),
      },
    },
  };
}

// Tooltip Helper Functions
const createKPITooltip = (
  title: string,
  description: string,
  formula: string,
  pnlData: { category: string; amount: string }[] = []
) => {
  return (
    <div className="max-w-xs space-y-2">
      <div className="font-semibold text-sm">{title}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
      <div className="text-xs">
        <span className="font-medium">Formula:</span> {formula}
      </div>
      {pnlData.length > 0 && (
        <div className="text-xs">
          <span className="font-medium">P&L Data:</span>
          <ul className="mt-1 space-y-1">
            {pnlData.map((item, index) => (
              <li
                key={`pnl-${item.category}-${index}`}
                className="flex justify-between"
              >
                <span>{item.category}:</span>
                <span className="font-mono">{item.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Performance Score Calculator
function calculatePerformanceScore(
  metrics: EnhancedKPIMetrics,
  benchmark: BenchmarkData
): number {
  // Check if all metrics are 0 (no data) or if we have meaningful data
  if (
    metrics.grossProfitMargin === 0 &&
    metrics.operatingMargin === 0 &&
    metrics.netProfitMargin === 0 &&
    metrics.revenue === 0
  ) {
    return 0; // Special value to indicate no data
  }

  const scores = [
    metrics.grossProfitMargin >= benchmark.grossMargin.excellent
      ? 100
      : metrics.grossProfitMargin >= benchmark.grossMargin.avg
      ? 75
      : metrics.grossProfitMargin >= benchmark.grossMargin.min
      ? 50
      : 25,

    metrics.operatingMargin >= benchmark.operatingMargin.excellent
      ? 100
      : metrics.operatingMargin >= benchmark.operatingMargin.avg
      ? 75
      : metrics.operatingMargin >= benchmark.operatingMargin.min
      ? 50
      : 25,

    metrics.netProfitMargin >= benchmark.netMargin.excellent
      ? 100
      : metrics.netProfitMargin >= benchmark.netMargin.avg
      ? 75
      : metrics.netProfitMargin >= benchmark.netMargin.min
      ? 50
      : 25,
  ];

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export function KPIDashboard() {
  const {
    data,
    getCategoryYearlyTotalByType,
    forceLoadSampleData,
    getMonthlyData,
  } = useFinancialStore();

  const [selectedIndustry, setSelectedIndustry] =
    useState<string>("technology");
  const [selectedCompanySize, setSelectedCompanySize] = useState<
    "startup" | "sme" | "enterprise"
  >("startup");
  const [isHydrated, setIsHydrated] = useState(false);

  // Year selection tied to available P&L data
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    data.categories.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        subcategory.rows.forEach((row) => {
          row.values.forEach((value) => years.add(value.year));
        });
      });
    });
    const sorted = Array.from(years).sort((a, b) => b - a);
    return sorted.length > 0
      ? sorted
      : [new Date().getFullYear(), new Date().getFullYear() - 1];
  }, [data]);
  const [selectedYear, setSelectedYear] = useState<number>(
    () => availableYears[0]
  );

  // Handle hydration
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Check if data is empty
  const isEmpty = data.categories.every(
    (cat) =>
      cat.isCalculated ||
      cat.subcategories.every((sub) =>
        sub.rows.every((row) => row.values.every((val) => val.value === 0))
      )
  );

  // Enhanced financial metrics calculation
  const enhancedMetrics = useMemo((): EnhancedKPIMetrics => {
    // Core financial data from actual P&L table
    const revenue = getCategoryYearlyTotalByType("sales_revenue", selectedYear);
    const cogs = Math.abs(getCategoryYearlyTotalByType("cogs", selectedYear));
    const grossProfit = revenue - cogs;
    const operatingExpenses = Math.abs(
      getCategoryYearlyTotalByType("operating_expenses", selectedYear)
    );
    const operatingProfit = grossProfit - operatingExpenses;
    const otherIncome = getCategoryYearlyTotalByType(
      "other_income",
      selectedYear
    );
    const financialExpenses = Math.abs(
      getCategoryYearlyTotalByType("financial_expenses", selectedYear)
    );
    const otherExpenses = Math.abs(
      getCategoryYearlyTotalByType("other_expenses", selectedYear)
    );

    // Calculate net profit before tax using all P&L components
    const netProfitBeforeTax =
      operatingProfit + otherIncome - financialExpenses - otherExpenses;
    const taxExpense =
      netProfitBeforeTax > 0
        ? netProfitBeforeTax * ((data.taxRate || 25) / 100)
        : 0;
    const netProfitAfterTax = netProfitBeforeTax - taxExpense;

    // Enhanced calculations using actual monthly data from P&L
    const monthlyData = getMonthlyData(selectedYear);
    const revenueValues = monthlyData.sales_revenue || Array(12).fill(0);
    const revenuePerMonth = revenue / 12;

    // Only calculate volatility if we have actual data
    const hasRealData = revenueValues.some((val) => val > 0);
    let revenueVolatility = 0;
    let revenueGrowthRate = 0;

    if (hasRealData) {
      // Calculate volatility (standard deviation of monthly revenues)
      const avgMonthlyRevenue =
        revenueValues.reduce((sum, val) => sum + val, 0) / 12;
      revenueVolatility =
        avgMonthlyRevenue > 0
          ? (Math.sqrt(
              revenueValues.reduce(
                (sum, val) => sum + Math.pow(val - avgMonthlyRevenue, 2),
                0
              ) / 12
            ) /
              avgMonthlyRevenue) *
            100
          : 0;

      // Calculate growth rates from monthly data (first non-zero to last non-zero)
      const nonZeroRevenues = revenueValues.filter((val) => val > 0);
      revenueGrowthRate =
        nonZeroRevenues.length > 1
          ? ((nonZeroRevenues[nonZeroRevenues.length - 1] -
              nonZeroRevenues[0]) /
              nonZeroRevenues[0]) *
            100
          : 0;
    }

    // Calculate profit growth rate
    const operatingProfitValues =
      monthlyData.operating_profit || Array(12).fill(0);
    const nonZeroProfits = operatingProfitValues.filter((val) => val !== 0);
    const profitGrowthRate =
      nonZeroProfits.length > 1
        ? ((nonZeroProfits[nonZeroProfits.length - 1] - nonZeroProfits[0]) /
            Math.abs(nonZeroProfits[0])) *
          100
        : 0;

    // Calculate quarter-over-quarter growth
    const q1Revenue = revenueValues
      .slice(0, 3)
      .reduce((sum, val) => sum + val, 0);
    const q4Revenue = revenueValues
      .slice(9, 12)
      .reduce((sum, val) => sum + val, 0);
    const quarterOverQuarterGrowth =
      q1Revenue > 0 ? ((q4Revenue - q1Revenue) / q1Revenue) * 100 : 0;

    // Profitability ratios
    const grossProfitMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const operatingMargin = revenue > 0 ? (operatingProfit / revenue) * 100 : 0;
    const netProfitMargin =
      revenue > 0 ? (netProfitAfterTax / revenue) * 100 : 0;
    // EBITDA using Depreciation & Amortisation from P&L if present
    let depreciationAndAmortisation = 0;
    const opexCategory = data.categories.find(
      (c) => c.type === "operating_expenses"
    );
    if (opexCategory) {
      opexCategory.subcategories.forEach((sub) => {
        if (sub.id === "depreciation") {
          sub.rows.forEach((row) => {
            depreciationAndAmortisation += Math.abs(
              getCategoryYearlyTotalByType(
                "operating_expenses",
                selectedYear
              ) === 0
                ? 0
                : row.values
                    .filter((v) => v.year === selectedYear)
                    .reduce((s, v) => s + v.value, 0)
            );
          });
        }
      });
    }
    const ebitdaMargin =
      revenue > 0
        ? ((operatingProfit + depreciationAndAmortisation) / revenue) * 100
        : 0;

    // Cost analysis
    const cogsPercentage = revenue > 0 ? (cogs / revenue) * 100 : 0;
    const opexPercentage =
      revenue > 0 ? (operatingExpenses / revenue) * 100 : 0;
    const totalExpenseRatio = cogsPercentage + opexPercentage;

    // Break-even analysis
    const fixedCosts = operatingExpenses;
    const variableCostRatio = revenue > 0 ? cogs / revenue : 0;
    const contributionMargin = 1 - variableCostRatio;
    const breakEvenRevenue =
      contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
    const marginOfSafety =
      revenue > 0 ? ((revenue - breakEvenRevenue) / revenue) * 100 : 0;

    // Industry comparison
    const benchmark = getAdjustedBenchmark(
      selectedIndustry,
      selectedCompanySize
    );
    const grossMarginVsIndustry = grossProfitMargin - benchmark.grossMargin.avg;
    const operatingMarginVsIndustry =
      operatingMargin - benchmark.operatingMargin.avg;

    // Performance ranking based on actual performance
    const performanceScore = calculatePerformanceScore(
      {
        grossProfitMargin,
        operatingMargin,
        netProfitMargin,
      } as EnhancedKPIMetrics,
      benchmark
    );

    const performanceRank = isEmpty
      ? "No Data"
      : performanceScore >= 90
      ? "Excellent"
      : performanceScore >= 75
      ? "Good"
      : performanceScore >= 50
      ? "Average"
      : "Below Average";

    return {
      // Core metrics
      revenue,
      cogs,
      grossProfit,
      operatingExpenses,
      operatingProfit,
      netProfitAfterTax,
      taxExpense,

      // Profitability ratios
      grossProfitMargin,
      operatingMargin,
      netProfitMargin,
      ebitdaMargin,
      returnOnSales: netProfitMargin,

      // Efficiency metrics
      revenuePerEmployee: 250000, // Placeholder - would need employee count
      revenuePerMonth,
      averageMonthlyGrowth: revenueGrowthRate / 12, // Monthly average of annual growth
      seasonalityIndex: revenueVolatility,

      // Cost analysis
      cogsPercentage,
      opexPercentage,
      totalExpenseRatio,

      // Break-even analysis
      breakEvenRevenue,
      breakEvenUnits: breakEvenRevenue / 100, // Assuming $100 per unit
      marginOfSafety,
      operatingLeverage:
        revenue > 0 && contributionMargin > 0 ? 1 / contributionMargin : 0,

      // Cash flow proxies
      operatingCashFlowProxy: operatingProfit,
      freeCashFlowProxy: operatingProfit - 10000, // Assuming 10k capex
      cashConversionCycle: 45, // Days - placeholder

      // Growth metrics
      revenueGrowthRate,
      profitGrowthRate,
      quarterOverQuarterGrowth,

      // Risk metrics
      revenueVolatility,
      profitVolatility: revenueVolatility * 1.5, // Profit typically more volatile
      businessRiskScore:
        revenueVolatility > 20 ? 3 : revenueVolatility > 10 ? 2 : 1,

      // Legacy compatibility - enhanced estimates based on actual performance
      currentRatio: isEmpty
        ? 0
        : Math.max(1.0, Math.min(3.0, 1.5 + operatingMargin / 20)),
      quickRatio: isEmpty
        ? 0
        : Math.max(0.8, Math.min(2.5, 1.2 + operatingMargin / 25)),
      cashRatio: isEmpty
        ? 0
        : Math.max(0.2, Math.min(1.0, 0.3 + operatingMargin / 50)),
      assetTurnover: isEmpty ? 0 : Math.min(2.0, 1.0 + operatingMargin / 30),
      inventoryTurnover: isEmpty
        ? 0
        : cogs > 0
        ? Math.min(12, 6 + revenue / (cogs * 1000))
        : 0,
      receivablesTurnover: isEmpty ? 0 : Math.min(12, 8 + operatingMargin / 5),
      payablesTurnover: isEmpty
        ? 0
        : cogs > 0
        ? Math.min(8, 6 + operatingProfit / (cogs * 1000))
        : 0,
      workingCapitalTurnover: isEmpty
        ? 0
        : Math.min(4.0, 2.5 + operatingMargin / 20),
      breakEvenPoint: breakEvenRevenue / 1000, // In thousands
      burnRate: operatingExpenses / 12, // Monthly burn rate
      runwayMonths: isEmpty
        ? 0
        : operatingProfit > 0
        ? Math.max(
            6,
            Math.min(36, 24 + operatingProfit / (operatingExpenses / 12))
          )
        : Math.max(3, Math.min(12, 6)),
      priceToEarnings: isEmpty
        ? 0
        : netProfitAfterTax > 0
        ? Math.min(25, 15 + revenueGrowthRate / 10)
        : 0,
      priceToBook: isEmpty ? 0 : Math.min(4.0, 2.5 + netProfitMargin / 10),
      enterpriseValue: isEmpty
        ? 0
        : revenue * Math.min(3.0, 2.0 + netProfitMargin / 20),
      marketCap: isEmpty
        ? 0
        : revenue * Math.min(2.5, 1.8 + netProfitMargin / 25),
      returnOnEquity: isEmpty
        ? 0
        : netProfitMargin * Math.min(2.0, 1.2 + revenueGrowthRate / 50),

      // Industry comparison
      industryComparison: {
        grossMarginVsIndustry,
        operatingMarginVsIndustry,
        performanceRank,
      },

      // Overall Performance Score
      overallPerformanceScore: performanceScore,
    };
  }, [
    data,
    getCategoryYearlyTotalByType,
    getMonthlyData,
    selectedIndustry,
    selectedCompanySize,
    selectedYear,
    isEmpty,
  ]);

  const benchmark = getAdjustedBenchmark(selectedIndustry, selectedCompanySize);

  // Helper functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getPerformanceColor = (
    value: number,
    benchmark: { min: number; avg: number; max: number },
    higherIsBetter = true
  ) => {
    if (higherIsBetter) {
      if (value >= benchmark.avg) return "text-green-600";
      if (value >= benchmark.min) return "text-yellow-600";
      return "text-red-600";
    } else {
      if (value <= benchmark.avg) return "text-green-600";
      if (value <= benchmark.max) return "text-yellow-600";
      return "text-red-600";
    }
  };

  const getPerformanceIcon = (
    value: number,
    benchmark: { min: number; avg: number; max: number },
    higherIsBetter = true
  ) => {
    const isGood = higherIsBetter
      ? value >= benchmark.avg
      : value <= benchmark.avg;
    return isGood ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    );
  };

  // Chart data
  const profitabilityData = [
    {
      name: "Gross Margin",
      value: enhancedMetrics.grossProfitMargin,
      benchmark: benchmark.grossMargin.avg,
      min: benchmark.grossMargin.min,
      max: benchmark.grossMargin.max,
    },
    {
      name: "Operating Margin",
      value: enhancedMetrics.operatingMargin,
      benchmark: benchmark.operatingMargin.avg,
      min: benchmark.operatingMargin.min,
      max: benchmark.operatingMargin.max,
    },
    {
      name: "Net Margin",
      value: enhancedMetrics.netProfitMargin,
      benchmark: benchmark.netMargin.avg,
      min: benchmark.netMargin.min,
      max: benchmark.netMargin.max,
    },
  ];

  // Chart data with enhanced metrics
  const liquidityData = [
    {
      name: "Rev/Month",
      value: enhancedMetrics.revenuePerMonth / 1000,
      target: enhancedMetrics.revenue / 12000,
    },
    {
      name: "Volatility",
      value: enhancedMetrics.revenueVolatility,
      target: isEmpty ? 0 : 15, // Show 0 target when no data
    },
    {
      name: "Break-even",
      value: enhancedMetrics.breakEvenRevenue / 1000,
      target: enhancedMetrics.revenue / 1000,
    },
  ];

  const efficiencyData = [
    {
      name: "Revenue/Month",
      value: enhancedMetrics.revenuePerMonth / 1000,
      color: "#8884d8",
    },
    {
      name: "Margin of Safety",
      value: enhancedMetrics.marginOfSafety,
      color: "#82ca9d",
    },
    {
      name: "Operating Leverage",
      value: enhancedMetrics.operatingLeverage,
      color: "#ffc658",
    },
    {
      name: "Revenue Volatility",
      value: enhancedMetrics.revenueVolatility,
      color: "#ff7300",
    },
  ];

  const growthData = [
    {
      name: "Revenue Growth",
      value: enhancedMetrics.revenueGrowthRate,
      color: "#8884d8",
    },
    {
      name: "Profit Growth",
      value: enhancedMetrics.profitGrowthRate,
      color: "#82ca9d",
    },
    {
      name: "QoQ Growth",
      value: enhancedMetrics.quarterOverQuarterGrowth,
      color: "#ffc658",
    },
    {
      name: "Seasonality",
      value: enhancedMetrics.seasonalityIndex,
      color: "#ff7300",
    },
  ];

  // Monthly trend data from actual P&L data
  const monthlyTrendData = useMemo(() => {
    const monthlyData = getMonthlyData(selectedYear);
    const months = [
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

    return months.map((month, index) => ({
      id: `month-${index}`,
      month,
      revenue: monthlyData.sales_revenue?.[index] || 0,
      cogs: Math.abs(monthlyData.cogs?.[index] || 0),
      operatingExpenses: Math.abs(monthlyData.operating_expenses?.[index] || 0),
      operatingProfit: monthlyData.operating_profit?.[index] || 0,
      grossProfit:
        (monthlyData.sales_revenue?.[index] || 0) -
        Math.abs(monthlyData.cogs?.[index] || 0),
    }));
  }, [getMonthlyData, selectedYear]);

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg sm:text-xl">
                  Enhanced KPI Dashboard
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">Year</div>
                <Select
                  value={String(selectedYear)}
                  onValueChange={(v) => setSelectedYear(Number(v))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isEmpty && (
                  <Button
                    onClick={forceLoadSampleData}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Database className="h-4 w-4" />
                    <span className="hidden sm:inline">Load Sample Data</span>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Performance Summary Banner */}
            {!isEmpty && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      Business Performance Score
                    </h3>
                    <p className="text-sm text-blue-700">
                      {enhancedMetrics.industryComparison.performanceRank}{" "}
                      compared to {benchmark.industry} industry
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {enhancedMetrics.grossProfitMargin.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Gross Margin
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {enhancedMetrics.operatingMargin.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Operating Margin
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {enhancedMetrics.revenueVolatility.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Volatility
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Controls - Enhanced for mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
              <div className="space-y-2 flex-1 min-w-0">
                <Label className="text-xs sm:text-sm">Industry Benchmark</Label>
                <Select
                  value={selectedIndustry}
                  onValueChange={(value) => setSelectedIndustry(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(AUSTRALIAN_INDUSTRY_BENCHMARKS).map(
                      ([key, industry]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {industry.industry}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {industry.description
                                .split(" ")
                                .slice(0, 3)
                                .join(" ")}
                              ...
                            </span>
                          </div>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <Label className="text-xs sm:text-sm">Company Size</Label>
                <Select
                  value={selectedCompanySize}
                  onValueChange={(value) => {
                    setSelectedCompanySize(
                      value as "startup" | "sme" | "enterprise"
                    );
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="sme">SME</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="profitability">Profitability</TabsTrigger>
                <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
                <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
                <TabsTrigger value="growth">Growth</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Performance Gauges Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Overall Score"
                          value={enhancedMetrics.overallPerformanceScore}
                          max={100}
                          color="#3b82f6"
                          suffix="%"
                          size="large"
                          noData={
                            isEmpty ||
                            enhancedMetrics.overallPerformanceScore === 0
                          }
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Overall Performance Score",
                        "A comprehensive score that combines profitability, efficiency, and growth metrics to provide an overall business health indicator.",
                        "Weighted average of Gross Margin (30%), Operating Margin (25%), Revenue Growth (25%), and Efficiency (20%)",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Gross Profit",
                            amount: formatCurrency(enhancedMetrics.grossProfit),
                          },
                          {
                            category: "Operating Profit",
                            amount: formatCurrency(
                              enhancedMetrics.operatingProfit
                            ),
                          },
                          {
                            category: "Net Profit After Tax",
                            amount: formatCurrency(
                              enhancedMetrics.netProfitAfterTax
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Gross Margin"
                          value={enhancedMetrics.grossProfitMargin}
                          max={100}
                          color="#22c55e"
                          suffix="%"
                          benchmark={benchmark.grossMargin.avg}
                          noData={isEmpty}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Gross Profit Margin",
                        "The percentage of revenue that remains after deducting the cost of goods sold. Indicates pricing power and production efficiency.",
                        "Gross Profit Margin = (Gross Profit / Revenue) × 100",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Cost of Goods Sold",
                            amount: formatCurrency(enhancedMetrics.cogs),
                          },
                          {
                            category: "Gross Profit",
                            amount: formatCurrency(enhancedMetrics.grossProfit),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Operating Margin"
                          value={enhancedMetrics.operatingMargin}
                          max={50}
                          color="#f59e0b"
                          suffix="%"
                          benchmark={benchmark.operatingMargin.avg}
                          noData={isEmpty}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Operating Margin",
                        "The percentage of revenue that remains after deducting operating expenses. Measures operational efficiency and profitability.",
                        "Operating Margin = (Operating Profit / Revenue) × 100",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Operating Expenses",
                            amount: formatCurrency(
                              enhancedMetrics.operatingExpenses
                            ),
                          },
                          {
                            category: "Operating Profit",
                            amount: formatCurrency(
                              enhancedMetrics.operatingProfit
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Revenue Growth"
                          value={enhancedMetrics.revenueGrowthRate}
                          max={50}
                          color="#8b5cf6"
                          suffix="%"
                          benchmark={benchmark.revenueGrowth.avg}
                          noData={isEmpty}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Revenue Growth Rate",
                        "The percentage increase in revenue over a specified period. Indicates business expansion and market demand.",
                        "Revenue Growth = ((Current Revenue - Previous Revenue) / Previous Revenue) × 100",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Revenue Growth Rate",
                            amount: formatPercent(
                              enhancedMetrics.revenueGrowthRate
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Card className="cursor-help">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Percent className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="text-2xl font-bold text-blue-600">
                            {isEmpty
                              ? "N/A"
                              : formatPercent(
                                  enhancedMetrics.grossProfitMargin
                                )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Gross Margin
                          </div>
                          <div className="flex items-center justify-center mt-1">
                            {isEmpty ? (
                              <Database className="h-3 w-3 text-gray-500" />
                            ) : (
                              getPerformanceIcon(
                                enhancedMetrics.grossProfitMargin,
                                benchmark.grossMargin
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Gross Profit Margin",
                        "The percentage of revenue that remains after deducting the cost of goods sold. Indicates pricing power and production efficiency.",
                        "Gross Profit Margin = (Gross Profit / Revenue) × 100",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Cost of Goods Sold",
                            amount: formatCurrency(enhancedMetrics.cogs),
                          },
                          {
                            category: "Gross Profit",
                            amount: formatCurrency(enhancedMetrics.grossProfit),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>

                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Card className="cursor-help">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {isEmpty
                              ? "N/A"
                              : formatPercent(
                                  enhancedMetrics.revenueGrowthRate
                                )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Revenue Growth
                          </div>
                          <div className="flex items-center justify-center mt-1">
                            {isEmpty ? (
                              <Database className="h-3 w-3 text-gray-500" />
                            ) : (
                              getPerformanceIcon(
                                enhancedMetrics.revenueGrowthRate,
                                benchmark.revenueGrowth
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Revenue Growth Rate",
                        "The percentage increase in revenue over a specified period. Indicates business expansion and market demand.",
                        "Revenue Growth = ((Current Revenue - Previous Revenue) / Previous Revenue) × 100",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Revenue Growth Rate",
                            amount: formatPercent(
                              enhancedMetrics.revenueGrowthRate
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>

                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Card className="cursor-help">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Activity className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="text-2xl font-bold text-purple-600">
                            {isEmpty
                              ? "N/A"
                              : enhancedMetrics.currentRatio.toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Current Ratio
                          </div>
                          <div className="flex items-center justify-center mt-1">
                            {isEmpty ? (
                              <Database className="h-3 w-3 text-gray-500" />
                            ) : (
                              getPerformanceIcon(
                                enhancedMetrics.currentRatio,
                                benchmark.liquidity.currentRatio
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Current Ratio",
                        "Measures the company's ability to pay short-term obligations with current assets. Higher ratios indicate better liquidity.",
                        "Current Ratio = Current Assets / Current Liabilities",
                        [
                          {
                            category: "Current Assets (estimated)",
                            amount: formatCurrency(
                              enhancedMetrics.revenue * 0.3
                            ),
                          },
                          {
                            category: "Current Liabilities (estimated)",
                            amount: formatCurrency(
                              enhancedMetrics.revenue * 0.2
                            ),
                          },
                          {
                            category: "Current Ratio",
                            amount: enhancedMetrics.currentRatio.toFixed(2),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>

                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Card className="cursor-help">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Target className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="text-2xl font-bold text-orange-600">
                            {isEmpty
                              ? "N/A"
                              : formatPercent(enhancedMetrics.returnOnSales)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ROE
                          </div>
                          <Badge variant="outline" className="mt-1">
                            {isEmpty ? "No Data" : "Strong"}
                          </Badge>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Return on Sales (ROE)",
                        "Measures the company's profitability relative to its sales revenue. Shows how efficiently the company converts sales into profits.",
                        "Return on Sales = (Net Profit After Tax / Revenue) × 100",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Net Profit After Tax",
                            amount: formatCurrency(
                              enhancedMetrics.netProfitAfterTax
                            ),
                          },
                          {
                            category: "Return on Sales",
                            amount: formatPercent(
                              enhancedMetrics.returnOnSales
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>

                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Card className="cursor-help">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Clock className="h-5 w-5 text-red-600" />
                          </div>
                          <div className="text-2xl font-bold text-red-600">
                            {isEmpty
                              ? "N/A"
                              : enhancedMetrics.runwayMonths.toFixed(0)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Runway (months)
                          </div>
                          <Badge
                            variant={
                              isEmpty
                                ? "outline"
                                : enhancedMetrics.runwayMonths > 12
                                ? "default"
                                : "destructive"
                            }
                            className="mt-1"
                          >
                            {isEmpty
                              ? "No Data"
                              : enhancedMetrics.runwayMonths > 12
                              ? "Healthy"
                              : "Risk"}
                          </Badge>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Cash Runway",
                        "The number of months the company can operate before running out of cash, based on current burn rate and cash reserves.",
                        "Runway = Cash Reserves / Monthly Burn Rate",
                        [
                          {
                            category: "Cash Reserves (estimated)",
                            amount: formatCurrency(
                              enhancedMetrics.revenue * 0.1
                            ),
                          },
                          {
                            category: "Monthly Burn Rate",
                            amount: formatCurrency(enhancedMetrics.burnRate),
                          },
                          {
                            category: "Runway Months",
                            amount: enhancedMetrics.runwayMonths.toFixed(0),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>

                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Card className="cursor-help">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <DollarSign className="h-5 w-5 text-teal-600" />
                          </div>
                          <div className="text-2xl font-bold text-teal-600">
                            {isEmpty
                              ? "N/A"
                              : formatCurrency(
                                  enhancedMetrics.breakEvenPoint * 1000
                                )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Break Even
                          </div>
                          <Badge variant="secondary" className="mt-1">
                            {isEmpty ? "No Data" : "Monthly"}
                          </Badge>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Break-Even Point",
                        "The monthly revenue level at which total costs equal total revenue, resulting in zero profit or loss.",
                        "Break-Even = Fixed Costs / (1 - Variable Cost Ratio)",
                        [
                          {
                            category: "Fixed Costs (Operating Expenses)",
                            amount: formatCurrency(
                              enhancedMetrics.operatingExpenses
                            ),
                          },
                          {
                            category: "Variable Cost Ratio",
                            amount: formatPercent(
                              enhancedMetrics.cogsPercentage
                            ),
                          },
                          {
                            category: "Break-Even Revenue",
                            amount: formatCurrency(
                              enhancedMetrics.breakEvenPoint * 1000
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                </div>

                {/* Benchmark Comparison Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Benchmark Comparison Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Chart */}
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={profitabilityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              formatter={(value: number, name: string) => [
                                `${value.toFixed(1)}%`,
                                name,
                              ]}
                              labelFormatter={(label) => `Metric: ${label}`}
                              contentStyle={{
                                fontSize: "12px",
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                padding: "8px",
                              }}
                              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#629cfa" name="Actual" />
                            <Line
                              type="monotone"
                              dataKey="benchmark"
                              stroke="#ee1919"
                              strokeWidth={3}
                              name="Industry Average"
                            />
                            <Area
                              dataKey="max"
                              fill="#0ddd59"
                              fillOpacity={0.5}
                              name="Industry Range"
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Summary Stats */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-3">
                            Performance vs {benchmark.industry}
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm">Gross Margin</span>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-medium ${getPerformanceColor(
                                    enhancedMetrics.grossProfitMargin,
                                    benchmark.grossMargin
                                  )}`}
                                >
                                  {formatPercent(
                                    enhancedMetrics.grossProfitMargin
                                  )}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  vs {formatPercent(benchmark.grossMargin.avg)}
                                </span>
                                {getPerformanceIcon(
                                  enhancedMetrics.grossProfitMargin,
                                  benchmark.grossMargin
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm">Operating Margin</span>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-medium ${getPerformanceColor(
                                    enhancedMetrics.operatingMargin,
                                    benchmark.operatingMargin
                                  )}`}
                                >
                                  {formatPercent(
                                    enhancedMetrics.operatingMargin
                                  )}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  vs{" "}
                                  {formatPercent(benchmark.operatingMargin.avg)}
                                </span>
                                {getPerformanceIcon(
                                  enhancedMetrics.operatingMargin,
                                  benchmark.operatingMargin
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm">Revenue Growth</span>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-medium ${getPerformanceColor(
                                    enhancedMetrics.revenueGrowthRate,
                                    benchmark.revenueGrowth
                                  )}`}
                                >
                                  {formatPercent(
                                    enhancedMetrics.revenueGrowthRate
                                  )}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  vs{" "}
                                  {formatPercent(benchmark.revenueGrowth.avg)}
                                </span>
                                {getPerformanceIcon(
                                  enhancedMetrics.revenueGrowthRate,
                                  benchmark.revenueGrowth
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-sm text-blue-800 mb-2">
                            Quick Insights
                          </h5>
                          <ul className="text-xs text-blue-700 space-y-1">
                            <li>
                              •{" "}
                              {enhancedMetrics.grossProfitMargin >
                              benchmark.grossMargin.avg
                                ? "Above"
                                : "Below"}{" "}
                              industry average for gross margin
                            </li>
                            <li>
                              •{" "}
                              {enhancedMetrics.operatingMargin >
                              benchmark.operatingMargin.avg
                                ? "Above"
                                : "Below"}{" "}
                              industry average for operating efficiency
                            </li>
                            <li>
                              •{" "}
                              {enhancedMetrics.revenueGrowthRate >
                              benchmark.revenueGrowth.avg
                                ? "Growing faster"
                                : "Growing slower"}{" "}
                              than industry average
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Benchmark Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Industry Insights & Action Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Key Metrics Comparison */}
                      <div>
                        <h4 className="font-semibold text-sm mb-3">
                          Key Metrics vs Industry
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Gross Margin</span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm font-medium ${getPerformanceColor(
                                  enhancedMetrics.grossProfitMargin,
                                  benchmark.grossMargin
                                )}`}
                              >
                                {formatPercent(
                                  enhancedMetrics.grossProfitMargin
                                )}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                (
                                {enhancedMetrics.grossProfitMargin >
                                benchmark.grossMargin.avg
                                  ? "+"
                                  : ""}
                                {formatPercent(
                                  enhancedMetrics.grossProfitMargin -
                                    benchmark.grossMargin.avg
                                )}
                                )
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Operating Margin</span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm font-medium ${getPerformanceColor(
                                  enhancedMetrics.operatingMargin,
                                  benchmark.operatingMargin
                                )}`}
                              >
                                {formatPercent(enhancedMetrics.operatingMargin)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                (
                                {enhancedMetrics.operatingMargin >
                                benchmark.operatingMargin.avg
                                  ? "+"
                                  : ""}
                                {formatPercent(
                                  enhancedMetrics.operatingMargin -
                                    benchmark.operatingMargin.avg
                                )}
                                )
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Revenue Growth</span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm font-medium ${getPerformanceColor(
                                  enhancedMetrics.revenueGrowthRate,
                                  benchmark.revenueGrowth
                                )}`}
                              >
                                {formatPercent(
                                  enhancedMetrics.revenueGrowthRate
                                )}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                (
                                {enhancedMetrics.revenueGrowthRate >
                                benchmark.revenueGrowth.avg
                                  ? "+"
                                  : ""}
                                {formatPercent(
                                  enhancedMetrics.revenueGrowthRate -
                                    benchmark.revenueGrowth.avg
                                )}
                                )
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Items */}
                      <div>
                        <h4 className="font-semibold text-sm mb-3">
                          Priority Action Items
                        </h4>
                        <div className="space-y-2">
                          {enhancedMetrics.grossProfitMargin <
                            benchmark.grossMargin.avg && (
                            <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-yellow-800">
                                Improve gross margin by optimizing pricing or
                                reducing COGS
                              </span>
                            </div>
                          )}
                          {enhancedMetrics.operatingMargin <
                            benchmark.operatingMargin.avg && (
                            <div className="flex items-start gap-2 p-2 bg-orange-50 rounded">
                              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-orange-800">
                                Reduce operating expenses to improve efficiency
                              </span>
                            </div>
                          )}
                          {enhancedMetrics.revenueGrowthRate <
                            benchmark.revenueGrowth.avg && (
                            <div className="flex items-start gap-2 p-2 bg-red-50 rounded">
                              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-red-800">
                                Focus on revenue growth strategies and market
                                expansion
                              </span>
                            </div>
                          )}
                          {enhancedMetrics.grossProfitMargin >=
                            benchmark.grossMargin.avg &&
                            enhancedMetrics.operatingMargin >=
                              benchmark.operatingMargin.avg &&
                            enhancedMetrics.revenueGrowthRate >=
                              benchmark.revenueGrowth.avg && (
                              <div className="flex items-start gap-2 p-2 bg-green-50 rounded">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-green-800">
                                  Excellent performance! Focus on maintaining
                                  competitive advantages
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Financial Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={monthlyTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip
                            formatter={(value: number, name: string) => [
                              formatCurrency(value),
                              name,
                            ]}
                            labelFormatter={(label) => `Month: ${label}`}
                            contentStyle={{
                              fontSize: "12px",
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              padding: "8px",
                            }}
                            cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                          />
                          <Legend />
                          <Bar
                            dataKey="revenue"
                            fill="#3b82f6"
                            name="Revenue"
                          />
                          <Bar
                            dataKey="grossProfit"
                            fill="#22c55e"
                            name="Gross Profit"
                          />
                          <Line
                            type="monotone"
                            dataKey="operatingProfit"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            name="Operating Profit"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profitability" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profitability Ratios</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between items-center cursor-help">
                            <span>Gross Profit Margin</span>
                            <div className="flex items-center gap-2">
                              <span
                                className={getPerformanceColor(
                                  enhancedMetrics.grossProfitMargin,
                                  benchmark.grossMargin
                                )}
                              >
                                {formatPercent(
                                  enhancedMetrics.grossProfitMargin
                                )}
                              </span>
                              {getPerformanceIcon(
                                enhancedMetrics.grossProfitMargin,
                                benchmark.grossMargin
                              )}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {createKPITooltip(
                            "Gross Profit Margin",
                            "The percentage of revenue that remains after deducting the cost of goods sold. Indicates pricing power and production efficiency.",
                            "Gross Profit Margin = (Gross Profit / Revenue) × 100",
                            [
                              {
                                category: "Sales Revenue",
                                amount: formatCurrency(enhancedMetrics.revenue),
                              },
                              {
                                category: "Cost of Goods Sold",
                                amount: formatCurrency(enhancedMetrics.cogs),
                              },
                              {
                                category: "Gross Profit",
                                amount: formatCurrency(
                                  enhancedMetrics.grossProfit
                                ),
                              },
                            ]
                          )}
                        </TooltipContent>
                      </UITooltip>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between items-center cursor-help">
                            <span>Operating Margin</span>
                            <div className="flex items-center gap-2">
                              <span
                                className={getPerformanceColor(
                                  enhancedMetrics.operatingMargin,
                                  benchmark.operatingMargin
                                )}
                              >
                                {formatPercent(enhancedMetrics.operatingMargin)}
                              </span>
                              {getPerformanceIcon(
                                enhancedMetrics.operatingMargin,
                                benchmark.operatingMargin
                              )}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {createKPITooltip(
                            "Operating Margin",
                            "The percentage of revenue that remains after deducting operating expenses. Measures operational efficiency and profitability.",
                            "Operating Margin = (Operating Profit / Revenue) × 100",
                            [
                              {
                                category: "Sales Revenue",
                                amount: formatCurrency(enhancedMetrics.revenue),
                              },
                              {
                                category: "Operating Expenses",
                                amount: formatCurrency(
                                  enhancedMetrics.operatingExpenses
                                ),
                              },
                              {
                                category: "Operating Profit",
                                amount: formatCurrency(
                                  enhancedMetrics.operatingProfit
                                ),
                              },
                            ]
                          )}
                        </TooltipContent>
                      </UITooltip>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between items-center cursor-help">
                            <span>Net Profit Margin</span>
                            <div className="flex items-center gap-2">
                              <span
                                className={getPerformanceColor(
                                  enhancedMetrics.netProfitMargin,
                                  benchmark.netMargin
                                )}
                              >
                                {formatPercent(enhancedMetrics.netProfitMargin)}
                              </span>
                              {getPerformanceIcon(
                                enhancedMetrics.netProfitMargin,
                                benchmark.netMargin
                              )}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {createKPITooltip(
                            "Net Profit Margin",
                            "The percentage of revenue that remains as net profit after all expenses including taxes. Shows overall profitability.",
                            "Net Profit Margin = (Net Profit After Tax / Revenue) × 100",
                            [
                              {
                                category: "Sales Revenue",
                                amount: formatCurrency(enhancedMetrics.revenue),
                              },
                              {
                                category: "Net Profit After Tax",
                                amount: formatCurrency(
                                  enhancedMetrics.netProfitAfterTax
                                ),
                              },
                            ]
                          )}
                        </TooltipContent>
                      </UITooltip>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between items-center cursor-help">
                            <span>EBITDA Margin</span>
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600">
                                {formatPercent(enhancedMetrics.ebitdaMargin)}
                              </span>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {createKPITooltip(
                            "EBITDA Margin",
                            "Earnings Before Interest, Taxes, Depreciation, and Amortization as a percentage of revenue. Measures operational profitability excluding financing and accounting decisions.",
                            "EBITDA Margin = ((Operating Profit + Depreciation + Amortization) / Revenue) × 100",
                            [
                              {
                                category: "Sales Revenue",
                                amount: formatCurrency(enhancedMetrics.revenue),
                              },
                              {
                                category: "Operating Profit",
                                amount: formatCurrency(
                                  enhancedMetrics.operatingProfit
                                ),
                              },
                              {
                                category: "EBITDA (estimated)",
                                amount: formatCurrency(
                                  enhancedMetrics.operatingProfit + 5000
                                ),
                              },
                            ]
                          )}
                        </TooltipContent>
                      </UITooltip>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between items-center cursor-help">
                            <span>Return on Sales</span>
                            <div className="flex items-center gap-2">
                              <span className="text-purple-600">
                                {formatPercent(enhancedMetrics.returnOnSales)}
                              </span>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {createKPITooltip(
                            "Return on Sales",
                            "Measures the company's profitability relative to its sales revenue. Shows how efficiently the company converts sales into profits.",
                            "Return on Sales = (Net Profit After Tax / Revenue) × 100",
                            [
                              {
                                category: "Sales Revenue",
                                amount: formatCurrency(enhancedMetrics.revenue),
                              },
                              {
                                category: "Net Profit After Tax",
                                amount: formatCurrency(
                                  enhancedMetrics.netProfitAfterTax
                                ),
                              },
                            ]
                          )}
                        </TooltipContent>
                      </UITooltip>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between items-center cursor-help">
                            <span>Return on Equity</span>
                            <div className="flex items-center gap-2">
                              <span className="text-teal-600">
                                {formatPercent(enhancedMetrics.returnOnEquity)}
                              </span>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {createKPITooltip(
                            "Return on Equity",
                            "Measures the profitability of a company in relation to shareholders' equity. Shows how effectively the company uses equity to generate profits.",
                            "Return on Equity = (Net Profit After Tax / Shareholders' Equity) × 100",
                            [
                              {
                                category: "Net Profit After Tax",
                                amount: formatCurrency(
                                  enhancedMetrics.netProfitAfterTax
                                ),
                              },
                              {
                                category: "Shareholders' Equity (estimated)",
                                amount: formatCurrency(
                                  enhancedMetrics.revenue * 0.4
                                ),
                              },
                            ]
                          )}
                        </TooltipContent>
                      </UITooltip>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Profitability Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Main Profitability Score */}
                        <div className="text-center">
                          <div className="relative inline-block">
                            <div className="w-32 h-32 relative">
                              <svg
                                className="w-32 h-32 transform -rotate-90"
                                viewBox="0 0 100 100"
                              >
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  stroke="currentColor"
                                  strokeWidth="8"
                                  fill="transparent"
                                  className="text-gray-200"
                                />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  stroke={
                                    enhancedMetrics.overallPerformanceScore >=
                                    80
                                      ? "#10b981"
                                      : enhancedMetrics.overallPerformanceScore >=
                                        60
                                      ? "#3b82f6"
                                      : enhancedMetrics.overallPerformanceScore >=
                                        40
                                      ? "#f59e0b"
                                      : "#ef4444"
                                  }
                                  strokeWidth="8"
                                  fill="transparent"
                                  strokeDasharray={251.2}
                                  strokeDashoffset={(() => {
                                    const score = Number.isFinite(
                                      enhancedMetrics.overallPerformanceScore
                                    )
                                      ? Math.max(
                                          0,
                                          Math.min(
                                            100,
                                            enhancedMetrics.overallPerformanceScore
                                          )
                                        )
                                      : 0;
                                    return 251.2 - (score / 100) * 251.2;
                                  })()}
                                  className="transition-all duration-1000 ease-in-out"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-gray-900">
                                  {enhancedMetrics.overallPerformanceScore.toFixed(
                                    0
                                  )}
                                </span>
                                <span className="text-sm text-gray-600">
                                  Score
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            Overall Profitability Performance
                          </p>
                        </div>

                        {/* Individual Margin Gauges */}
                        <div className="grid grid-cols-3 gap-4">
                          {profitabilityData.map((item, index) => {
                            const colors = ["#10b981", "#3b82f6", "#8b5cf6"];
                            const safeItemValue = Number.isFinite(item.value)
                              ? item.value
                              : 0;
                            const percentage = Math.min(
                              Math.max(safeItemValue, 0),
                              100
                            );

                            return (
                              <div
                                key={`profitability-${item.name}-${index}`}
                                className="text-center"
                              >
                                <div className="relative inline-block">
                                  <div className="w-32 h-32 relative">
                                    <svg
                                      className="w-32 h-32 transform -rotate-90"
                                      viewBox="0 0 100 100"
                                    >
                                      <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        fill="transparent"
                                        className="text-gray-200"
                                      />
                                      <circle
                                        cx="50"
                                        cy="50"
                                        r="35"
                                        stroke={colors[index]}
                                        strokeWidth="6"
                                        fill="transparent"
                                        strokeDasharray={2 * Math.PI * 35}
                                        strokeDashoffset={
                                          2 * Math.PI * 35 -
                                          (percentage / 100) *
                                            (2 * Math.PI * 35)
                                        }
                                        className="transition-all duration-1000 ease-in-out"
                                      />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                      <span className="text-2xl font-bold text-gray-900">
                                        {item.value.toFixed(1)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-center mt-2">
                                  <div className="text-sm font-medium text-gray-700 mb-1">
                                    {item.name}
                                  </div>
                                  <div className="flex items-center justify-center">
                                    {getPerformanceIcon(item.value, {
                                      min: item.min,
                                      avg: item.benchmark,
                                      max: item.max,
                                    })}
                                    <span className="text-xs text-gray-500 ml-1">
                                      vs {item.benchmark.toFixed(1)}% avg
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Trend Indicators */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                            <div className="flex items-center justify-center mb-2">
                              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                              <span className="text-sm font-semibold text-green-800">
                                Growth Trend
                              </span>
                            </div>
                            <p className="text-2xl font-bold text-green-700">
                              {enhancedMetrics.profitGrowthRate > 0 ? "+" : ""}
                              {enhancedMetrics.profitGrowthRate.toFixed(1)}%
                            </p>
                            <p className="text-xs text-green-600">
                              Profit Growth Rate
                            </p>
                          </div>

                          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                            <div className="flex items-center justify-center mb-2">
                              <Target className="h-5 w-5 text-blue-600 mr-2" />
                              <span className="text-sm font-semibold text-blue-800">
                                Efficiency
                              </span>
                            </div>
                            <p className="text-2xl font-bold text-blue-700">
                              {enhancedMetrics.returnOnSales.toFixed(1)}%
                            </p>
                            <p className="text-xs text-blue-600">
                              Return on Sales
                            </p>
                          </div>
                        </div>

                        {/* Performance Summary */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Performance Rank
                              </p>
                              <p className="text-xs text-gray-600">
                                vs Industry Benchmark
                              </p>
                            </div>
                            <Badge
                              variant={
                                enhancedMetrics.industryComparison
                                  .performanceRank === "Excellent"
                                  ? "default"
                                  : enhancedMetrics.industryComparison
                                      .performanceRank === "Good"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {
                                enhancedMetrics.industryComparison
                                  .performanceRank
                              }
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="liquidity" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Liquidity Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={liquidityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              formatter={(value: number, name: string) => [
                                `${value.toFixed(2)}x`,
                                name,
                              ]}
                              labelFormatter={(label) => `Ratio: ${label}`}
                              contentStyle={{
                                fontSize: "12px",
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                padding: "8px",
                              }}
                              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#3b82f6" name="Actual" />
                            <Bar
                              dataKey="target"
                              fill="#22c55e"
                              name="Target"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Liquidity Health Check</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <div className="flex justify-between items-center">
                                <span>Current Ratio</span>
                                <div className="flex items-center gap-2">
                                  {isEmpty ? (
                                    <>
                                      <span className="text-gray-500">N/A</span>
                                      <Database className="h-4 w-4 text-gray-500" />
                                    </>
                                  ) : (
                                    <>
                                      <span
                                        className={
                                          enhancedMetrics.currentRatio >= 2.0
                                            ? "text-green-600"
                                            : enhancedMetrics.currentRatio >=
                                              1.5
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                        }
                                      >
                                        {enhancedMetrics.currentRatio.toFixed(
                                          2
                                        )}
                                      </span>
                                      {enhancedMetrics.currentRatio >= 1.5 ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {isEmpty
                                  ? "No data available"
                                  : "Target: ≥ 2.0 (Good liquidity)"}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {createKPITooltip(
                              "Current Ratio",
                              "Measures the company's ability to pay short-term obligations with current assets. Higher ratios indicate better liquidity.",
                              "Current Ratio = Current Assets / Current Liabilities",
                              [
                                {
                                  category: "Current Assets (estimated)",
                                  amount: formatCurrency(
                                    enhancedMetrics.revenue * 0.3
                                  ),
                                },
                                {
                                  category: "Current Liabilities (estimated)",
                                  amount: formatCurrency(
                                    enhancedMetrics.revenue * 0.2
                                  ),
                                },
                                {
                                  category: "Current Ratio",
                                  amount:
                                    enhancedMetrics.currentRatio.toFixed(2),
                                },
                              ]
                            )}
                          </TooltipContent>
                        </UITooltip>

                        <UITooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <div className="flex justify-between items-center">
                                <span>Quick Ratio</span>
                                <div className="flex items-center gap-2">
                                  {isEmpty ? (
                                    <>
                                      <span className="text-gray-500">N/A</span>
                                      <Database className="h-4 w-4 text-gray-500" />
                                    </>
                                  ) : (
                                    <>
                                      <span
                                        className={
                                          enhancedMetrics.quickRatio >= 1.5
                                            ? "text-green-600"
                                            : enhancedMetrics.quickRatio >= 1.0
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                        }
                                      >
                                        {enhancedMetrics.quickRatio.toFixed(2)}
                                      </span>
                                      {enhancedMetrics.quickRatio >= 1.0 ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {isEmpty
                                  ? "No data available"
                                  : "Target: ≥ 1.0 (Adequate liquidity)"}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {createKPITooltip(
                              "Quick Ratio",
                              "Measures the company's ability to pay short-term obligations with quick assets (cash, marketable securities, accounts receivable). More conservative than current ratio.",
                              "Quick Ratio = (Cash + Marketable Securities + Accounts Receivable) / Current Liabilities",
                              [
                                {
                                  category: "Quick Assets (estimated)",
                                  amount: formatCurrency(
                                    enhancedMetrics.revenue * 0.25
                                  ),
                                },
                                {
                                  category: "Current Liabilities (estimated)",
                                  amount: formatCurrency(
                                    enhancedMetrics.revenue * 0.2
                                  ),
                                },
                                {
                                  category: "Quick Ratio",
                                  amount: enhancedMetrics.quickRatio.toFixed(2),
                                },
                              ]
                            )}
                          </TooltipContent>
                        </UITooltip>

                        <UITooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <div className="flex justify-between items-center">
                                <span>Cash Ratio</span>
                                <div className="flex items-center gap-2">
                                  {isEmpty ? (
                                    <>
                                      <span className="text-gray-500">N/A</span>
                                      <Database className="h-4 w-4 text-gray-500" />
                                    </>
                                  ) : (
                                    <>
                                      <span
                                        className={
                                          enhancedMetrics.cashRatio >= 0.5
                                            ? "text-green-600"
                                            : enhancedMetrics.cashRatio >= 0.2
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                        }
                                      >
                                        {enhancedMetrics.cashRatio.toFixed(2)}
                                      </span>
                                      {enhancedMetrics.cashRatio >= 0.2 ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {isEmpty
                                  ? "No data available"
                                  : "Target: ≥ 0.2 (Minimal cash coverage)"}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {createKPITooltip(
                              "Cash Ratio",
                              "Measures the company's ability to pay short-term obligations with cash and cash equivalents only. Most conservative liquidity measure.",
                              "Cash Ratio = (Cash + Cash Equivalents) / Current Liabilities",
                              [
                                {
                                  category:
                                    "Cash & Cash Equivalents (estimated)",
                                  amount: formatCurrency(
                                    enhancedMetrics.revenue * 0.1
                                  ),
                                },
                                {
                                  category: "Current Liabilities (estimated)",
                                  amount: formatCurrency(
                                    enhancedMetrics.revenue * 0.2
                                  ),
                                },
                                {
                                  category: "Cash Ratio",
                                  amount: enhancedMetrics.cashRatio.toFixed(2),
                                },
                              ]
                            )}
                          </TooltipContent>
                        </UITooltip>

                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm font-medium text-blue-800">
                            Liquidity Assessment
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            {isEmpty
                              ? "No financial data available for assessment"
                              : enhancedMetrics.currentRatio >= 2.0 &&
                                enhancedMetrics.quickRatio >= 1.0
                              ? "Excellent liquidity position"
                              : enhancedMetrics.currentRatio >= 1.5 &&
                                enhancedMetrics.quickRatio >= 0.8
                              ? "Good liquidity position"
                              : "Consider improving liquidity"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="efficiency" className="space-y-4">
                {/* Efficiency Gauges */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Revenue/Employee"
                          value={enhancedMetrics.revenuePerEmployee / 1000}
                          max={500}
                          color="#f97316"
                          suffix="K"
                          size="small"
                          noData={isEmpty}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Revenue per Employee",
                        "Measures the average revenue generated per employee. Indicates workforce productivity and operational efficiency.",
                        "Revenue per Employee = Total Revenue / Number of Employees",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Revenue per Employee",
                            amount: formatCurrency(
                              enhancedMetrics.revenuePerEmployee
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Cost Efficiency"
                          value={100 - enhancedMetrics.totalExpenseRatio}
                          max={100}
                          color="#10b981"
                          suffix="%"
                          size="small"
                          noData={isEmpty}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Cost Efficiency",
                        "The percentage of revenue that remains after all costs. Higher percentages indicate better cost management.",
                        "Cost Efficiency = (1 - Total Expense Ratio) × 100",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Total Expenses",
                            amount: formatCurrency(
                              enhancedMetrics.cogs +
                                enhancedMetrics.operatingExpenses
                            ),
                          },
                          {
                            category: "Cost Efficiency",
                            amount: formatPercent(
                              100 - enhancedMetrics.totalExpenseRatio
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Margin Safety"
                          value={enhancedMetrics.marginOfSafety}
                          max={50}
                          color="#6366f1"
                          suffix="%"
                          size="small"
                          noData={isEmpty}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Margin of Safety",
                        "The percentage by which current revenue exceeds break-even revenue. Higher percentages indicate greater financial safety.",
                        "Margin of Safety = ((Revenue - Break-Even Revenue) / Revenue) × 100",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Break-Even Revenue",
                            amount: formatCurrency(
                              enhancedMetrics.breakEvenRevenue
                            ),
                          },
                          {
                            category: "Margin of Safety",
                            amount: formatPercent(
                              enhancedMetrics.marginOfSafety
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Operating Leverage"
                          value={enhancedMetrics.operatingLeverage}
                          max={5}
                          color="#ec4899"
                          suffix="x"
                          size="small"
                          noData={isEmpty}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Operating Leverage",
                        "Measures how sensitive operating income is to changes in sales volume. Higher leverage means greater profit sensitivity to sales changes.",
                        "Operating Leverage = 1 / Contribution Margin Ratio",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Variable Costs (COGS)",
                            amount: formatCurrency(enhancedMetrics.cogs),
                          },
                          {
                            category: "Operating Leverage",
                            amount: `${enhancedMetrics.operatingLeverage.toFixed(
                              2
                            )}x`,
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Cash Conversion"
                          value={Math.max(
                            0,
                            100 - enhancedMetrics.cashConversionCycle
                          )}
                          max={100}
                          color="#14b8a6"
                          suffix="%"
                          size="small"
                          noData={isEmpty}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Cash Conversion Efficiency",
                        "Measures how efficiently the company converts its investments in inventory and receivables into cash. Higher percentages indicate better cash management.",
                        "Cash Conversion Efficiency = (1 - Cash Conversion Cycle / 365) × 100",
                        [
                          {
                            category: "Cash Conversion Cycle",
                            amount: `${enhancedMetrics.cashConversionCycle.toFixed(
                              0
                            )} days`,
                          },
                          {
                            category: "Cash Conversion Efficiency",
                            amount: formatPercent(
                              Math.max(
                                0,
                                100 - enhancedMetrics.cashConversionCycle
                              )
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Asset Efficiency Ratios</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={efficiencyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              formatter={(value: number, name: string) => [
                                `${value.toFixed(2)}x`,
                                name || "Turnover",
                              ]}
                              labelFormatter={(label) => `Metric: ${label}`}
                              contentStyle={{
                                fontSize: "12px",
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                padding: "8px",
                              }}
                              cursor={{ fill: "rgba(139, 92, 246, 0.1)" }}
                            />
                            <Bar dataKey="value" fill="#8b5cf6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Efficiency Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between items-center cursor-help">
                            <span>Asset Turnover</span>
                            <span className="font-medium">
                              {isEmpty
                                ? "N/A"
                                : `${enhancedMetrics.assetTurnover.toFixed(
                                    2
                                  )}x`}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {createKPITooltip(
                            "Asset Turnover",
                            "Measures how efficiently the company uses its assets to generate revenue. Higher ratios indicate better asset utilization.",
                            "Asset Turnover = Revenue / Total Assets",
                            [
                              {
                                category: "Sales Revenue",
                                amount: formatCurrency(enhancedMetrics.revenue),
                              },
                              {
                                category: "Total Assets (estimated)",
                                amount: formatCurrency(
                                  enhancedMetrics.revenue * 0.5
                                ),
                              },
                              {
                                category: "Asset Turnover",
                                amount: `${enhancedMetrics.assetTurnover.toFixed(
                                  2
                                )}x`,
                              },
                            ]
                          )}
                        </TooltipContent>
                      </UITooltip>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between items-center cursor-help">
                            <span>Inventory Turnover</span>
                            <span className="font-medium">
                              {isEmpty
                                ? "N/A"
                                : `${enhancedMetrics.inventoryTurnover.toFixed(
                                    2
                                  )}x`}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {createKPITooltip(
                            "Inventory Turnover",
                            "Measures how many times inventory is sold and replaced during a period. Higher ratios indicate better inventory management.",
                            "Inventory Turnover = Cost of Goods Sold / Average Inventory",
                            [
                              {
                                category: "Cost of Goods Sold",
                                amount: formatCurrency(enhancedMetrics.cogs),
                              },
                              {
                                category: "Average Inventory (estimated)",
                                amount: formatCurrency(
                                  enhancedMetrics.cogs /
                                    enhancedMetrics.inventoryTurnover
                                ),
                              },
                              {
                                category: "Inventory Turnover",
                                amount: `${enhancedMetrics.inventoryTurnover.toFixed(
                                  2
                                )}x`,
                              },
                            ]
                          )}
                        </TooltipContent>
                      </UITooltip>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between items-center cursor-help">
                            <span>Receivables Turnover</span>
                            <span className="font-medium">
                              {isEmpty
                                ? "N/A"
                                : `${enhancedMetrics.receivablesTurnover.toFixed(
                                    2
                                  )}x`}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {createKPITooltip(
                            "Receivables Turnover",
                            "Measures how efficiently the company collects its accounts receivable. Higher ratios indicate faster collection.",
                            "Receivables Turnover = Revenue / Average Accounts Receivable",
                            [
                              {
                                category: "Sales Revenue",
                                amount: formatCurrency(enhancedMetrics.revenue),
                              },
                              {
                                category: "Average Receivables (estimated)",
                                amount: formatCurrency(
                                  enhancedMetrics.revenue /
                                    enhancedMetrics.receivablesTurnover
                                ),
                              },
                              {
                                category: "Receivables Turnover",
                                amount: `${enhancedMetrics.receivablesTurnover.toFixed(
                                  2
                                )}x`,
                              },
                            ]
                          )}
                        </TooltipContent>
                      </UITooltip>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between items-center cursor-help">
                            <span>Working Capital Turnover</span>
                            <span className="font-medium">
                              {isEmpty
                                ? "N/A"
                                : `${enhancedMetrics.workingCapitalTurnover.toFixed(
                                    2
                                  )}x`}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {createKPITooltip(
                            "Working Capital Turnover",
                            "Measures how efficiently the company uses its working capital to generate revenue. Higher ratios indicate better working capital management.",
                            "Working Capital Turnover = Revenue / Working Capital",
                            [
                              {
                                category: "Sales Revenue",
                                amount: formatCurrency(enhancedMetrics.revenue),
                              },
                              {
                                category: "Working Capital (estimated)",
                                amount: formatCurrency(
                                  enhancedMetrics.revenue /
                                    enhancedMetrics.workingCapitalTurnover
                                ),
                              },
                              {
                                category: "Working Capital Turnover",
                                amount: `${enhancedMetrics.workingCapitalTurnover.toFixed(
                                  2
                                )}x`,
                              },
                            ]
                          )}
                        </TooltipContent>
                      </UITooltip>

                      <div className="mt-4 space-y-2">
                        <div className="text-sm font-medium">
                          Days Outstanding:
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="font-medium">
                              {isEmpty ||
                              enhancedMetrics.receivablesTurnover === 0
                                ? "N/A"
                                : (
                                    365 / enhancedMetrics.receivablesTurnover
                                  ).toFixed(0)}
                            </div>
                            <div className="text-muted-foreground">DSO</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="font-medium">
                              {isEmpty ||
                              enhancedMetrics.inventoryTurnover === 0
                                ? "N/A"
                                : (
                                    365 / enhancedMetrics.inventoryTurnover
                                  ).toFixed(0)}
                            </div>
                            <div className="text-muted-foreground">DIO</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <div className="font-medium">
                              {isEmpty || enhancedMetrics.payablesTurnover === 0
                                ? "N/A"
                                : (
                                    365 / enhancedMetrics.payablesTurnover
                                  ).toFixed(0)}
                            </div>
                            <div className="text-muted-foreground">DPO</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="growth" className="space-y-4">
                {/* Growth Gauges */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Revenue Growth"
                          value={enhancedMetrics.revenueGrowthRate}
                          max={50}
                          color="#8b5cf6"
                          suffix="%"
                          size="medium"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Revenue Growth Rate",
                        "The percentage increase in revenue over a specified period. Indicates business expansion and market demand.",
                        "Revenue Growth = ((Current Revenue - Previous Revenue) / Previous Revenue) × 100",
                        [
                          {
                            category: "Current Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Revenue Growth Rate",
                            amount: formatPercent(
                              enhancedMetrics.revenueGrowthRate
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Profit Growth"
                          value={enhancedMetrics.profitGrowthRate}
                          max={50}
                          color="#f59e0b"
                          suffix="%"
                          size="medium"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Profit Growth Rate",
                        "The percentage increase in operating profit over a specified period. Indicates improving profitability.",
                        "Profit Growth = ((Current Operating Profit - Previous Operating Profit) / Previous Operating Profit) × 100",
                        [
                          {
                            category: "Current Operating Profit",
                            amount: formatCurrency(
                              enhancedMetrics.operatingProfit
                            ),
                          },
                          {
                            category: "Profit Growth Rate",
                            amount: formatPercent(
                              enhancedMetrics.profitGrowthRate
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="QoQ Growth"
                          value={enhancedMetrics.quarterOverQuarterGrowth}
                          max={25}
                          color="#22c55e"
                          suffix="%"
                          size="medium"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Quarter-over-Quarter Growth",
                        "The percentage change in revenue from one quarter to the next. Shows short-term growth trends.",
                        "QoQ Growth = ((Q4 Revenue - Q1 Revenue) / Q1 Revenue) × 100",
                        [
                          {
                            category: "Q4 Revenue",
                            amount: formatCurrency(
                              enhancedMetrics.revenue * 0.3
                            ),
                          },
                          {
                            category: "Q1 Revenue",
                            amount: formatCurrency(
                              enhancedMetrics.revenue * 0.2
                            ),
                          },
                          {
                            category: "QoQ Growth",
                            amount: formatPercent(
                              enhancedMetrics.quarterOverQuarterGrowth
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Monthly Avg"
                          value={enhancedMetrics.averageMonthlyGrowth}
                          max={10}
                          color="#06b6d4"
                          suffix="%"
                          size="medium"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Average Monthly Growth",
                        "The average monthly growth rate calculated from the annual growth rate. Shows consistent growth patterns.",
                        "Average Monthly Growth = Annual Growth Rate / 12",
                        [
                          {
                            category: "Annual Growth Rate",
                            amount: formatPercent(
                              enhancedMetrics.revenueGrowthRate
                            ),
                          },
                          {
                            category: "Average Monthly Growth",
                            amount: formatPercent(
                              enhancedMetrics.averageMonthlyGrowth
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Growth Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={growthData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              formatter={(value: number, name: string) => [
                                `${value.toFixed(1)}%`,
                                name || "Growth",
                              ]}
                              labelFormatter={(label) => `Metric: ${label}`}
                              contentStyle={{
                                fontSize: "12px",
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                padding: "8px",
                              }}
                              cursor={{ fill: "rgba(6, 182, 212, 0.1)" }}
                            />
                            <Bar dataKey="value">
                              {growthData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Growth Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {growthData.map((metric, index) => (
                          <div
                            key={`growth-${metric.name}-${index}`}
                            className="flex justify-between items-center"
                          >
                            <span>{metric.name}</span>
                            <div className="flex items-center gap-2">
                              <span
                                className={
                                  metric.value > 0
                                    ? "text-green-600"
                                    : metric.value < 0
                                    ? "text-red-600"
                                    : "text-gray-600"
                                }
                              >
                                {metric.value > 0 ? "+" : ""}
                                {metric.value.toFixed(1)}%
                              </span>
                              {metric.value > 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : metric.value < 0 ? (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              ) : (
                                <div className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                        ))}

                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <div className="text-sm font-medium text-green-800">
                            Growth Assessment
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            {enhancedMetrics.revenueGrowthRate >
                            benchmark.revenueGrowth.avg
                              ? "Revenue growth exceeds industry average"
                              : "Revenue growth below industry average"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                {/* Industry Insights Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Industry Insights & Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Industry Description */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">
                            Industry Profile
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {benchmark.description}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2">
                            Company Size
                          </h4>
                          <Badge variant="outline" className="capitalize">
                            {selectedCompanySize}
                          </Badge>
                        </div>
                      </div>

                      {/* Risk Factors */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">
                          Key Risk Factors
                        </h4>
                        <ul className="space-y-1">
                          {benchmark.riskFactors.map((risk, index) => (
                            <li
                              key={`risk-${risk}-${index}`}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Key Drivers */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">
                          Success Drivers
                        </h4>
                        <ul className="space-y-1">
                          {benchmark.keyDrivers.map((driver, index) => (
                            <li
                              key={`driver-${driver}-${index}`}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              {driver}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-3 text-blue-800">
                        Strategic Recommendations
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {benchmark.recommendations.map((rec, index) => (
                          <div
                            key={`rec-${rec}-${index}`}
                            className="flex items-start gap-2"
                          >
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-blue-700">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk & Performance Gauges */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Business Risk"
                          value={100 - enhancedMetrics.businessRiskScore}
                          max={100}
                          color={
                            enhancedMetrics.businessRiskScore > 70
                              ? "#ef4444"
                              : enhancedMetrics.businessRiskScore > 40
                              ? "#f59e0b"
                              : "#22c55e"
                          }
                          suffix="%"
                          size="small"
                          inverted
                          noData={isEmpty}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Business Risk Score",
                        "A composite risk score based on revenue volatility and other risk factors. Lower scores indicate higher risk.",
                        "Business Risk Score = Risk factors based on revenue volatility and stability",
                        [
                          {
                            category: "Revenue Volatility",
                            amount: formatPercent(
                              enhancedMetrics.revenueVolatility
                            ),
                          },
                          {
                            category: "Business Risk Score",
                            amount: `${enhancedMetrics.businessRiskScore}/100`,
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Revenue Stability"
                          value={100 - enhancedMetrics.revenueVolatility * 10}
                          max={100}
                          color="#14b8a6"
                          suffix="%"
                          size="small"
                          noData={isEmpty}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Revenue Stability",
                        "Measures the consistency of revenue over time. Higher percentages indicate more stable revenue streams.",
                        "Revenue Stability = (1 - Revenue Volatility) × 100",
                        [
                          {
                            category: "Revenue Volatility",
                            amount: formatPercent(
                              enhancedMetrics.revenueVolatility
                            ),
                          },
                          {
                            category: "Revenue Stability",
                            amount: formatPercent(
                              100 - enhancedMetrics.revenueVolatility * 10
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Profit Stability"
                          value={100 - enhancedMetrics.profitVolatility * 10}
                          max={100}
                          color="#8b5cf6"
                          suffix="%"
                          size="small"
                          noData={isEmpty}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Profit Stability",
                        "Measures the consistency of operating profit over time. Higher percentages indicate more stable profitability.",
                        "Profit Stability = (1 - Profit Volatility) × 100",
                        [
                          {
                            category: "Profit Volatility",
                            amount: formatPercent(
                              enhancedMetrics.profitVolatility
                            ),
                          },
                          {
                            category: "Profit Stability",
                            amount: formatPercent(
                              100 - enhancedMetrics.profitVolatility * 10
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Seasonality"
                          value={enhancedMetrics.seasonalityIndex * 100}
                          max={200}
                          color="#f97316"
                          suffix="%"
                          size="small"
                          noData={isEmpty}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Seasonality Index",
                        "Measures the degree of seasonal variation in revenue. Higher values indicate more pronounced seasonal patterns.",
                        "Seasonality Index = Revenue volatility × 100",
                        [
                          {
                            category: "Revenue Volatility",
                            amount: formatPercent(
                              enhancedMetrics.revenueVolatility
                            ),
                          },
                          {
                            category: "Seasonality Index",
                            amount: formatPercent(
                              enhancedMetrics.seasonalityIndex * 100
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Break-even Safety"
                          value={
                            ((enhancedMetrics.revenue -
                              enhancedMetrics.breakEvenRevenue) /
                              enhancedMetrics.revenue) *
                            100
                          }
                          max={100}
                          color="#06b6d4"
                          suffix="%"
                          size="small"
                          noData={isEmpty}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Break-even Safety Margin",
                        "The percentage by which current revenue exceeds break-even revenue. Higher percentages indicate greater financial safety.",
                        "Break-even Safety = ((Revenue - Break-even Revenue) / Revenue) × 100",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Break-even Revenue",
                            amount: formatCurrency(
                              enhancedMetrics.breakEvenRevenue
                            ),
                          },
                          {
                            category: "Safety Margin",
                            amount: formatPercent(
                              ((enhancedMetrics.revenue -
                                enhancedMetrics.breakEvenRevenue) /
                                enhancedMetrics.revenue) *
                                100
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <PerformanceGauge
                          title="Cash Flow Health"
                          value={Math.min(
                            100,
                            (enhancedMetrics.operatingCashFlowProxy /
                              enhancedMetrics.revenue) *
                              100
                          )}
                          max={100}
                          color="#10b981"
                          suffix="%"
                          size="small"
                          noData={isEmpty}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {createKPITooltip(
                        "Cash Flow Health",
                        "Measures the proportion of revenue that converts to operating cash flow. Higher percentages indicate better cash generation.",
                        "Cash Flow Health = (Operating Cash Flow / Revenue) × 100",
                        [
                          {
                            category: "Operating Cash Flow",
                            amount: formatCurrency(
                              enhancedMetrics.operatingCashFlowProxy
                            ),
                          },
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Cash Flow Health",
                            amount: formatPercent(
                              Math.min(
                                100,
                                (enhancedMetrics.operatingCashFlowProxy /
                                  enhancedMetrics.revenue) *
                                  100
                              )
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Break-Even Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">
                              {isEmpty
                                ? "N/A"
                                : formatCurrency(
                                    enhancedMetrics.breakEvenPoint * 1000
                                  )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Monthly Break-Even
                            </div>
                            <div className="mt-3 text-xs">
                              <div>
                                Margin of Safety:{" "}
                                {isEmpty
                                  ? "N/A"
                                  : formatPercent(
                                      enhancedMetrics.marginOfSafety
                                    )}
                              </div>
                              <div>
                                Operating Leverage:{" "}
                                {isEmpty
                                  ? "N/A"
                                  : `${enhancedMetrics.operatingLeverage.toFixed(
                                      2
                                    )}x`}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      {createKPITooltip(
                        "Break-Even Analysis",
                        "Minimum revenue required to cover all costs. Shows business sustainability and financial health.",
                        "Break-Even = Fixed Costs ÷ (1 - Variable Cost %)\nMargin of Safety = (Revenue - Break-Even) ÷ Revenue\nOperating Leverage = Contribution Margin ÷ Operating Profit",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "COGS",
                            amount: formatCurrency(enhancedMetrics.cogs),
                          },
                          {
                            category: "Operating Expenses",
                            amount: formatCurrency(
                              enhancedMetrics.operatingExpenses
                            ),
                          },
                          {
                            category: "Operating Profit",
                            amount: formatCurrency(
                              enhancedMetrics.operatingProfit
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>

                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Cash Runway</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">
                              {isEmpty
                                ? "N/A"
                                : enhancedMetrics.runwayMonths.toFixed(0)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Months Remaining
                            </div>
                            <div className="mt-3 text-xs">
                              <div>
                                Burn Rate:{" "}
                                {isEmpty
                                  ? "N/A"
                                  : `${formatCurrency(
                                      enhancedMetrics.burnRate
                                    )}/month`}
                              </div>
                              <Badge
                                variant={
                                  isEmpty
                                    ? "outline"
                                    : enhancedMetrics.runwayMonths > 12
                                    ? "default"
                                    : "destructive"
                                }
                                className="mt-2"
                              >
                                {isEmpty
                                  ? "No Data"
                                  : enhancedMetrics.runwayMonths > 18
                                  ? "Very Safe"
                                  : enhancedMetrics.runwayMonths > 12
                                  ? "Safe"
                                  : enhancedMetrics.runwayMonths > 6
                                  ? "Caution"
                                  : "Critical"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      {createKPITooltip(
                        "Cash Runway",
                        "How long the business can operate with current cash. Critical for cash flow planning and survival.",
                        "Runway = Current Cash ÷ Monthly Burn Rate\nBurn Rate = Monthly Expenses - Monthly Revenue\nStatus: >18m (Safe), >12m (Good), >6m (Caution), ≤6m (Critical)",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Operating Expenses",
                            amount: formatCurrency(
                              enhancedMetrics.operatingExpenses
                            ),
                          },
                          {
                            category: "Operating Profit",
                            amount: formatCurrency(
                              enhancedMetrics.operatingProfit
                            ),
                          },
                          {
                            category: "Net Profit",
                            amount: formatCurrency(
                              enhancedMetrics.netProfitAfterTax
                            ),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>

                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Valuation Metrics
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span>P/E Ratio</span>
                              <span className="font-medium">
                                {isEmpty
                                  ? "N/A"
                                  : `${enhancedMetrics.priceToEarnings.toFixed(
                                      1
                                    )}x`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>P/B Ratio</span>
                              <span className="font-medium">
                                {isEmpty
                                  ? "N/A"
                                  : `${enhancedMetrics.priceToBook.toFixed(
                                      1
                                    )}x`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Enterprise Value</span>
                              <span className="font-medium">
                                {isEmpty
                                  ? "N/A"
                                  : formatCurrency(
                                      enhancedMetrics.enterpriseValue
                                    )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Market Cap</span>
                              <span className="font-medium">
                                {isEmpty
                                  ? "N/A"
                                  : formatCurrency(enhancedMetrics.marketCap)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      {createKPITooltip(
                        "Valuation Metrics",
                        "Key ratios to assess company value and investment potential. Used by investors and for strategic decisions.",
                        "P/E = Share Price ÷ Earnings per Share\nP/B = Share Price ÷ Book Value per Share\nEnterprise Value = Market Cap + Debt - Cash\nMarket Cap = Share Price × Total Shares",
                        [
                          {
                            category: "Sales Revenue",
                            amount: formatCurrency(enhancedMetrics.revenue),
                          },
                          {
                            category: "Net Profit",
                            amount: formatCurrency(
                              enhancedMetrics.netProfitAfterTax
                            ),
                          },
                          {
                            category: "Operating Profit",
                            amount: formatCurrency(
                              enhancedMetrics.operatingProfit
                            ),
                          },
                          {
                            category: "Gross Profit",
                            amount: formatCurrency(enhancedMetrics.grossProfit),
                          },
                        ]
                      )}
                    </TooltipContent>
                  </UITooltip>
                </div>

                {/* Performance Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                        <div className="font-medium text-green-800">
                          Strengths
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          Strong profitability ratios
                        </div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Target className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                        <div className="font-medium text-blue-800">
                          Opportunities
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          Improve asset efficiency
                        </div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <AlertCircle className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                        <div className="font-medium text-yellow-800">Watch</div>
                        <div className="text-xs text-yellow-600 mt-1">
                          Monitor cash runway
                        </div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <TrendingUp className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                        <div className="font-medium text-purple-800">
                          Growth
                        </div>
                        <div className="text-xs text-purple-600 mt-1">
                          Above industry average
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}

// Performance Gauge Component
interface PerformanceGaugeProps {
  title: string;
  value: number;
  max: number;
  color: string;
  suffix?: string;
  benchmark?: number;
  size?: "small" | "medium" | "large";
  inverted?: boolean;
  noData?: boolean;
}

function PerformanceGauge({
  title,
  value,
  max,
  color,
  suffix = "",
  benchmark,
  size = "medium",
  inverted = false,
  noData = false,
}: PerformanceGaugeProps) {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1;
  const percentage = Math.min(Math.max((safeValue / safeMax) * 100, 0), 100);
  const benchmarkPercentage =
    benchmark != null && Number.isFinite(benchmark)
      ? Math.min(Math.max((benchmark / safeMax) * 100, 0), 100)
      : null;

  const sizeConfig = {
    small: { width: 80, height: 80, strokeWidth: 6, fontSize: "text-xs" },
    medium: { width: 100, height: 100, strokeWidth: 8, fontSize: "text-sm" },
    large: { width: 120, height: 120, strokeWidth: 10, fontSize: "text-base" },
  };

  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const displayValue = inverted ? max - value : value;
  const performanceColor = inverted
    ? percentage > 70
      ? "#22c55e"
      : percentage > 40
      ? "#f59e0b"
      : "#ef4444"
    : percentage > 70
    ? "#22c55e"
    : percentage > 40
    ? "#f59e0b"
    : "#ef4444";

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className="relative"
        style={{ width: config.width, height: config.width }}
      >
        <svg
          width={config.width}
          height={config.width}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={config.strokeWidth}
          />

          {/* Benchmark line */}
          {benchmarkPercentage && !noData && (
            <circle
              cx={config.width / 2}
              cy={config.width / 2}
              r={radius}
              fill="none"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray={`${
                (benchmarkPercentage / 100) * circumference
              } ${circumference}`}
              strokeDashoffset={0}
              opacity={0.5}
            />
          )}

          {/* Progress circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke={
              noData ? "#9ca3af" : size === "large" ? color : performanceColor
            }
            strokeWidth={config.strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={noData ? circumference : strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-bold ${config.fontSize} leading-none`}>
            {noData
              ? "N/A"
              : `${displayValue.toFixed(displayValue < 10 ? 1 : 0)}${suffix}`}
          </div>
          {benchmark && !noData && (
            <div className="text-xs text-muted-foreground mt-1">
              vs {benchmark.toFixed(0)}
              {suffix}
            </div>
          )}
        </div>
      </div>

      <div
        className={`text-center ${config.fontSize} font-medium text-muted-foreground`}
      >
        {title}
      </div>

      {/* Performance indicator */}
      <div className="flex items-center gap-1">
        {noData ? (
          <>
            <Database className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-500">No Data</span>
          </>
        ) : percentage > 70 ? (
          <>
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600">Excellent</span>
          </>
        ) : percentage > 40 ? (
          <>
            <Clock className="h-3 w-3 text-yellow-600" />
            <span className="text-xs text-yellow-600">Good</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-3 w-3 text-red-600" />
            <span className="text-xs text-red-600">Needs Attention</span>
          </>
        )}
      </div>
    </div>
  );
}
