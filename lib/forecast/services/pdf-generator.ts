import { Category, FinancialData } from "../types/financial";

export interface PDFReportData {
  companyInfo: {
    companyName: string;
    tradingName: string;
    industry: string;
    companySize: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    phone: string;
    email: string;
    website: string;
    foundedYear: string;
    employeeCount: string;
    financialYearEnd: string;
    taxRate: number;
    reportingCurrency: string;
    description: string;
    keyProducts: string;
    targetMarket: string;
    competitiveAdvantages: string;
  };
  financialData: {
    categories: Category[];
    yearlyTotals: Record<string, number>;
    monthlyData: Record<string, number[]>;
    financialRatios: Record<string, number>;
    cashFlowData: number[];
    growthRates: Record<string, number>;
  };
  kpiMetrics: {
    profitability: {
      grossProfitMargin: number;
      operatingMargin: number;
      netProfitMargin: number;
      returnOnAssets: number;
      returnOnEquity: number;
    };
    liquidity: {
      currentRatio: number;
      quickRatio: number;
      cashRatio: number;
    };
    efficiency: {
      assetTurnover: number;
      inventoryTurnover: number;
      receivablesTurnover: number;
    };
    leverage: {
      debtToEquity: number;
      debtToAssets: number;
      interestCoverage: number;
    };
  };

  forecastData: {
    revenueForecast: number[];
    profitForecast: number[];
    cashFlowForecast: number[];
    growthProjections: number[];
    scenarioAnalysis: {
      optimistic: number[];
      base: number[];
      pessimistic: number[];
    };
  };
  reportSettings: {
    reportTitle: string;
    reportPeriod: string;
    includeCharts: boolean;
    includeBenchmarks: boolean;
    includeExecutiveSummary: boolean;
    includeDetailedAnalysis: boolean;
    includeAppendices: boolean;
    reportTemplate: string;
    pageSize: string;
    orientation: string;
    includePageNumbers: boolean;
    includeTableOfContents: boolean;
    customHeader: string;
    customFooter: string;
  };
}

export class PDFGenerator {
  private data: PDFReportData;

  constructor(data: PDFReportData) {
    this.data = data;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  private formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat("en-AU").format(value);
  }

  private generateChartSVG(
    data: number[],
    labels: string[],
    title: string,
    type: "bar" | "line" | "pie" = "bar"
  ): string {
    const width = 600;
    const height = 300;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    if (type === "bar") {
      const maxValue = Math.max(...data, 1); // Ensure we don't divide by zero
      const barWidth = chartWidth / data.length;

      let svg = `<svg width="${width}" height="${height}" style="border: 1px solid #ddd; background: white;">
        <text x="${
          width / 2
        }" y="20" text-anchor="middle" font-weight="bold" font-size="14">${title}</text>`;

      data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * barWidth;
        const y = height - padding - barHeight;

        svg += `<rect x="${x + 5}" y="${y}" width="${
          barWidth - 10
        }" height="${barHeight}" fill="#3b82f6" opacity="0.8"/>
                <text x="${x + barWidth / 2}" y="${
          height - 10
        }" text-anchor="middle" font-size="10">${labels[index]}</text>
                <text x="${x + barWidth / 2}" y="${
          y - 5
        }" text-anchor="middle" font-size="8">${this.formatCurrency(
          value
        )}</text>`;
      });

