import { createEmptyValues, generateForecastPeriods } from "../types/financial";

import type { FinancialData } from "../types/financial";
import { createEmptyBalanceSheetAccounts } from "./balance-sheet-items";

export const emptyFinancialData: FinancialData = {
  categories: [
    // 1. Sales Revenue - EMPTY
    {
      id: "sales_revenue",
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
              categoryId: "sales_revenue",
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
              categoryId: "sales_revenue",
              subcategoryId: "service_revenue",
              order: 1,
              values: createEmptyValues(),
            },
          ],
        },
      ],
      isCalculated: true,
      formula: "revenue_subcategories",
    },

    // 2. Cost of Goods Sold - EMPTY
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
      formula: "cogs_subcategories",
    },

    // Gross Profit (Calculated) - ALWAYS CALCULATED FROM REAL DATA
    {
      id: "gross_profit",
      name: "Gross Profit",
      type: "gross_profit",
      order: 3,
      isExpanded: false,
      subcategories: [],
      isCalculated: true,
      formula: "sales_revenue-cogs",
    },

    // 3. Operating Expenses - EMPTY
    {
      id: "operating_expenses",
      name: "3. Operating Expenses",
      type: "operating_expenses",
      order: 4,
      isExpanded: true,
      subcategories: [
        // 3.1 Staff Costs
        {
          id: "staff_costs",
          name: "3.1 Staff Costs",
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
        // 3.2 Premises Expenses
        {
          id: "premises_expenses",
          name: "3.2 Premises Expenses",
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
        // 3.3 Office & Administrative Expenses
        {
          id: "office_admin",
          name: "3.3 Office & Administrative",
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
        // 3.4 Marketing & Advertising
        {
          id: "marketing",
          name: "3.4 Marketing & Advertising",
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
        // 3.5 Travel & Motor Vehicle
        {
          id: "travel_vehicle",
          name: "3.5 Travel & Vehicle",
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
        // 3.6 Depreciation & Amortisation
        {
          id: "depreciation",
          name: "3.6 Depreciation & Amortisation",
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
        // 3.7 Other Operating Expenses
        {
          id: "other_operating",
          name: "3.7 Other Operating Expenses",
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
      formula: "operating_expenses_subcategories",
    },

    // Operating Profit (EBIT) (Calculated) - ALWAYS CALCULATED FROM REAL DATA
    {
      id: "operating_profit",
      name: "4. Operating Profit (EBIT)",
      type: "operating_profit",
      order: 5,
      isExpanded: false,
      subcategories: [],
      isCalculated: true,
      formula: "gross_profit-operating_expenses",
    },

    // 5. Other Income - EMPTY
    {
      id: "other_income",
      name: "5. Other Income",
      type: "other_income",
      order: 6,
      isExpanded: true,
      subcategories: [
        {
          id: "investment_income",
          name: "5.1 Investment Income",
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
          name: "5.2 Other Income Items",
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
      formula: "other_income_subcategories",
    },

    // 6. Financial Expenses - EMPTY
    {
      id: "financial_expenses",
      name: "6. Financial Expenses",
      type: "financial_expenses",
      order: 7,
      isExpanded: true,
      subcategories: [
        {
          id: "interest_expenses",
          name: "6.1 Interest Expenses",
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
      formula: "financial_expenses_subcategories",
    },

    // 7. Other Expenses - EMPTY
    {
      id: "other_expenses",
      name: "7. Other Expenses",
      type: "other_expenses",
      order: 8,
      isExpanded: true,
      subcategories: [
        {
          id: "extraordinary_items",
          name: "7.1 Extraordinary Items",
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
          name: "7.2 Tax & Penalties",
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
      formula: "other_expenses_subcategories",
    },

    // 8. Net Profit Before Tax (Calculated) - ALWAYS CALCULATED FROM REAL DATA
    {
      id: "net_profit_before_tax",
      name: "8. Net Profit Before Tax",
      type: "net_profit_before_tax",
      order: 9,
      isExpanded: false,
      subcategories: [],
      isCalculated: true,
      formula:
        "operating_profit+other_income-financial_expenses-other_expenses",
    },

    // 9. Income Tax Expense (Calculated) - ALWAYS CALCULATED FROM REAL DATA
    {
      id: "income_tax_expense",
      name: "9. Income Tax Expense (25%)",
      type: "income_tax_expense",
      order: 10,
      isExpanded: false,
      subcategories: [],
      isCalculated: true,
      formula: "net_profit_before_tax*taxRate/100",
    },

    // 10. Net Profit After Tax (Calculated) - ALWAYS CALCULATED FROM REAL DATA
    {
      id: "net_profit_after_tax",
      name: "10. Net Profit After Tax",
      type: "net_profit_after_tax",
      order: 11,
      isExpanded: false,
      subcategories: [],
      isCalculated: true,
      formula: "net_profit_before_tax-income_tax_expense",
    },
  ],
  forecastPeriods: generateForecastPeriods(),
  lastUpdated: new Date().toISOString(),
  taxRate: 25, // Default 25%
  targetIncome: 0, // Default target income
  balanceSheet: {
    accounts: createEmptyBalanceSheetAccounts(),
  },
};
