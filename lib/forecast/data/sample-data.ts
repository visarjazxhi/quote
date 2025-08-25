import { createEmptyValues, generateForecastPeriods } from "../types/financial";

import type { FinancialData } from "../types/financial";

export const sampleFinancialData: FinancialData = {
  categories: [
    // 1. Sales Revenue (Calculated from subcategories)
    {
      id: "revenue",
      name: "1. Sales Revenue",
      type: "sales_revenue",
      order: 1,
      isExpanded: true,
      subcategories: [
        {
          id: "product_sales",
          name: "Product Sales",
          order: 1,
          rows: [
            {
              id: "main_product_sales",
              name: "Main Product Line",
              type: "sales_revenue",
              categoryId: "revenue",
              subcategoryId: "product_sales",
              order: 1,
              values: createEmptyValues(),
            },
          ],
        },
        {
          id: "service_revenue",
          name: "Service Revenue",
          order: 2,
          rows: [
            {
              id: "consulting_services",
              name: "Consulting Services",
              type: "sales_revenue",
              categoryId: "revenue",
              subcategoryId: "service_revenue",
              order: 1,
              values: createEmptyValues(),
            },
          ],
        },
      ],
      isCalculated: true,
      formula: "revenue_subcategories", // Special formula to sum all subcategories
    },

    // 2. Cost of Goods Sold (Calculated from subcategories)
    {
      id: "cogs",
      name: "2. Cost of Goods Sold",
      type: "cogs",
      order: 2,
      isExpanded: true,
      subcategories: [
        {
          id: "direct_materials",
          name: "Direct Materials",
          order: 1,
          rows: [
            {
              id: "raw_materials",
              name: "Raw Materials",
              type: "cogs",
              categoryId: "cogs",
              subcategoryId: "direct_materials",
              order: 1,
              values: createEmptyValues(),
            },
          ],
        },
        {
          id: "direct_labor",
          name: "Direct Labor",
          order: 2,
          rows: [
            {
              id: "production_wages",
              name: "Production Wages",
              type: "cogs",
              categoryId: "cogs",
              subcategoryId: "direct_labor",
              order: 1,
              values: createEmptyValues(),
            },
          ],
        },
      ],
      isCalculated: true,
      formula: "cogs_subcategories", // Special formula to sum all subcategories
    },

    // Gross Profit (Calculated)
    {
      id: "gross_profit",
      name: "3. Gross Profit",
      type: "gross_profit",
      order: 3,
      isExpanded: false,
      subcategories: [],
      isCalculated: true,
      formula: "revenue-cogs",
    },

    // 4. Operating Expenses (Calculated from subcategories)
    {
      id: "operating_expenses",
      name: "4. Operating Expenses",
      type: "operating_expenses",
      order: 4,
      isExpanded: true,
      subcategories: [
        {
          id: "staff_costs",
          name: "4.1 Staff Costs",
          order: 1,
          rows: [
            {
              id: "salaries_wages",
              name: "Salaries & Wages",
              type: "operating_expenses",
              categoryId: "operating_expenses",
              subcategoryId: "staff_costs",
              order: 1,
              values: createEmptyValues(),
            },
            {
              id: "superannuation",
              name: "Superannuation",
              type: "operating_expenses",
              categoryId: "operating_expenses",
              subcategoryId: "staff_costs",
              order: 2,
              values: createEmptyValues(),
            },
          ],
        },
        {
          id: "premises_expenses",
          name: "4.2 Premises Expenses",
          order: 2,
          rows: [
            {
              id: "rent",
              name: "Rent",
              type: "operating_expenses",
              categoryId: "operating_expenses",
              subcategoryId: "premises_expenses",
              order: 1,
              values: createEmptyValues(),
            },
            {
              id: "utilities",
              name: "Utilities",
              type: "operating_expenses",
              categoryId: "operating_expenses",
              subcategoryId: "premises_expenses",
              order: 2,
              values: createEmptyValues(),
            },
          ],
        },
        {
          id: "office_admin",
          name: "4.3 Office & Administrative",
          order: 3,
          rows: [
            {
              id: "office_supplies",
              name: "Office Supplies",
              type: "operating_expenses",
              categoryId: "operating_expenses",
              subcategoryId: "office_admin",
              order: 1,
              values: createEmptyValues(),
            },
            {
              id: "it_costs",
              name: "IT & Software",
              type: "operating_expenses",
              categoryId: "operating_expenses",
              subcategoryId: "office_admin",
              order: 2,
              values: createEmptyValues(),
            },
          ],
        },
        {
          id: "marketing",
          name: "4.4 Marketing & Advertising",
          order: 4,
          rows: [
            {
              id: "digital_marketing",
              name: "Digital Marketing",
              type: "operating_expenses",
              categoryId: "operating_expenses",
              subcategoryId: "marketing",
              order: 1,
              values: createEmptyValues(),
            },
            {
              id: "advertising",
              name: "Advertising",
              type: "operating_expenses",
              categoryId: "operating_expenses",
              subcategoryId: "marketing",
              order: 2,
              values: createEmptyValues(),
            },
          ],
        },
        {
          id: "travel_vehicle",
          name: "4.5 Travel & Vehicle",
          order: 5,
          rows: [
            {
              id: "vehicle_expenses",
              name: "Vehicle Expenses",
              type: "operating_expenses",
              categoryId: "operating_expenses",
              subcategoryId: "travel_vehicle",
              order: 1,
              values: createEmptyValues(),
            },
            {
              id: "travel_expenses",
              name: "Travel Expenses",
              type: "operating_expenses",
              categoryId: "operating_expenses",
              subcategoryId: "travel_vehicle",
              order: 2,
              values: createEmptyValues(),
            },
          ],
        },
        {
          id: "depreciation",
          name: "4.6 Depreciation & Amortisation",
          order: 6,
          rows: [
            {
              id: "depreciation_expense",
              name: "Depreciation Expense",
              type: "operating_expenses",
              categoryId: "operating_expenses",
              subcategoryId: "depreciation",
              order: 1,
              values: createEmptyValues(),
            },
            {
              id: "amortisation_expense",
              name: "Amortisation Expense",
              type: "operating_expenses",
              categoryId: "operating_expenses",
              subcategoryId: "depreciation",
              order: 2,
              values: createEmptyValues(),
            },
          ],
        },
        {
          id: "other_operating",
          name: "4.7 Other Operating Expenses",
          order: 7,
          rows: [
            {
              id: "professional_fees",
              name: "Professional Fees",
              type: "operating_expenses",
              categoryId: "operating_expenses",
              subcategoryId: "other_operating",
              order: 1,
              values: createEmptyValues(),
            },
            {
              id: "insurance",
              name: "Insurance",
              type: "operating_expenses",
              categoryId: "operating_expenses",
              subcategoryId: "other_operating",
              order: 2,
              values: createEmptyValues(),
            },
          ],
        },
      ],
      isCalculated: true,
      formula: "operating_expenses_subcategories", // Special formula to sum all subcategories
    },

    // Operating Profit (EBIT) (Calculated)
    {
      id: "operating_profit",
      name: "5. Operating Profit (EBIT)",
      type: "operating_profit",
      order: 5,
      isExpanded: false,
      subcategories: [],
      isCalculated: true,
      formula: "gross_profit-operating_expenses",
    },

    // 6. Other Income (Calculated from subcategories)
    {
      id: "other_income",
      name: "6. Other Income",
      type: "other_income",
      order: 6,
      isExpanded: true,
      subcategories: [
        {
          id: "investment_income",
          name: "6.1 Investment Income",
          order: 1,
          rows: [
            {
              id: "interest_income",
              name: "Interest Income",
              type: "other_income",
              categoryId: "other_income",
              subcategoryId: "investment_income",
              order: 1,
              values: createEmptyValues(),
            },
            {
              id: "dividend_income",
              name: "Dividend Income",
              type: "other_income",
              categoryId: "other_income",
              subcategoryId: "investment_income",
              order: 2,
              values: createEmptyValues(),
            },
          ],
        },
        {
          id: "other_income_items",
          name: "6.2 Other Income Items",
          order: 2,
          rows: [
            {
              id: "foreign_exchange_gain",
              name: "Foreign Exchange Gain",
              type: "other_income",
              categoryId: "other_income",
              subcategoryId: "other_income_items",
              order: 1,
              values: createEmptyValues(),
            },
          ],
        },
      ],
      isCalculated: true,
      formula: "other_income_subcategories", // Special formula to sum all subcategories
    },

    // 7. Financial Expenses (Calculated from subcategories)
    {
      id: "financial_expenses",
      name: "7. Financial Expenses",
      type: "financial_expenses",
      order: 7,
      isExpanded: true,
      subcategories: [
        {
          id: "interest_expenses",
          name: "7.1 Interest Expenses",
          order: 1,
          rows: [
            {
              id: "loan_interest",
              name: "Loan Interest",
              type: "financial_expenses",
              categoryId: "financial_expenses",
              subcategoryId: "interest_expenses",
              order: 1,
              values: createEmptyValues(),
            },
            {
              id: "bank_charges",
              name: "Bank Charges",
              type: "financial_expenses",
              categoryId: "financial_expenses",
              subcategoryId: "interest_expenses",
              order: 2,
              values: createEmptyValues(),
            },
          ],
        },
      ],
      isCalculated: true,
      formula: "financial_expenses_subcategories", // Special formula to sum all subcategories
    },

    // 8. Other Expenses (Calculated from subcategories)
    {
      id: "other_expenses",
      name: "8. Other Expenses",
      type: "other_expenses",
      order: 8,
      isExpanded: true,
      subcategories: [
        {
          id: "extraordinary_items",
          name: "8.1 Extraordinary Items",
          order: 1,
          rows: [
            {
              id: "litigation_expense",
              name: "Litigation Expense",
              type: "other_expenses",
              categoryId: "other_expenses",
              subcategoryId: "extraordinary_items",
              order: 1,
              values: createEmptyValues(),
            },
          ],
        },
        {
          id: "tax_penalties",
          name: "8.2 Tax & Penalties",
          order: 2,
          rows: [
            {
              id: "tax_penalty",
              name: "Tax Penalties",
              type: "other_expenses",
              categoryId: "other_expenses",
              subcategoryId: "tax_penalties",
              order: 1,
              values: createEmptyValues(),
            },
          ],
        },
      ],
      isCalculated: true,
      formula: "other_expenses_subcategories", // Special formula to sum all subcategories
    },

    // Net Profit Before Tax (Calculated)
    {
      id: "net_profit_before_tax",
      name: "9. Net Profit Before Tax",
      type: "net_profit_before_tax",
      order: 9,
      isExpanded: false,
      subcategories: [],
      isCalculated: true,
      formula:
        "operating_profit+other_income-financial_expenses-other_expenses",
    },
  ],
  forecastPeriods: generateForecastPeriods(),
  lastUpdated: new Date().toISOString(),
  taxRate: 25, // Default 25%
  targetIncome: 1200000, // Sample target income of $1.2M
  balanceSheet: {
    accounts: []
  }
};