      svg += "</svg>";
      return svg;
    }

    if (type === "line") {
      const maxValue = Math.max(...data, 1);
      const pointSpacing = chartWidth / (data.length - 1);

      let svg = `<svg width="${width}" height="${height}" style="border: 1px solid #ddd; background: white;">
        <text x="${
          width / 2
        }" y="20" text-anchor="middle" font-weight="bold" font-size="14">${title}</text>`;

      // Draw grid lines
      for (let i = 0; i <= 4; i++) {
        const y = padding + (i * chartHeight) / 4;
        svg += `<line x1="${padding}" y1="${y}" x2="${
          width - padding
        }" y2="${y}" stroke="#e5e7eb" stroke-width="1"/>`;
      }

      // Draw line and points
      let pathData = "";
      data.forEach((value, index) => {
        const x = padding + index * pointSpacing;
        const y = height - padding - (value / maxValue) * chartHeight;

        if (index === 0) {
          pathData = `M ${x} ${y}`;
        } else {
          pathData += ` L ${x} ${y}`;
        }

        svg += `<circle cx="${x}" cy="${y}" r="3" fill="#3b82f6"/>
                <text x="${x}" y="${
          height - 10
        }" text-anchor="middle" font-size="10">${labels[index]}</text>
                <text x="${x}" y="${
          y - 8
        }" text-anchor="middle" font-size="8">${this.formatCurrency(
          value
        )}</text>`;
      });

      svg += `<path d="${pathData}" stroke="#3b82f6" stroke-width="2" fill="none"/>`;
      svg += "</svg>";
      return svg;
    }

    if (type === "pie") {
      const total = data.reduce((sum, val) => sum + val, 0);
      if (total === 0) {
        return `<div style="width: ${width}px; height: ${height}px; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; background: #f9f9f9;">
          <p style="text-align: center; color: #666;">No data available for ${title}</p>
        </div>`;
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(chartWidth, chartHeight) / 3;

      let svg = `<svg width="${width}" height="${height}" style="border: 1px solid #ddd; background: white;">
        <text x="${centerX}" y="20" text-anchor="middle" font-weight="bold" font-size="14">${title}</text>`;

      const colors = [
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
      ];
      let currentAngle = 0;

      data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        const endAngle = currentAngle + sliceAngle;

        const x1 = centerX + radius * Math.cos(currentAngle);
        const y1 = centerY + radius * Math.sin(currentAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

        const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

        svg += `<path d="${pathData}" fill="${
          colors[index % colors.length]
        }" stroke="white" stroke-width="2"/>`;

        // Add label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = radius + 20;
        const labelX = centerX + labelRadius * Math.cos(labelAngle);
        const labelY = centerY + labelRadius * Math.sin(labelAngle);

        svg += `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="10" fill="#374151">${labels[index]}</text>`;

        currentAngle = endAngle;
      });

      svg += "</svg>";
      return svg;
    }

    return `<div style="width: ${width}px; height: ${height}px; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; background: #f9f9f9;">
      <p style="text-align: center; color: #666;">Chart: ${title}</p>
    </div>`;
  }

  private generateRatioExplanation(ratioName: string, value: number): string {
    const explanations: Record<
      string,
      {
        description: string;
        interpretation: string;
        benchmark: string;
        formula: string;
        importance: string;
      }
    > = {
      "Gross Profit Margin": {
        description:
          "Measures the percentage of revenue that remains after deducting the cost of goods sold (COGS). This is the first level of profitability analysis.",
        interpretation:
          value >= 50
            ? "Excellent - Strong pricing power and cost control. The business has significant room to absorb cost increases."
            : value >= 30
            ? "Good - Competitive position maintained. The business has adequate margins for sustainable operations."
            : value >= 20
            ? "Fair - Room for improvement in pricing or costs. Consider reviewing pricing strategy and supplier relationships."
            : "Needs improvement - Review pricing strategy and supplier costs. Low margins may indicate pricing pressure or high costs.",
        benchmark:
          "Industry average: 30-50%. Higher margins indicate better pricing power and cost efficiency.",
        formula: "Gross Profit Margin = (Revenue - COGS) / Revenue × 100",
        importance:
          "Critical for understanding pricing power, cost efficiency, and competitive position.",
      },
      "Operating Margin": {
        description:
          "Shows the percentage of revenue remaining after deducting operating expenses. Measures operational efficiency and management effectiveness.",
        interpretation:
          value >= 20
            ? "Excellent - Highly efficient operations with strong cost management and operational excellence."
            : value >= 15
            ? "Good - Well-managed operations with reasonable cost control and efficiency."
            : value >= 10
            ? "Fair - Operational efficiency can be improved. Review operating expenses and processes."
            : "Needs improvement - High operating costs relative to revenue. Focus on cost reduction and operational efficiency.",
        benchmark:
          "Industry average: 10-20%. Higher margins indicate better operational efficiency.",
        formula: "Operating Margin = Operating Profit / Revenue × 100",
        importance:
          "Essential for evaluating operational efficiency and management performance.",
      },
      "Net Profit Margin": {
        description:
          "Indicates the percentage of revenue that becomes net profit after all expenses, taxes, and interest. The ultimate measure of profitability.",
        interpretation:
          value >= 15
            ? "Excellent - Highly profitable business with strong financial performance and sustainable competitive advantages."
            : value >= 10
            ? "Good - Strong profitability with adequate returns for stakeholders and growth potential."
            : value >= 5
            ? "Fair - Adequate profitability but room for improvement in cost management or revenue growth."
            : "Needs improvement - Focus on revenue growth and cost reduction. Low margins may indicate pricing or efficiency issues.",
        benchmark:
          "Industry average: 5-15%. Higher margins indicate better overall financial performance.",
        formula: "Net Profit Margin = Net Profit / Revenue × 100",
        importance:
          "The most comprehensive measure of business profitability and financial health.",
      },
      "Current Ratio": {
        description:
          "Measures the ability to pay short-term obligations with current assets. A key indicator of short-term financial health and liquidity.",
        interpretation:
          value >= 2.0
            ? "Excellent - Strong liquidity position with ample current assets to cover short-term obligations."
            : value >= 1.5
            ? "Good - Adequate short-term solvency with reasonable liquidity buffer."
            : value >= 1.0
            ? "Fair - Monitor cash flow closely. Current assets barely cover current liabilities."
            : "Needs improvement - Potential liquidity issues. May struggle to meet short-term obligations.",
        benchmark:
          "Industry average: 1.5-2.0. Higher ratios indicate better short-term financial health.",
        formula: "Current Ratio = Current Assets / Current Liabilities",
        importance:
          "Critical for assessing short-term financial stability and ability to meet obligations.",
      },
      "Return on Assets (ROA)": {
        description:
          "Shows how efficiently the company uses its assets to generate profit. Measures asset utilization and management effectiveness.",
        interpretation:
          value >= 15
            ? "Excellent - Highly efficient asset utilization with outstanding returns on invested capital."
            : value >= 10
            ? "Good - Effective use of assets with strong returns relative to asset base."
            : value >= 5
            ? "Fair - Moderate asset efficiency with room for improvement in asset utilization."
            : "Needs improvement - Inefficient asset utilization. Review asset management and operational efficiency.",
        benchmark:
          "Industry average: 5-15%. Higher returns indicate better asset efficiency.",
        formula: "ROA = Net Profit / Total Assets × 100",
        importance:
          "Essential for evaluating how effectively the business uses its resources.",
      },
      "Return on Equity (ROE)": {
        description:
          "Measures the return generated on shareholders' equity investment. Indicates how well the business generates profits from shareholder capital.",
        interpretation:
          value >= 20
            ? "Excellent - Outstanding returns for shareholders with exceptional profitability relative to equity."
            : value >= 15
            ? "Good - Strong returns on equity with attractive returns for shareholders."
            : value >= 10
            ? "Fair - Adequate returns but may not be competitive with alternative investments."
            : "Needs improvement - Low returns on equity investment. Focus on improving profitability and efficiency.",
        benchmark:
          "Industry average: 10-20%. Higher returns indicate better shareholder value creation.",
        formula: "ROE = Net Profit / Shareholders' Equity × 100",
        importance:
          "Critical for shareholders to evaluate investment returns and business performance.",
      },
      "Debt to Equity Ratio": {
        description:
          "Indicates the proportion of debt financing relative to equity financing. Measures financial leverage and risk.",
        interpretation:
          value <= 0.5
            ? "Excellent - Conservative debt levels with low financial risk and strong financial stability."
            : value <= 1.0
            ? "Good - Moderate debt levels with reasonable financial leverage and manageable risk."
            : value <= 2.0
            ? "Fair - Higher debt levels that may increase financial risk and interest costs."
            : "Needs improvement - High debt levels may indicate financial risk and potential solvency issues.",
        benchmark:
          "Industry average: 0.5-1.0. Lower ratios indicate lower financial risk.",
        formula: "Debt to Equity = Total Debt / Shareholders' Equity",
        importance:
          "Essential for assessing financial risk and capital structure efficiency.",
      },
      "Asset Turnover": {
        description:
          "Measures how efficiently the company generates revenue from its assets. Indicates asset productivity and operational efficiency.",
        interpretation:
          value >= 2.0
            ? "Excellent - Highly efficient asset utilization with outstanding revenue generation per dollar of assets."
            : value >= 1.0
            ? "Good - Effective asset utilization with strong revenue generation relative to asset base."
            : value >= 0.5
            ? "Fair - Moderate efficiency with room for improvement in asset productivity."
            : "Needs improvement - Inefficient asset utilization. Review asset management and operational processes.",
        benchmark:
          "Industry average: 1.0-2.0. Higher turnover indicates better asset efficiency.",
        formula: "Asset Turnover = Revenue / Total Assets",
        importance:
          "Critical for evaluating operational efficiency and asset productivity.",
      },
      "Quick Ratio": {
        description:
          "Measures the ability to pay short-term obligations with the most liquid assets (excluding inventory). A more conservative liquidity measure.",
        interpretation:
          value >= 1.0
            ? "Excellent - Strong liquidity with ample liquid assets to cover short-term obligations."
            : value >= 0.8
            ? "Good - Adequate liquidity with reasonable buffer for short-term obligations."
            : value >= 0.5
            ? "Fair - Monitor cash flow closely. May need to improve liquidity management."
            : "Needs improvement - Potential liquidity issues. Focus on improving cash and receivables management.",
        benchmark:
          "Industry average: 0.8-1.0. Higher ratios indicate better short-term liquidity.",
        formula:
          "Quick Ratio = (Current Assets - Inventory) / Current Liabilities",
        importance:
          "More conservative than current ratio, excluding less liquid inventory.",
      },
      "Cash Ratio": {
        description:
          "Measures the ability to pay short-term obligations with cash and cash equivalents only. The most conservative liquidity measure.",
        interpretation:
          value >= 0.5
            ? "Excellent - Strong cash position with ample cash reserves for short-term obligations."
            : value >= 0.3
            ? "Good - Adequate cash reserves with reasonable liquidity buffer."
            : value >= 0.1
            ? "Fair - Monitor cash flow closely. May need to improve cash management."
            : "Needs improvement - Low cash reserves. Focus on improving cash generation and management.",
        benchmark:
          "Industry average: 0.3-0.5. Higher ratios indicate better cash liquidity.",
        formula: "Cash Ratio = Cash and Cash Equivalents / Current Liabilities",
        importance:
          "The most conservative liquidity measure, showing immediate payment ability.",
      },
      "Inventory Turnover": {
        description:
          "Measures how many times inventory is sold and replaced during a period. Indicates inventory management efficiency.",
        interpretation:
          value >= 10
            ? "Excellent - Highly efficient inventory management with fast turnover and low holding costs."
            : value >= 6
            ? "Good - Effective inventory management with reasonable turnover rates."
            : value >= 3
            ? "Fair - Moderate inventory efficiency with room for improvement."
            : "Needs improvement - Slow inventory turnover may indicate overstocking or obsolescence.",
        benchmark:
          "Industry average: 6-10 times per year. Higher turnover indicates better efficiency.",
        formula: "Inventory Turnover = COGS / Average Inventory",
        importance:
          "Critical for retail and manufacturing businesses to evaluate inventory efficiency.",
      },
      "Receivables Turnover": {
        description:
          "Measures how efficiently the company collects payments from customers. Indicates credit and collection management effectiveness.",
        interpretation:
          value >= 12
            ? "Excellent - Highly efficient collection process with fast payment collection."
            : value >= 8
            ? "Good - Effective collection management with reasonable payment terms."
            : value >= 4
            ? "Fair - Moderate collection efficiency with room for improvement."
            : "Needs improvement - Slow collections may indicate credit policy or collection issues.",
        benchmark:
          "Industry average: 8-12 times per year. Higher turnover indicates better collection efficiency.",
        formula: "Receivables Turnover = Revenue / Average Accounts Receivable",
        importance:
          "Essential for evaluating credit policy effectiveness and cash flow management.",
      },
    };

    const explanation = explanations[ratioName];
    if (!explanation) {
      return `<p><strong>${ratioName}:</strong> ${this.formatPercentage(
        value
      )} - This ratio measures financial performance and efficiency.</p>`;
    }

    return `
      <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid #3b82f6; background: #f8fafc;">
        <h4 style="margin: 0 0 10px 0; color: #1e40af;">${ratioName}: ${this.formatPercentage(
      value
    )}</h4>
        <p style="margin: 5px 0; font-weight: 500;">What it measures:</p>
        <p style="margin: 5px 0 10px 0; color: #374151;">${
          explanation.description
        }</p>
        <p style="margin: 5px 0; font-weight: 500;">Formula:</p>
        <p style="margin: 5px 0 10px 0; color: #374151; font-family: monospace; background: #f1f5f9; padding: 5px; border-radius: 3px;">${
          explanation.formula
        }</p>
        <p style="margin: 5px 0; font-weight: 500;">Interpretation:</p>
        <p style="margin: 5px 0 10px 0; color: #374151;">${
          explanation.interpretation
        }</p>
        <p style="margin: 5px 0; font-weight: 500;">Benchmark:</p>
        <p style="margin: 5px 0 10px 0; color: #374151;">${
          explanation.benchmark
        }</p>
        <p style="margin: 5px 0; font-weight: 500;">Why it's important:</p>
        <p style="margin: 5px 0; color: #374151;">${explanation.importance}</p>
      </div>
    `;
  }

  private generateComprehensiveRatioAnalysis(): string {
    const { financialData } = this.data;

    // Calculate additional ratios from actual P&L data
    const revenue = financialData.yearlyTotals["sales_revenue"] || 0;
    const cogs = Math.abs(financialData.yearlyTotals["cogs"] || 0);
    const grossProfit = revenue - cogs;
    const operatingExpenses = Math.abs(
      financialData.yearlyTotals["operating_expenses"] || 0
    );
    const netProfitBeforeTax =
      financialData.yearlyTotals["net_profit_before_tax"] || 0;
    const taxExpense =
      netProfitBeforeTax > 0
        ? netProfitBeforeTax * ((this.data.companyInfo.taxRate || 25) / 100)
        : 0;
    const netProfitAfterTax = netProfitBeforeTax - taxExpense;
    const otherIncome = financialData.yearlyTotals["other_income"] || 0;
    const financialExpenses = Math.abs(
      financialData.yearlyTotals["financial_expenses"] || 0
    );

    // Calculate ratios that can be derived from P&L data only
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const operatingMargin =
      revenue > 0
        ? ((netProfitBeforeTax + operatingExpenses) / revenue) * 100
        : 0;
    const netMargin = revenue > 0 ? (netProfitAfterTax / revenue) * 100 : 0;
    const expenseRatio = revenue > 0 ? (operatingExpenses / revenue) * 100 : 0;
    const cogsRatio = revenue > 0 ? (cogs / revenue) * 100 : 0;
    const effectiveTaxRate =
      netProfitBeforeTax > 0 ? (taxExpense / netProfitBeforeTax) * 100 : 0;

    // Note: We're removing balance sheet dependent ratios that require dummy data
    // These ratios would need actual balance sheet data to be meaningful:
    // - Current Ratio, Quick Ratio, Cash Ratio (require current assets/liabilities)
    // - Asset Turnover, ROA (require total assets)
    // - Inventory Turnover (require inventory)
    // - Receivables Turnover (require accounts receivable)
    // - Debt to Equity, ROE (require debt and equity)

    return `
      <h1>Comprehensive Financial Ratio Analysis</h1>
      
      <h2>Profitability Ratios (Based on P&L Data)</h2>
      ${this.generateRatioExplanation("Gross Profit Margin", grossMargin)}
      ${this.generateRatioExplanation("Operating Margin", operatingMargin)}
      ${this.generateRatioExplanation("Net Profit Margin", netMargin)}
      
      <h2>Cost Structure Analysis</h2>
      <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid #10b981; background: #f0fdf4;">
        <h4 style="margin: 0 0 10px 0; color: #047857;">Cost of Goods Sold Ratio: ${this.formatPercentage(
          cogsRatio
        )}</h4>
        <p style="margin: 5px 0; font-weight: 500;">What it measures:</p>
        <p style="margin: 5px 0 10px 0; color: #374151;">The percentage of revenue consumed by direct production costs.</p>
        <p style="margin: 5px 0; font-weight: 500;">Formula:</p>
        <p style="margin: 5px 0 10px 0; color: #374151; font-family: monospace; background: #f1f5f9; padding: 5px; border-radius: 3px;">COGS Ratio = COGS / Revenue × 100</p>
        <p style="margin: 5px 0; font-weight: 500;">Interpretation:</p>
        <p style="margin: 5px 0 10px 0; color: #374151;">
          ${
            cogsRatio <= 50
              ? "Excellent - Low direct costs relative to revenue, indicating strong pricing power and efficient production."
              : cogsRatio <= 70
              ? "Good - Competitive cost structure with reasonable direct costs."
              : cogsRatio <= 80
              ? "Fair - Higher direct costs that may impact profitability."
              : "Needs improvement - Very high direct costs affecting profitability. Review supplier relationships and production efficiency."
          }
        </p>
        <p style="margin: 5px 0; font-weight: 500;">Benchmark:</p>
        <p style="margin: 5px 0; color: #374151;">Industry average: 50-70%. Lower ratios indicate better cost efficiency.</p>
        <p style="margin: 5px 0; font-weight: 500;">Why it's important:</p>
        <p style="margin: 5px 0; color: #374151;">Critical for understanding direct cost efficiency and pricing strategy effectiveness.</p>
      </div>

      <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid #f59e0b; background: #fffbeb;">
        <h4 style="margin: 0 0 10px 0; color: #d97706;">Operating Expense Ratio: ${this.formatPercentage(
          expenseRatio
        )}</h4>
        <p style="margin: 5px 0; font-weight: 500;">What it measures:</p>
        <p style="margin: 5px 0 10px 0; color: #374151;">The percentage of revenue consumed by operating expenses.</p>
        <p style="margin: 5px 0; font-weight: 500;">Formula:</p>
        <p style="margin: 5px 0 10px 0; color: #374151; font-family: monospace; background: #f1f5f9; padding: 5px; border-radius: 3px;">Operating Expense Ratio = Operating Expenses / Revenue × 100</p>
        <p style="margin: 5px 0; font-weight: 500;">Interpretation:</p>
        <p style="margin: 5px 0 10px 0; color: #374151;">
          ${
            expenseRatio <= 25
              ? "Excellent - Well-controlled operating costs with efficient overhead management."
              : expenseRatio <= 40
              ? "Good - Reasonable operating costs with effective cost control."
              : expenseRatio <= 50
              ? "Fair - Higher operating costs that may impact profitability."
              : "Needs improvement - Operating costs consuming too much revenue. Focus on cost reduction initiatives."
          }
        </p>
        <p style="margin: 5px 0; font-weight: 500;">Benchmark:</p>
        <p style="margin: 5px 0; color: #374151;">Industry average: 25-40%. Lower ratios indicate better operational efficiency.</p>
        <p style="margin: 5px 0; font-weight: 500;">Why it's important:</p>
        <p style="margin: 5px 0; color: #374151;">Essential for evaluating operational efficiency and overhead cost management.</p>
      </div>

      <h2>Tax Efficiency</h2>
      <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid #8b5cf6; background: #faf5ff;">
        <h4 style="margin: 0 0 10px 0; color: #7c3aed;">Effective Tax Rate: ${this.formatPercentage(
          effectiveTaxRate
        )}</h4>
        <p style="margin: 5px 0; font-weight: 500;">What it measures:</p>
        <p style="margin: 5px 0 10px 0; color: #374151;">The actual tax rate paid on profits, including all tax deductions and credits.</p>
        <p style="margin: 5px 0; font-weight: 500;">Formula:</p>
        <p style="margin: 5px 0 10px 0; color: #374151; font-family: monospace; background: #f1f5f9; padding: 5px; border-radius: 3px;">Effective Tax Rate = Tax Expense / Net Profit Before Tax × 100</p>
        <p style="margin: 5px 0; font-weight: 500;">Interpretation:</p>
        <p style="margin: 5px 0 10px 0; color: #374151;">
          ${
            effectiveTaxRate <= (this.data.companyInfo.taxRate || 25)
              ? "Good - Tax efficiency at or below standard rate, indicating effective tax planning."
              : "Review - Tax rate higher than standard, consider tax optimization strategies and available deductions."
          }
        </p>
        <p style="margin: 5px 0; font-weight: 500;">Benchmark:</p>
        <p style="margin: 5px 0; color: #374151;">Standard corporate tax rate: ${
          this.data.companyInfo.taxRate || 25
        }%. Lower effective rates indicate better tax efficiency.</p>
        <p style="margin: 5px 0; font-weight: 500;">Why it's important:</p>
        <p style="margin: 5px 0; color: #374151;">Critical for understanding tax burden and identifying tax optimization opportunities.</p>
      </div>

      ${
        otherIncome > 0
          ? `
        <h2>Additional Income Analysis</h2>
        <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid #10b981; background: #f0fdf4;">
          <h4 style="margin: 0 0 10px 0; color: #047857;">Other Income: ${this.formatCurrency(
            otherIncome
          )} (${this.formatPercentage(
              (otherIncome / revenue) * 100
            )} of revenue)</h4>
          <p style="margin: 5px 0; font-weight: 500;">What it represents:</p>
          <p style="margin: 5px 0 10px 0; color: #374151;">Additional income streams beyond core business operations, such as investment income, rental income, or one-time gains.</p>
          <p style="margin: 5px 0; font-weight: 500;">Impact:</p>
          <p style="margin: 5px 0 10px 0; color: #374151;">This provides a valuable boost to profitability and should be considered for expansion opportunities. ${
            (otherIncome / revenue) * 100 > 10
              ? "Significant contribution to overall profitability."
              : "Modest contribution to overall profitability."
          }</p>
          <p style="margin: 5px 0; font-weight: 500;">Recommendation:</p>
          <p style="margin: 5px 0; color: #374151;">Consider diversifying income streams and exploring opportunities to increase non-operating income.</p>
        </div>
      `
          : ""
      }

      ${
        financialExpenses > 0
          ? `
        <h2>Financing Costs Analysis</h2>
        <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid #ef4444; background: #fef2f2;">
          <h4 style="margin: 0 0 10px 0; color: #dc2626;">Financial Expenses: ${this.formatCurrency(
            financialExpenses
          )} (${this.formatPercentage(
              (financialExpenses / revenue) * 100
            )} of revenue)</h4>
          <p style="margin: 5px 0; font-weight: 500;">What it represents:</p>
          <p style="margin: 5px 0 10px 0; color: #374151;">Interest payments and other financing costs that reduce net profit, including loan interest, bank fees, and other financial charges.</p>
          <p style="margin: 5px 0; font-weight: 500;">Impact:</p>
          <p style="margin: 5px 0 10px 0; color: #374151;">${
            (financialExpenses / revenue) * 100 > 5
              ? "High financing costs significantly impact profitability and cash flow."
              : "Reasonable financing costs relative to revenue."
          }</p>
          <p style="margin: 5px 0; font-weight: 500;">Recommendation:</p>
          <p style="margin: 5px 0 10px 0; color: #374151;">
            ${
              (financialExpenses / revenue) * 100 > 5
                ? "Consider debt refinancing, negotiating better terms, or exploring alternative financing options to reduce costs."
                : "Financing costs are reasonable relative to revenue. Continue monitoring for optimization opportunities."
            }
          </p>
          <p style="margin: 5px 0; font-weight: 500;">Benchmark:</p>
          <p style="margin: 5px 0; color: #374151;">Industry average: 2-5% of revenue. Lower ratios indicate better financing efficiency.</p>
        </div>
      `
          : ""
      }

      <h2>Data Availability Notice</h2>
      <div style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 20px 0;">
        <h4 style="margin: 0 0 8px 0; color: #d97706;">Important Note</h4>
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>Balance Sheet Ratios Not Included:</strong> This analysis focuses on ratios that can be calculated from available P&L data. 
          The following ratios require balance sheet data and are not included to avoid using estimated values:
        </p>
        <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #92400e; font-size: 14px;">
          <li>Current Ratio, Quick Ratio, Cash Ratio (require current assets/liabilities)</li>
          <li>Asset Turnover, Return on Assets (require total assets)</li>
          <li>Inventory Turnover (require inventory levels)</li>
          <li>Receivables Turnover (require accounts receivable)</li>
          <li>Debt to Equity, Return on Equity (require debt and equity)</li>
        </ul>
        <p style="margin: 10px 0 0 0; color: #92400e; font-size: 14px;">
          <strong>Recommendation:</strong> To include these ratios, please provide actual balance sheet data for accurate calculations.
        </p>
      </div>

      <h2>Overall Financial Health Assessment</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin-top: 0;">Comprehensive Analysis Summary</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 15px 0;">
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
            <h4 style="margin: 0 0 8px 0; color: #047857;">Profitability</h4>
            <p style="margin: 0; font-size: 14px; color: #374151;">
              ${
                netMargin >= 15
                  ? "Excellent profitability with strong margins"
                  : netMargin >= 10
                  ? "Good profitability with room for improvement"
                  : netMargin >= 5
                  ? "Fair profitability needing attention"
                  : "Profitability needs significant improvement"
              }
            </p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
            <h4 style="margin: 0 0 8px 0; color: #d97706;">Cost Structure</h4>
            <p style="margin: 0; font-size: 14px; color: #374151;">
              ${
                expenseRatio <= 40
                  ? "Well-controlled operating costs"
                  : expenseRatio <= 60
                  ? "Reasonable operating costs"
                  : "High operating costs need attention"
              }
            </p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #8b5cf6;">
            <h4 style="margin: 0 0 8px 0; color: #7c3aed;">Tax Efficiency</h4>
            <p style="margin: 0; font-size: 14px; color: #374151;">
              ${
                effectiveTaxRate <= (this.data.companyInfo.taxRate || 25)
                  ? "Effective tax planning"
                  : "Tax optimization opportunities available"
              }
            </p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
            <h4 style="margin: 0 0 8px 0; color: #1e40af;">Revenue Performance</h4>
            <p style="margin: 0; font-size: 14px; color: #374151;">
              ${
                revenue > 0
                  ? revenue > 1000000
                    ? "Strong revenue generation"
                    : revenue > 500000
                    ? "Moderate revenue generation"
                    : "Revenue needs improvement"
                  : "No revenue recorded"
              }
            </p>
          </div>
        </div>
      </div>
    `;
  }

  private generateChartsSection(): string {
    const { financialData } = this.data;
    const monthlyData = financialData.monthlyData;
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

    // Revenue chart
    const revenueData = monthlyData["sales_revenue"] || Array(12).fill(0);
    const revenueChart = this.generateChartSVG(
      revenueData,
      months,
      "Monthly Revenue Trend",
      "bar"
    );

    // Profit chart
    const profitData =
      monthlyData["net_profit_before_tax"] || Array(12).fill(0);
    const profitChart = this.generateChartSVG(
      profitData,
      months,
      "Monthly Profit Trend",
      "bar"
    );

    // Cash flow chart
    const cashFlowData = financialData.cashFlowData || Array(12).fill(0);
    const cashFlowChart = this.generateChartSVG(
      cashFlowData,
      months,
      "Monthly Cash Flow",
      "line"
    );

    // Expense breakdown pie chart
    const yearlyTotals = financialData.yearlyTotals;
    const cogs = Math.abs(yearlyTotals["cogs"] || 0);
    const operatingExpenses = Math.abs(yearlyTotals["operating_expenses"] || 0);
    const otherExpenses = Math.abs(yearlyTotals["other_expenses"] || 0);
    const financialExpenses = Math.abs(yearlyTotals["financial_expenses"] || 0);

    const expenseBreakdownData = [
      cogs,
      operatingExpenses,
      otherExpenses,
      financialExpenses,
    ];
    const expenseBreakdownLabels = [
      "COGS",
      "Operating Expenses",
      "Other Expenses",
      "Financial Expenses",
    ];
    const expenseBreakdownChart = this.generateChartSVG(
      expenseBreakdownData,
      expenseBreakdownLabels,
      "Expense Breakdown",
      "pie"
    );

    // Profitability trend (line chart)
    const netProfitData =
      monthlyData["net_profit_before_tax"] || Array(12).fill(0);

    // Create combined profitability chart
    const profitabilityChart = this.generateChartSVG(
      netProfitData,
      months,
      "Profitability Trend (Net Profit)",
      "line"
    );

    // Revenue vs Expenses comparison
    const totalExpensesData = months.map((_, index) => {
      const cogsMonthly = (monthlyData["cogs"] || Array(12).fill(0))[index];
      const operatingMonthly = (monthlyData["operating_expenses"] ||
        Array(12).fill(0))[index];
      return Math.abs(cogsMonthly) + Math.abs(operatingMonthly);
    });

    const revenueVsExpensesChart = this.generateChartSVG(
      months.map((_, i) => revenueData[i] - totalExpensesData[i]),
      months,
      "Revenue minus Total Expenses",
      "bar"
    );

    return `
      <h1>Financial Charts & Visualizations</h1>
      
      <h2>Revenue Analysis</h2>
      <div style="text-align: center; margin: 20px 0;">
        ${revenueChart}
      </div>
      <p style="text-align: center; color: #666; font-style: italic;">
        Monthly revenue trend showing seasonal patterns and growth trajectory. 
        This chart helps identify peak revenue periods and potential seasonal fluctuations.
      </p>
      
      <h2>Profitability Analysis</h2>
      <div style="text-align: center; margin: 20px 0;">
        ${profitChart}
      </div>
      <p style="text-align: center; color: #666; font-style: italic;">
        Monthly profit performance indicating operational efficiency and cost management effectiveness.
        Consistent positive trends suggest strong business fundamentals.
      </p>
      
      <h2>Cash Flow Analysis</h2>
      <div style="text-align: center; margin: 20px 0;">
        ${cashFlowChart}
      </div>
      <p style="text-align: center; color: #666; font-style: italic;">
        Monthly cash flow showing liquidity patterns and working capital management.
        Positive cash flow indicates the business can meet its short-term obligations.
      </p>

      <h2>Expense Structure Analysis</h2>
      <div style="text-align: center; margin: 20px 0;">
        ${expenseBreakdownChart}
      </div>
      <p style="text-align: center; color: #666; font-style: italic;">
        Breakdown of total expenses showing the proportion of costs by category.
        This helps identify the largest cost drivers and opportunities for cost optimization.
      </p>

      <h2>Profitability Trend Analysis</h2>
      <div style="text-align: center; margin: 20px 0;">
        ${profitabilityChart}
      </div>
      <p style="text-align: center; color: #666; font-style: italic;">
        Net profit trend over time showing the business's ability to generate sustainable profits.
        Upward trends indicate improving operational efficiency and profitability.
      </p>

      <h2>Revenue vs Expenses Comparison</h2>
      <div style="text-align: center; margin: 20px 0;">
        ${revenueVsExpensesChart}
      </div>
      <p style="text-align: center; color: #666; font-style: italic;">
        Comparison of monthly revenue against total expenses.
        The gap between revenue and expenses represents the gross profit margin.
      </p>

      <h2>Key Insights from Charts</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin-top: 0;">Chart Analysis Summary</h3>
        <ul style="color: #374151; line-height: 1.6;">
          <li><strong>Revenue Pattern:</strong> ${
            revenueData.some((val) => val > 0)
              ? "Revenue shows " +
                (revenueData[revenueData.length - 1] > revenueData[0]
                  ? "growth"
                  : "decline") +
                " trend"
              : "No revenue data available"
          }</li>
          <li><strong>Profitability:</strong> ${
            profitData.some((val) => val > 0)
              ? "Profit trends indicate " +
                (profitData[profitData.length - 1] > profitData[0]
                  ? "improving"
                  : "declining") +
                " profitability"
              : "Profit data needs attention"
          }</li>
          <li><strong>Cash Flow:</strong> ${
            cashFlowData.some((val) => val > 0)
              ? "Cash flow is " +
                (cashFlowData.reduce((sum, val) => sum + val, 0) > 0
                  ? "positive"
                  : "negative") +
                " overall"
              : "Cash flow data requires review"
          }</li>
          <li><strong>Cost Structure:</strong> ${
            expenseBreakdownData[0] > 0
              ? `COGS represents ${(
                  (expenseBreakdownData[0] /
                    expenseBreakdownData.reduce((sum, val) => sum + val, 0)) *
                  100
                ).toFixed(1)}% of total expenses`
              : "Expense structure analysis needed"
          }</li>
        </ul>
      </div>
    `;
  }

  private generateExecutiveSummary(): string {
    const { financialData, companyInfo } = this.data;
    const revenue = financialData.yearlyTotals["sales_revenue"] || 0;
    const cogs = Math.abs(financialData.yearlyTotals["cogs"] || 0);
    const grossProfit = revenue - cogs;
    const netProfitBeforeTax =
      financialData.yearlyTotals["net_profit_before_tax"] || 0;
    const taxExpense =
      netProfitBeforeTax > 0
        ? netProfitBeforeTax * ((companyInfo.taxRate || 25) / 100)
        : 0;
    const netProfitAfterTax = netProfitBeforeTax - taxExpense;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const netMargin = revenue > 0 ? (netProfitAfterTax / revenue) * 100 : 0;
    const operatingExpenses = Math.abs(
      financialData.yearlyTotals["operating_expenses"] || 0
    );
    const otherIncome = financialData.yearlyTotals["other_income"] || 0;
    const financialExpenses = Math.abs(
      financialData.yearlyTotals["financial_expenses"] || 0
    );

    // Calculate additional metrics
    const expenseRatio = revenue > 0 ? (operatingExpenses / revenue) * 100 : 0;
    const effectiveTaxRate =
      netProfitBeforeTax > 0 ? (taxExpense / netProfitBeforeTax) * 100 : 0;

    return `
      <h1>Executive Summary</h1>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1e40af; margin-top: 0;">Financial Performance Overview</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
          <div style="text-align: center; padding: 15px; background: white; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="margin: 0; color: #059669; font-size: 24px;">${this.formatCurrency(
              revenue
            )}</h3>
            <p style="margin: 5px 0; color: #374151;">Total Revenue</p>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">${
              revenue > 0 ? "Revenue generated" : "No revenue recorded"
            }</p>
          </div>
          
          <div style="text-align: center; padding: 15px; background: white; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="margin: 0; color: #3b82f6; font-size: 24px;">${this.formatPercentage(
              grossMargin
            )}</h3>
            <p style="margin: 5px 0; color: #374151;">Gross Margin</p>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">${
              grossMargin >= 30
                ? "Strong margins"
                : grossMargin >= 20
                ? "Adequate margins"
                : "Margins need improvement"
            }</p>
          </div>
          
          <div style="text-align: center; padding: 15px; background: white; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="margin: 0; color: #8b5cf6; font-size: 24px;">${this.formatCurrency(
              netProfitAfterTax
            )}</h3>
            <p style="margin: 5px 0; color: #374151;">Net Profit</p>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">${
              netProfitAfterTax > 0
                ? "Profitable operations"
                : "Operating at loss"
            }</p>
          </div>
          
          <div style="text-align: center; padding: 15px; background: white; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="margin: 0; color: #f59e0b; font-size: 24px;">${this.formatPercentage(
              netMargin
            )}</h3>
            <p style="margin: 5px 0; color: #374151;">Net Margin</p>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">${
              netMargin >= 10
                ? "Excellent profitability"
                : netMargin >= 5
                ? "Good profitability"
                : "Profitability needs attention"
            }</p>
          </div>
        </div>
        
        <h3 style="color: #1e40af;">Key Financial Insights</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin: 15px 0;">
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
            <h4 style="margin: 0 0 8px 0; color: #047857;">Revenue Performance</h4>
            <p style="margin: 0; font-size: 14px; color: #374151;">
              ${
                revenue > 0
                  ? `Revenue of ${this.formatCurrency(
                      revenue
                    )} represents the business's ability to generate sales. ${
                      revenue > 1000000
                        ? "Strong revenue generation."
                        : revenue > 500000
                        ? "Moderate revenue generation."
                        : "Revenue needs improvement."
                    }`
                  : "No revenue recorded. Focus on sales and marketing initiatives."
              }
            </p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
            <h4 style="margin: 0 0 8px 0; color: #1e40af;">Profitability Analysis</h4>
            <p style="margin: 0; font-size: 14px; color: #374151;">
              ${
                netProfitAfterTax > 0
                  ? `Net profit of ${this.formatCurrency(
                      netProfitAfterTax
                    )} with ${this.formatPercentage(
                      netMargin
                    )} margin indicates ${
                      netMargin >= 15
                        ? "excellent profitability"
                        : netMargin >= 10
                        ? "good profitability"
                        : "adequate profitability"
                    }.`
                  : "Currently operating at a loss. Focus on cost reduction and revenue growth."
              }
            </p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
            <h4 style="margin: 0 0 8px 0; color: #d97706;">Cost Structure</h4>
            <p style="margin: 0; font-size: 14px; color: #374151;">
              ${
                expenseRatio <= 40
                  ? "Well-controlled operating costs with efficient overhead management."
                  : expenseRatio <= 60
                  ? "Reasonable operating costs with room for optimization."
                  : "High operating costs relative to revenue. Focus on cost reduction."
              }
              COGS represents ${this.formatPercentage(
                (cogs / revenue) * 100
              )} of revenue.
            </p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #8b5cf6;">
            <h4 style="margin: 0 0 8px 0; color: #7c3aed;">Tax Efficiency</h4>
            <p style="margin: 0; font-size: 14px; color: #374151;">
              ${
                effectiveTaxRate <= (companyInfo.taxRate || 25)
                  ? "Effective tax planning with tax rate at or below standard corporate rate."
                  : "Tax rate higher than standard. Consider tax optimization strategies."
              }
              Effective tax rate: ${this.formatPercentage(effectiveTaxRate)}.
            </p>
          </div>
        </div>

        <h3 style="color: #1e40af;">Additional Income & Expenses</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 15px 0;">
          ${
            otherIncome > 0
              ? `
            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
              <h4 style="margin: 0 0 8px 0; color: #047857;">Other Income</h4>
              <p style="margin: 0; font-size: 14px; color: #374151;">
                ${this.formatCurrency(
                  otherIncome
                )} in additional income provides ${
                  (otherIncome / revenue) * 100 > 10 ? "significant" : "modest"
                } boost to profitability.
              </p>
            </div>
          `
              : ""
          }
          
          ${
            financialExpenses > 0
              ? `
            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #ef4444;">
              <h4 style="margin: 0 0 8px 0; color: #dc2626;">Financial Expenses</h4>
              <p style="margin: 0; font-size: 14px; color: #374151;">
                ${this.formatCurrency(
                  financialExpenses
                )} in financing costs represents ${
                  (financialExpenses / revenue) * 100 > 5
                    ? "high"
                    : "reasonable"
                } proportion of revenue.
              </p>
            </div>
          `
              : ""
          }
        </div>

        <h3 style="color: #1e40af;">Strategic Recommendations</h3>
        <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <ul style="color: #374151; line-height: 1.6; margin: 0; padding-left: 20px;">
            ${
              revenue === 0
                ? "<li><strong>Revenue Generation:</strong> Focus on sales and marketing initiatives to generate revenue.</li>"
                : revenue < 500000
                ? "<li><strong>Revenue Growth:</strong> Implement strategies to increase sales and market penetration.</li>"
                : ""
            }
            ${
              grossMargin < 30
                ? "<li><strong>Pricing Strategy:</strong> Review pricing to improve gross margins and cost efficiency.</li>"
                : ""
            }
            ${
              expenseRatio > 40
                ? "<li><strong>Cost Optimization:</strong> Identify and reduce unnecessary operating expenses.</li>"
                : ""
            }
            ${
              netMargin < 10
                ? "<li><strong>Profitability Improvement:</strong> Focus on both revenue growth and cost reduction.</li>"
                : ""
            }
            ${
              financialExpenses > 0 && (financialExpenses / revenue) * 100 > 5
                ? "<li><strong>Debt Management:</strong> Consider refinancing or debt consolidation to reduce financing costs.</li>"
                : ""
            }
            ${
              effectiveTaxRate > (companyInfo.taxRate || 25)
                ? "<li><strong>Tax Planning:</strong> Consult with tax advisors to optimize tax efficiency.</li>"
                : ""
            }
            <li><strong>Continuous Monitoring:</strong> Regularly review financial performance and adjust strategies accordingly.</li>
            <li><strong>Cash Flow Management:</strong> Ensure adequate working capital for business operations and growth.</li>
          </ul>
        </div>
      </div>
    `;
  }

  private generateFinancialPerformance(): string {
    const { financialData } = this.data;
    const yearlyTotals = financialData.yearlyTotals;

    const revenue = yearlyTotals["sales_revenue"] || 0;
    const cogs = Math.abs(yearlyTotals["cogs"] || 0);
    const grossProfit = revenue - cogs;
    const operatingExpenses = Math.abs(yearlyTotals["operating_expenses"] || 0);
    const otherIncome = yearlyTotals["other_income"] || 0;
    const financialExpenses = Math.abs(yearlyTotals["financial_expenses"] || 0);
    const otherExpenses = Math.abs(yearlyTotals["other_expenses"] || 0);
    const operatingProfit = grossProfit - operatingExpenses;
    const netProfitBeforeTax =
      operatingProfit + otherIncome - financialExpenses - otherExpenses;
    const taxRate = this.data.companyInfo.taxRate || 25;
    const taxExpense =
      netProfitBeforeTax > 0 ? (netProfitBeforeTax * taxRate) / 100 : 0;
    const netProfitAfterTax = netProfitBeforeTax - taxExpense;

    return `
      <h1>Financial Performance Analysis</h1>
      
      <h2>Profit & Loss Statement Summary</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="text-align: left; padding: 12px;">Category</th>
            <th style="text-align: right; padding: 12px;">Amount</th>
            <th style="text-align: center; padding: 12px;">% of Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Revenue</td>
            <td style="text-align: right; padding: 8px; font-weight: bold;">${this.formatCurrency(
              revenue
            )}</td>
            <td style="text-align: center; padding: 8px;">100.0%</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Cost of Goods Sold</td>
            <td style="text-align: right; padding: 8px;">(${this.formatCurrency(
              cogs
            )})</td>
            <td style="text-align: center; padding: 8px;">${
              revenue ? ((cogs / revenue) * 100).toFixed(1) : 0
            }%</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 8px; font-weight: bold;">Gross Profit</td>
            <td style="text-align: right; padding: 8px; font-weight: bold;">${this.formatCurrency(
              grossProfit
            )}</td>
            <td style="text-align: center; padding: 8px;">${
              revenue ? ((grossProfit / revenue) * 100).toFixed(1) : 0
            }%</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Operating Expenses</td>
            <td style="text-align: right; padding: 8px;">(${this.formatCurrency(
              operatingExpenses
            )})</td>
            <td style="text-align: center; padding: 8px;">${
              revenue ? ((operatingExpenses / revenue) * 100).toFixed(1) : 0
            }%</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 8px; font-weight: bold;">Operating Profit</td>
            <td style="text-align: right; padding: 8px; font-weight: bold;">${this.formatCurrency(
              operatingProfit
            )}</td>
            <td style="text-align: center; padding: 8px;">${
              revenue ? ((operatingProfit / revenue) * 100).toFixed(1) : 0
            }%</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Other Income</td>
            <td style="text-align: right; padding: 8px;">${this.formatCurrency(
              otherIncome
            )}</td>
            <td style="text-align: center; padding: 8px;">${
              revenue ? ((otherIncome / revenue) * 100).toFixed(1) : 0
            }%</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Financial Expenses</td>
            <td style="text-align: right; padding: 8px;">(${this.formatCurrency(
              financialExpenses
            )})</td>
            <td style="text-align: center; padding: 8px;">${
              revenue ? ((financialExpenses / revenue) * 100).toFixed(1) : 0
            }%</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Other Expenses</td>
            <td style="text-align: right; padding: 8px;">(${this.formatCurrency(
              otherExpenses
            )})</td>
            <td style="text-align: center; padding: 8px;">${
              revenue ? ((otherExpenses / revenue) * 100).toFixed(1) : 0
            }%</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 8px; font-weight: bold;">Net Profit Before Tax</td>
            <td style="text-align: right; padding: 8px; font-weight: bold;">${this.formatCurrency(
              netProfitBeforeTax
            )}</td>
            <td style="text-align: center; padding: 8px;">${
              revenue ? ((netProfitBeforeTax / revenue) * 100).toFixed(1) : 0
            }%</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Tax Expense</td>
            <td style="text-align: right; padding: 8px;">(${this.formatCurrency(
              taxExpense
            )})</td>
            <td style="text-align: center; padding: 8px;">${
              netProfitBeforeTax > 0
                ? ((taxExpense / netProfitBeforeTax) * 100).toFixed(1)
                : 0
            }%</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 8px; font-weight: bold;">Net Profit After Tax</td>
            <td style="text-align: right; padding: 8px; font-weight: bold;">${this.formatCurrency(
              netProfitAfterTax
            )}</td>
            <td style="text-align: center; padding: 8px;">${
              revenue ? ((netProfitAfterTax / revenue) * 100).toFixed(1) : 0
            }%</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  private generateKPIAnalysis(): string {
    const { kpiMetrics } = this.data;

    return `
      <h1>Key Performance Indicators</h1>
      
      <h2>Profitability Ratios (Based on P&L Data)</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="text-align: left; padding: 12px;">Ratio</th>
            <th style="text-align: right; padding: 12px;">Value</th>
            <th style="text-align: center; padding: 12px;">Benchmark</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px;">Gross Profit Margin</td>
            <td style="text-align: right; padding: 8px;">${this.formatPercentage(
              kpiMetrics.profitability.grossProfitMargin
            )}</td>
            <td style="text-align: center; padding: 8px;">Industry Avg: 40%</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Operating Margin</td>
            <td style="text-align: right; padding: 8px;">${this.formatPercentage(
              kpiMetrics.profitability.operatingMargin
            )}</td>
            <td style="text-align: center; padding: 8px;">Industry Avg: 15%</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Net Profit Margin</td>
            <td style="text-align: right; padding: 8px;">${this.formatPercentage(
              kpiMetrics.profitability.netProfitMargin
            )}</td>
            <td style="text-align: center; padding: 8px;">Industry Avg: 10%</td>
          </tr>
        </tbody>
      </table>

      <div style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 20px 0;">
        <h4 style="margin: 0 0 8px 0; color: #d97706;">Important Note</h4>
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>Balance Sheet Ratios Not Included:</strong> The following ratios require balance sheet data and are not included to avoid using estimated values:
        </p>
        <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #92400e; font-size: 14px;">
          <li>Current Ratio, Quick Ratio, Cash Ratio (require current assets/liabilities)</li>
          <li>Return on Assets (ROA), Return on Equity (ROE) (require total assets/equity)</li>
          <li>Asset Turnover, Inventory Turnover, Receivables Turnover (require balance sheet data)</li>
          <li>Debt to Equity, Debt to Assets (require debt and equity information)</li>
        </ul>
        <p style="margin: 10px 0 0 0; color: #92400e; font-size: 14px;">
          <strong>Recommendation:</strong> To include these ratios, please provide actual balance sheet data for accurate calculations.
        </p>
      </div>
    `;
  }

  public generatePDF(): string {
    const { companyInfo, reportSettings } = this.data;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${reportSettings.reportTitle || "Financial Report"}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
          h1 {
            color: #1e40af;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 10px;
            margin-top: 30px;
            margin-bottom: 20px;
          }
          h2 {
            color: #374151;
            margin-top: 25px;
            margin-bottom: 15px;
          }
          h3 {
            color: #4b5563;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
          }
          th, td {
            border: 1px solid #d1d5db;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f3f4f6;
            font-weight: bold;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
          }
          .page-break {
            page-break-before: always;
          }
          @media print {
            body { margin: 0; }
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${
            reportSettings.reportTitle || "Financial Performance Report"
          }</h1>
          <p><strong>${companyInfo.companyName || "Company Name"}</strong></p>
          <p>Report Period: ${reportSettings.reportPeriod || "2024"}</p>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
        </div>

        ${this.generateExecutiveSummary()}
        
        <div class="page-break"></div>
        ${this.generateFinancialPerformance()}
        
        <div class="page-break"></div>
        ${this.generateComprehensiveRatioAnalysis()}
        
        ${
          reportSettings.includeCharts
            ? `
          <div class="page-break"></div>
          ${this.generateChartsSection()}
        `
            : ""
        }
        
        <div class="page-break"></div>
        ${this.generateKPIAnalysis()}

        <div class="footer">
          <p>This report was generated by Financial Forecast System</p>
          <p>For questions or additional analysis, please contact your financial advisor</p>
        </div>
      </body>
      </html>
    `;
  }
}

