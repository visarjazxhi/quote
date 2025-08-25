export interface ReviewMetrics {
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingProfit: number;
  netProfitBeforeTax: number;
  taxExpense: number;
  netProfitAfterTax: number;
  grossMargin: number; // %
  operatingMargin: number; // %
  netMargin: number; // %
  expenseRatio: number; // % of revenue
  cogsRatio: number; // % of revenue
  breakEvenRevenue: number;
  breakEvenMonths: number;
  avgMonthlyRevenue: number;
  revenueVolatility: number; // %
  qoqGrowth: number; // %
  currency: string;
}

export interface ReviewDefinition {
  key:
    | "revenue"
    | "grossProfit"
    | "grossMargin"
    | "operatingProfit"
    | "operatingMargin"
    | "netProfit"
    | "netMargin"
    | "expenseRatio"
    | "cogsRatio"
    | "effectiveTaxRate"
    | "breakEvenRevenue"
    | "breakEvenMonths"
    | "avgMonthlyRevenue"
    | "revenueVolatility"
    | "qoqGrowth";
  title: string;
  group: "Executive" | "Profitability" | "Costs" | "Tax" | "Efficiency";
  description: string;
  formula: string;
  getValue: (m: ReviewMetrics) => string;
  tips: (m: ReviewMetrics) => string[];
}

