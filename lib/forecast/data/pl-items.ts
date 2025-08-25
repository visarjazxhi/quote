import type { CategoryType } from "../types/financial";

export const INCOME_ITEMS = [
  "Service Revenue",
  "Commissions",
  "Rental Income",
  "Other Operating Revenue",
] as const;

export const COGS_ITEMS = [
  "Raw Materials",
  "Packaging",
  "Direct Labour",
  "Other Direct Costs",
] as const;

export const OPEX_ITEMS = [
  "Accounting",
  "Bank fees",
  "Cleaning",
  "Freight and postage",
  "Insurance",
  "Interest",
  "Marketing and advertising",
  "Motor vehicle expenses",
  "Power",
  "Rent",
  "Repairs and maintenance",
  "Salaries and employee expenses",
  "Stationery",
  "Subscriptions",
  "Tax",
  "Telephone",
  "Uniforms",
  "Website hosting and maintenance",
  "Other",
] as const;

export const OTHER_INCOME_ITEMS = [
  "Interest Income",
  "Dividend Income",
  "Foreign Exchange Gain",
  "Gain on Sale of Assets",
  "Government Grants / Rebates",
  "Miscellaneous other Income",
] as const;

export const OTHER_EXPENSE_ITEMS = [
  "Interest Expense",
  "Foreign Exchange Loss",
  "Loss on Sale of Assets",
  "Bad Debts Written Off",
  "Miscellaneous other Expenses",
] as const;

export type StandardGroup =
  | "income"
  | "cogs"
  | "opex"
  | "other_income"
  | "other_expenses";

export type CategoryTypeKey =
  | "sales_revenue"
  | "cogs"
  | "operating_expenses"
  | "other_income"
  | "financial_expenses"
  | "other_expenses";

export function categoryTypeForItem(
  group: StandardGroup,
  item: string
): CategoryTypeKey {
  if (group === "income") return "sales_revenue";
  if (group === "cogs") return "cogs";
  if (group === "opex") return "operating_expenses";
  if (group === "other_income") return "other_income";
  // other_expenses group: split interest vs others
  if (item.toLowerCase().includes("interest expense"))
    return "financial_expenses";
  return "other_expenses";
}

export const STANDARD_GROUPS: Array<{
  group: StandardGroup;
  title: string;
  items: readonly string[];
}> = [
  { group: "income", title: "1. Income", items: INCOME_ITEMS },
  { group: "cogs", title: "2. Cost of Goods Sold (COGS)", items: COGS_ITEMS },
  { group: "opex", title: "3. Operating Expenses", items: OPEX_ITEMS },
  {
    group: "other_income",
    title: "4. Other Income",
    items: OTHER_INCOME_ITEMS,
  },
  {
    group: "other_expenses",
    title: "5. Other Expenses",
    items: OTHER_EXPENSE_ITEMS,
  },
];

export function categoryDisplayNameFromType(
  type: CategoryType | CategoryTypeKey,
  taxRate?: number
): string {
  if (type === "income_tax_expense") {
    return `9. Income Tax Expense (${taxRate ?? 25}%)`;
  }
  switch (type) {
    case "sales_revenue":
      return "1. Sales Revenue";
    case "cogs":
      return "2. Cost of Goods Sold";
    case "operating_expenses":
      return "4. Operating Expenses";
    case "other_income":
      return "6. Other Income";
    case "financial_expenses":
      return "7. Financial Expenses";
    case "other_expenses":
      return "8. Other Expenses";
    default:
      return String(type);
  }
}