// Helper function to calculate KPI metrics
export function calculateKPIMetrics(financialData: FinancialData): {
  profitability: {
    grossProfitMargin: number;
    operatingMargin: number;
    netProfitMargin: number;
    returnOnAssets: number;
    returnOnEquity: number;
  };
  liquidity: {
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
  };
  efficiency: {
    assetTurnover: number;
    inventoryTurnover: number;
    receivablesTurnover: number;
  };
  leverage: {
    debtToEquity: number;
    debtToAssets: number;
    interestCoverage: number;
  };
} {
  const revenue = financialData.categories.find(
    (c) => c.type === "sales_revenue"
  );
  const grossProfit = financialData.categories.find(
    (c) => c.type === "gross_profit"
  );
  const operatingProfit = financialData.categories.find(
    (c) => c.type === "operating_profit"
  );
  const netProfit = financialData.categories.find(
    (c) => c.type === "net_profit_after_tax"
  );

  const revenueTotal = revenue ? calculateCategoryTotal(revenue) : 0;
  const grossProfitTotal = grossProfit
    ? calculateCategoryTotal(grossProfit)
    : 0;
  const operatingProfitTotal = operatingProfit
    ? calculateCategoryTotal(operatingProfit)
    : 0;
  const netProfitTotal = netProfit ? calculateCategoryTotal(netProfit) : 0;

  return {
    profitability: {
      grossProfitMargin:
        revenueTotal > 0 ? (grossProfitTotal / revenueTotal) * 100 : 0,
      operatingMargin:
        revenueTotal > 0 ? (operatingProfitTotal / revenueTotal) * 100 : 0,
      netProfitMargin:
        revenueTotal > 0 ? (netProfitTotal / revenueTotal) * 100 : 0,
      returnOnAssets: 0, // Requires balance sheet data
      returnOnEquity: 0, // Requires balance sheet data
    },
    liquidity: {
      currentRatio: 0, // Requires balance sheet data
      quickRatio: 0, // Requires balance sheet data
      cashRatio: 0, // Requires balance sheet data
    },
    efficiency: {
      assetTurnover: 0, // Requires balance sheet data
      inventoryTurnover: 0, // Requires balance sheet data
      receivablesTurnover: 0, // Requires balance sheet data
    },
    leverage: {
      debtToEquity: 0, // Requires balance sheet data
      debtToAssets: 0, // Requires balance sheet data
      interestCoverage: 0, // Requires balance sheet data
    },
  };
}