export function getReviewDefinitions(): ReviewDefinition[] {
  return [
    {
      key: "revenue",
      title: "Total Revenue",
      group: "Executive",
      description:
        "All income generated from core operations during the period.",
      formula:
        "Revenue = Σ Sales Revenue (+ Other Operating Revenue if applicable)",
      getValue: (m) =>
        new Intl.NumberFormat("en-AU", {
          style: "currency",
          currency: m.currency,
          minimumFractionDigits: 0,
        }).format(m.revenue),
      tips: () => [
        "Identify top-performing months and replicate campaigns.",
        "Enhance cross-selling and up-selling from existing customers.",
        "Evaluate pricing strategy if growth is below expectations.",
      ],
    },
    {
      key: "grossProfit",
      title: "Gross Profit",
      group: "Profitability",
      description:
        "Revenue minus Cost of Goods Sold (COGS). Indicates value creation before overheads.",
      formula: "Gross Profit = Revenue − COGS",
      getValue: (m) =>
        new Intl.NumberFormat("en-AU", {
          style: "currency",
          currency: m.currency,
          minimumFractionDigits: 0,
        }).format(m.grossProfit),
      tips: () => [
        "Negotiate supplier terms and reduce wastage.",
        "Improve product mix towards higher-margin offerings.",
      ],
    },
    {
      key: "grossMargin",
      title: "Gross Margin",
      group: "Profitability",
      description:
        "Percentage of revenue remaining after COGS. Core pricing power & cost efficiency.",
      formula: "Gross Margin = (Revenue − COGS) / Revenue × 100",
      getValue: (m) => `${m.grossMargin.toFixed(1)}%`,
      tips: (m) => [
        m.grossMargin < 30
          ? "Review pricing and renegotiate supplier rates to lift margins."
          : "Maintain pricing discipline; monitor COGS creep.",
      ],
    },
    {
      key: "operatingProfit",
      title: "Operating Profit (EBIT)",
      group: "Profitability",
      description:
        "Profit after operating expenses, before interest and tax. Operational efficiency.",
      formula: "Operating Profit = Gross Profit − Operating Expenses",
      getValue: (m) =>
        new Intl.NumberFormat("en-AU", {
          style: "currency",
          currency: m.currency,
          minimumFractionDigits: 0,
        }).format(m.operatingProfit),
      tips: () => [
        "Cut low-ROI spend. Automate manual processes.",
        "Scale fixed costs carefully; track unit economics.",
      ],
    },
    {
      key: "operatingMargin",
      title: "Operating Margin",
      group: "Profitability",
      description:
        "Operating profit as a percentage of revenue. Core efficiency metric.",
      formula: "Operating Margin = Operating Profit / Revenue × 100",
      getValue: (m) => `${m.operatingMargin.toFixed(1)}%`,
      tips: (m) => [
        m.operatingMargin < 15
          ? "Streamline operations and reduce overhead to improve margins."
          : "Maintain process discipline; monitor cost drift.",
      ],
    },
    {
      key: "netProfit",
      title: "Net Profit After Tax",
      group: "Executive",
      description:
        "Bottom-line profit after all expenses and taxes. True earnings.",
      formula:
        "NPAT = Operating Profit + Other Income − Financial/Other Expenses − Tax",
      getValue: (m) =>
        new Intl.NumberFormat("en-AU", {
          style: "currency",
          currency: m.currency,
          minimumFractionDigits: 0,
        }).format(m.netProfitAfterTax),
      tips: () => [
        "Balance revenue growth with cost control for sustainable profit.",
      ],
    },
    {
      key: "netMargin",
      title: "Net Profit Margin",
      group: "Profitability",
      description:
        "Net profit as a percentage of revenue. Overall profitability health.",
      formula: "Net Margin = Net Profit / Revenue × 100",
      getValue: (m) => `${m.netMargin.toFixed(1)}%`,
      tips: (m) => [
        m.netMargin < 10
          ? "Grow revenue and trim non-essential costs to lift margins."
          : "Maintain profitability discipline and reinvest wisely.",
      ],
    },
    {
      key: "expenseRatio",
      title: "Operating Expense Ratio",
      group: "Costs",
      description:
        "Share of revenue consumed by operating expenses. Overhead efficiency.",
      formula: "OpEx Ratio = Operating Expenses / Revenue × 100",
      getValue: (m) => `${m.expenseRatio.toFixed(1)}%`,
      tips: (m) => [
        m.expenseRatio > 40
          ? "Introduce cost controls and review spend effectiveness."
          : "Keep monitoring cost base and productivity.",
      ],
    },
    {
      key: "cogsRatio",
      title: "COGS Ratio",
      group: "Costs",
      description:
        "Direct production costs as a percentage of revenue. Input cost pressure.",
      formula: "COGS Ratio = COGS / Revenue × 100",
      getValue: (m) => `${m.cogsRatio.toFixed(1)}%`,
      tips: (m) => [
        m.cogsRatio > 70
          ? "Negotiate suppliers, optimize production and reduce wastage."
          : "Continue to optimize sourcing and process efficiency.",
      ],
    },
    {
      key: "effectiveTaxRate",
      title: "Effective Tax Rate",
      group: "Tax",
      description:
        "Actual tax burden on pre-tax profits after deductions and credits.",
      formula: "Effective Tax Rate = Tax Expense / NPBT × 100",
      getValue: (m) =>
        `${(m.netProfitBeforeTax > 0
          ? (m.taxExpense / m.netProfitBeforeTax) * 100
          : 0
        ).toFixed(1)}%`,
      tips: (m) => [
        m.netProfitBeforeTax > 0 &&
        (m.taxExpense / m.netProfitBeforeTax) * 100 > 25
          ? "Explore tax incentives, timing of deductions, and structure."
          : "Maintain compliance and optimize legitimate deductions.",
      ],
    },
    {
      key: "breakEvenRevenue",
      title: "Break-even Revenue",
      group: "Efficiency",
      description:
        "Revenue needed to cover fixed costs at current contribution margin.",
      formula: "Break-even Revenue = Fixed Costs / Contribution Margin",
      getValue: (m) =>
        new Intl.NumberFormat("en-AU", {
          style: "currency",
          currency: m.currency,
          minimumFractionDigits: 0,
        }).format(m.breakEvenRevenue),
      tips: () => [
        "Increase contribution margin or reduce fixed costs to break even sooner.",
      ],
    },
    {
      key: "breakEvenMonths",
      title: "Break-even Months",
      group: "Efficiency",
      description:
        "Months required to reach break-even at current monthly revenue.",
      formula: "Break-even Months = Break-even Revenue / Avg Monthly Revenue",
      getValue: (m) => `${m.breakEvenMonths.toFixed(1)} months`,
      tips: () => [
        "Grow monthly revenue via acquisition/retention to shorten break-even time.",
      ],
    },
    {
      key: "avgMonthlyRevenue",
      title: "Average Monthly Revenue",
      group: "Efficiency",
      description: "Average revenue per month across the selected period.",
      formula: "Avg Monthly Revenue = Annual Revenue / 12",
      getValue: (m) =>
        new Intl.NumberFormat("en-AU", {
          style: "currency",
          currency: m.currency,
          minimumFractionDigits: 0,
        }).format(m.avgMonthlyRevenue),
      tips: () => [
        "Smooth seasonality via promotions, contracts, or subscriptions.",
      ],
    },
    {
      key: "revenueVolatility",
      title: "Revenue Volatility",
      group: "Efficiency",
      description:
        "Standard deviation of monthly revenue relative to average (stability).",
      formula:
        "Revenue Volatility = σ(monthly revenue) / avg(monthly revenue) × 100",
      getValue: (m) => `${m.revenueVolatility.toFixed(1)}%`,
      tips: (m) => [
        m.revenueVolatility > 20
          ? "Reduce volatility: diversify channels and stabilize demand."
          : "Stable revenue pattern; continue steady execution.",
      ],
    },
    {
      key: "qoqGrowth",
      title: "Quarter-over-Quarter Growth",
      group: "Executive",
      description:
        "Growth from Q1 to Q4 aggregate revenue. Directional momentum.",
      formula: "QoQ Growth = (Q4 − Q1) / Q1 × 100",
      getValue: (m) => `${m.qoqGrowth.toFixed(1)}%`,
      tips: (m) => [
        m.qoqGrowth <= 0
          ? "Run targeted growth campaigns in weaker quarters."
          : "Sustain momentum via consistent pipeline and fulfillment.",
      ],
    },
  ];
}
