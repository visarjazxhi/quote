import type {
  BalanceSheetAccount,
  BalanceSheetSection,
} from "../types/financial";
import { createEmptyValues } from "../types/financial";

export const BS_SECTIONS: ReadonlyArray<{
  key: BalanceSheetSection;
  title: string;
}> = [
  { key: "current_assets", title: "Current Assets" },
  { key: "non_current_assets", title: "Non-Current Assets" },
  { key: "current_liabilities", title: "Current Liabilities" },
  { key: "non_current_liabilities", title: "Non-Current Liabilities" },
  { key: "equity", title: "Equity" },
] as const;

export const BS_ACCOUNTS: ReadonlyArray<{
  name: string;
  section: BalanceSheetSection;
}> = [
  // Current Assets
  { name: "Cash on Hand", section: "current_assets" },
  { name: "Bank Accounts", section: "current_assets" },
  { name: "Petty Cash", section: "current_assets" },
  { name: "Accounts Receivable", section: "current_assets" },
  {
    name: "Allowance for Doubtful Debts (negative)",
    section: "current_assets",
  },
  { name: "Inventory – Raw Materials", section: "current_assets" },
  { name: "Inventory – Finished Goods", section: "current_assets" },
  { name: "Prepaid Expenses", section: "current_assets" },
  { name: "Short-Term Investments", section: "current_assets" },
  { name: "GST Receivable", section: "current_assets" },
  { name: "Other Current Assets", section: "current_assets" },

  // Non-Current Assets
  { name: "Land", section: "non_current_assets" },
  { name: "Buildings", section: "non_current_assets" },
  { name: "Furniture & Fixtures", section: "non_current_assets" },
  { name: "Office Equipment", section: "non_current_assets" },
  { name: "Vehicles", section: "non_current_assets" },
  {
    name: "Accumulated Depreciation (negative)",
    section: "non_current_assets",
  },
  {
    name: "Intangible Assets (e.g., Software, Patents)",
    section: "non_current_assets",
  },
  { name: "Long-Term Investments", section: "non_current_assets" },
  { name: "Deferred Tax Assets", section: "non_current_assets" },
  { name: "Other Non-Current Assets", section: "non_current_assets" },

  // Current Liabilities
  { name: "Accounts Payable", section: "current_liabilities" },
  { name: "Wages Payable", section: "current_liabilities" },
  { name: "Superannuation Payable", section: "current_liabilities" },
  { name: "GST Payable", section: "current_liabilities" },
  { name: "PAYG Withholding Payable", section: "current_liabilities" },
  { name: "Accrued Expenses", section: "current_liabilities" },
  { name: "Short-Term Loans / Bank Overdraft", section: "current_liabilities" },
  {
    name: "Customer Deposits / Unearned Revenue",
    section: "current_liabilities",
  },
  { name: "Current Portion of Long-Term Debt", section: "current_liabilities" },
  { name: "Other Current Liabilities", section: "current_liabilities" },

  // Non-Current Liabilities
  { name: "Long-Term Loans / Borrowings", section: "non_current_liabilities" },
  { name: "Lease Liabilities", section: "non_current_liabilities" },
  { name: "Bonds Payable", section: "non_current_liabilities" },
  {
    name: "Provisions for Employee Benefits",
    section: "non_current_liabilities",
  },
  { name: "Deferred Tax Liabilities", section: "non_current_liabilities" },
  { name: "Other Non-Current Liabilities", section: "non_current_liabilities" },

  // Equity
  { name: "Share Capital / Owner’s Capital", section: "equity" },
  { name: "Additional Paid-In Capital", section: "equity" },
  { name: "Retained Earnings", section: "equity" },
  { name: "Current Year Profit / (Loss)", section: "equity" },
  { name: "Reserves (General, Revaluation, etc.)", section: "equity" },
] as const;

export function createEmptyBalanceSheetAccounts(): BalanceSheetAccount[] {
  return BS_ACCOUNTS.map((acc, index) => ({
    id: `bs_${acc.section}_${index}`,
    name: acc.name,
    section: acc.section,
    order: index + 1,
    values: createEmptyValues(),
  }));
}