// Helper function to generate forecast data
export function generateForecastData(financialData: FinancialData): {
  revenueForecast: number[];
  profitForecast: number[];
  cashFlowForecast: number[];
  growthProjections: number[];
  scenarioAnalysis: {
    optimistic: number[];
    base: number[];
    pessimistic: number[];
  };
} {
  const revenue = financialData.categories.find(
    (c) => c.type === "sales_revenue"
  );
  const baseRevenue = revenue ? calculateCategoryTotal(revenue) : 100000;

  return {
    revenueForecast: Array(12)
      .fill(0)
      .map((_, i) => baseRevenue * (1 + i * 0.05)),
    profitForecast: Array(12)
      .fill(0)
      .map((_, i) => baseRevenue * 0.15 * (1 + i * 0.03)),
    cashFlowForecast: Array(12)
      .fill(0)
      .map((_, i) => baseRevenue * 0.12 * (1 + i * 0.02)),
    growthProjections: Array(12)
      .fill(0)
      .map((_, i) => 5 + i * 0.5),
    scenarioAnalysis: {
      optimistic: Array(12)
        .fill(0)
        .map((_, i) => baseRevenue * 1.2 * (1 + i * 0.08)),
      base: Array(12)
        .fill(0)
        .map((_, i) => baseRevenue * (1 + i * 0.05)),
      pessimistic: Array(12)
        .fill(0)
        .map((_, i) => baseRevenue * 0.8 * (1 + i * 0.02)),
    },
  };
}

// Helper function to calculate category total
function calculateCategoryTotal(category: Category): number {
  if (category.isCalculated) {
    // Calculated categories should be computed outside using the store; fallback to 0 here
    return 0;
  }

  return category.subcategories.reduce((total, subcategory) => {
    return (
      total +
      subcategory.rows.reduce((rowTotal, row) => {
        return (
          rowTotal + row.values.reduce((sum, value) => sum + value.value, 0)
        );
      }, 0)
    );
  }, 0);
}
