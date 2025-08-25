import type {
  Category,
  DateOverlap,
  FinancialData,
  FinancialRow,
  FinancialValue,
  ForecastRecord,
  ScenarioConfig,
  ScenarioOverlap,
  Subcategory,
} from "../types/financial";

import { create } from "zustand";
import { createEmptyBalanceSheetAccounts } from "../data/balance-sheet-items";
import { emptyFinancialData } from "../data/empty-data";
import { persist } from "zustand/middleware";
import { sampleFinancialData } from "../data/sample-data";

interface DataBackup {
  id: string;
  name: string;
  data: FinancialData;
  timestamp: string;
  isUserData: boolean;
}

interface FinancialStore {
  data: FinancialData;
  currentViewType: "monthly" | "yearly";
  forecastRecords: ForecastRecord[];
  scenarios: ScenarioConfig[];
  dataBackups: DataBackup[];
  currentBackupId: string | null;

  // View actions
  setViewType: (type: "monthly" | "yearly") => void;

  // Category actions
  toggleCategory: (categoryId: string) => void;
  reorderCategories: (sourceIndex: number, destinationIndex: number) => void;
  reorderSubcategories: (
    categoryId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
  reorderRows: (
    subcategoryId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;

  // Data actions
  updateRow: (row: FinancialRow) => void;
  updateCategory: (category: Category) => void;
  updateSubcategory: (subcategory: Subcategory) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  addSubcategory: (
    categoryId: string,
    subcategory: Omit<Subcategory, "id">
  ) => void;
  addRow: (row: Omit<FinancialRow, "id">) => void;
  deleteCategory: (categoryId: string) => void;
  deleteSubcategory: (subcategoryId: string) => void;
  deleteRow: (rowId: string) => void;
  updateRowValue: (rowId: string, valueIndex: number, newValue: number) => void;
  setTaxRate: (rate: number) => void;
  setTargetIncome: (target: number) => void;
  updateRowValues: (rowId: string, values: FinancialValue[]) => void;
  resetToEmpty: () => void;
  loadSampleData: () => void;
  forceLoadSampleData: () => void;

  // Data backup and restore actions
  createBackup: (name: string, isUserData?: boolean) => string;
  restoreFromBackup: (backupId: string) => void;
  deleteBackup: (backupId: string) => void;
  listBackups: () => DataBackup[];
  hasUserDataBackup: () => boolean;
  restoreUserData: () => boolean;

  // Forecast record management
  addForecastRecord: (record: Omit<ForecastRecord, "id" | "createdAt">) => void;
  updateForecastRecord: (id: string, updates: Partial<ForecastRecord>) => void;
  deleteForecastRecord: (id: string) => void;
  checkDateOverlap: (
    accountIds: string[],
    startDate: string,
    endDate: string,
    excludeRecordId?: string
  ) => DateOverlap;
  applyForecastRecord: (recordId: string) => void;
  applyForecastConfig: (
    record: Omit<ForecastRecord, "id" | "createdAt">
  ) => void;

  // Scenario management
  addScenario: (scenario: Omit<ScenarioConfig, "id" | "createdAt">) => void;
  updateScenario: (id: string, updates: Partial<ScenarioConfig>) => void;
  deleteScenario: (id: string) => void;
  checkScenarioOverlap: (
    accountIds: string[],
    startDate: string,
    endDate: string,
    excludeScenarioId?: string
  ) => ScenarioOverlap;
  applyScenario: (scenarioId: string) => void;
  applyScenarioConfig: (scenario: ScenarioConfig) => void;

  // Calculation functions
  getCategoryTotal: (categoryId: string) => number;
  getSubcategoryTotal: (subcategoryId: string) => number;
  getRowTotal: (rowId: string) => number;
  getRowYearlyTotal: (rowId: string, year?: number) => number;
  getCategoryYearlyTotal: (categoryId: string, year?: number) => number;
  getCategoryYearlyTotalByType: (categoryType: string, year?: number) => number;
  getCalculatedCategoryValue: (
    categoryId: string,
    valueIndex: number
  ) => number;
  getCalculatedCategoryMonthlyValue: (
    categoryId: string,
    monthIndex: number,
    year: number
  ) => number;

  // Enhanced calculation functions
  getMonthlyData: (year: number) => Record<string, number[]>;
  getYearlyTotals: () => Record<string, number>;
  getGrowthRates: (periods: number) => Record<string, number>;
  getCashFlowData: () => number[];
  getFinancialRatios: () => Record<string, number>;

  // Balance sheet helpers
  updateBalanceSheetValue: (
    accountId: string,
    valueIndex: number,
    newValue: number
  ) => void;
  getBalanceSheetTotals: (year?: number) => {
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
  };
}

export const useFinancialStore = create<FinancialStore>()(
  persist(
    (set, get) => ({
      data: emptyFinancialData,
      currentViewType: "monthly",
      forecastRecords: [],
      scenarios: [],
      dataBackups: [],
      currentBackupId: null,

      setViewType: (type) => set({ currentViewType: type }),

      toggleCategory: (categoryId) =>
        set((state) => ({
          data: {
            ...state.data,
            categories: state.data.categories.map((category) =>
              category.id === categoryId
                ? { ...category, isExpanded: !category.isExpanded }
                : category
            ),
          },
        })),

      reorderCategories: (sourceIndex, destinationIndex) =>
        set((state) => {
          const categories = [...state.data.categories];
          const [removed] = categories.splice(sourceIndex, 1);
          categories.splice(destinationIndex, 0, removed);
          return {
            data: {
              ...state.data,
              categories: categories.map((cat, index) => ({
                ...cat,
                order: index + 1,
              })),
            },
          };
        }),

      reorderSubcategories: (categoryId, sourceIndex, destinationIndex) =>
        set((state) => ({
          data: {
            ...state.data,
            categories: state.data.categories.map((category) => {
              if (category.id === categoryId) {
                const subcategories = [...category.subcategories];
                const [removed] = subcategories.splice(sourceIndex, 1);
                subcategories.splice(destinationIndex, 0, removed);
                return {
                  ...category,
                  subcategories: subcategories.map((sub, index) => ({
                    ...sub,
                    order: index + 1,
                  })),
                };
              }
              return category;
            }),
          },
        })),

      reorderRows: (subcategoryId, sourceIndex, destinationIndex) =>
        set((state) => ({
          data: {
            ...state.data,
            categories: state.data.categories.map((category) => ({
              ...category,
              subcategories: category.subcategories.map((subcategory) => {
                if (subcategory.id === subcategoryId) {
                  const rows = [...subcategory.rows];
                  const [removed] = rows.splice(sourceIndex, 1);
                  rows.splice(destinationIndex, 0, removed);
                  return {
                    ...subcategory,
                    rows: rows.map((row, index) => ({
                      ...row,
                      order: index + 1,
                    })),
                  };
                }
                return subcategory;
              }),
            })),
          },
        })),

      updateRow: (row) =>
        set((state) => ({
          data: {
            ...state.data,
            categories: state.data.categories.map((category) => ({
              ...category,
              subcategories: category.subcategories.map((subcategory) => ({
                ...subcategory,
                rows: subcategory.rows.map((r) => (r.id === row.id ? row : r)),
              })),
            })),
            lastUpdated: new Date().toISOString(),
          },
        })),

      updateCategory: (category) =>
        set((state) => ({
          data: {
            ...state.data,
            categories: state.data.categories.map((c) =>
              c.id === category.id ? category : c
            ),
          },
        })),

      updateSubcategory: (subcategory) =>
        set((state) => ({
          data: {
            ...state.data,
            categories: state.data.categories.map((category) => ({
              ...category,
              subcategories: category.subcategories.map((s) =>
                s.id === subcategory.id ? subcategory : s
              ),
            })),
          },
        })),

      addCategory: (newCategory) =>
        set((state) => {
          const maxOrder = Math.max(
            ...state.data.categories.map((c) => c.order),
            0
          );
          const category: Category = {
            ...newCategory,
            id: crypto.randomUUID(),
            order: maxOrder + 1,
            isExpanded: true,
            subcategories: [],
          };
          return {
            data: {
              ...state.data,
              categories: [...state.data.categories, category],
            },
          };
        }),

      addSubcategory: (categoryId, newSubcategory) =>
        set((state) => ({
          data: {
            ...state.data,
            categories: state.data.categories.map((category) => {
              if (category.id === categoryId) {
                const maxOrder = Math.max(
                  ...category.subcategories.map((s) => s.order),
                  0
                );
                const subcategory: Subcategory = {
                  ...newSubcategory,
                  id: crypto.randomUUID(),
                  order: maxOrder + 1,
                };
                return {
                  ...category,
                  subcategories: [...category.subcategories, subcategory],
                };
              }
              return category;
            }),
          },
        })),

      addRow: (newRow) =>
        set((state) => ({
          data: {
            ...state.data,
            categories: state.data.categories.map((category) => ({
              ...category,
              subcategories: category.subcategories.map((subcategory) => {
                if (subcategory.id === newRow.subcategoryId) {
                  const maxOrder = Math.max(
                    ...subcategory.rows.map((r) => r.order),
                    0
                  );
                  const row: FinancialRow = {
                    ...newRow,
                    id: crypto.randomUUID(),
                    order: maxOrder + 1,
                  };
                  return {
                    ...subcategory,
                    rows: [...subcategory.rows, row],
                  };
                }
                return subcategory;
              }),
            })),
            lastUpdated: new Date().toISOString(),
          },
        })),

      deleteCategory: (categoryId) =>
        set((state) => ({
          data: {
            ...state.data,
            categories: state.data.categories.filter(
              (category) => category.id !== categoryId
            ),
          },
        })),

      deleteSubcategory: (subcategoryId) =>
        set((state) => ({
          data: {
            ...state.data,
            categories: state.data.categories.map((category) => ({
              ...category,
              subcategories: category.subcategories.filter(
                (subcategory) => subcategory.id !== subcategoryId
              ),
            })),
          },
        })),

      deleteRow: (rowId) =>
        set((state) => ({
          data: {
            ...state.data,
            categories: state.data.categories.map((category) => ({
              ...category,
              subcategories: category.subcategories.map((subcategory) => ({
                ...subcategory,
                rows: subcategory.rows.filter((row) => row.id !== rowId),
              })),
            })),
          },
        })),

      updateRowValue: (rowId, valueIndex, newValue) =>
        set((state) => ({
          data: {
            ...state.data,
            categories: state.data.categories.map((category) => ({
              ...category,
              subcategories: category.subcategories.map((subcategory) => ({
                ...subcategory,
                rows: subcategory.rows.map((row) => {
                  if (row.id === rowId) {
                    const newValues = [...row.values];
                    newValues[valueIndex] = {
                      ...newValues[valueIndex],
                      value: newValue,
                    };
                    return { ...row, values: newValues };
                  }
                  return row;
                }),
              })),
            })),
            lastUpdated: new Date().toISOString(),
          },
        })),

      updateRowValues: (rowId, values) =>
        set((state) => ({
          data: {
            ...state.data,
            categories: state.data.categories.map((category) => ({
              ...category,
              subcategories: category.subcategories.map((subcategory) => ({
                ...subcategory,
                rows: subcategory.rows.map((row) => {
                  if (row.id === rowId) {
                    return { ...row, values: values };
                  }
                  return row;
                }),
              })),
            })),
            lastUpdated: new Date().toISOString(),
          },
        })),

      // Balance Sheet: update a single monthly value
      updateBalanceSheetValue: (accountId, valueIndex, newValue) =>
        set((state) => ({
          data: {
            ...state.data,
            balanceSheet: {
              ...state.data.balanceSheet,
              accounts: state.data.balanceSheet.accounts.map((acc) => {
                if (acc.id !== accountId) return acc;
                const values = [...acc.values];
                values[valueIndex] = { ...values[valueIndex], value: newValue };
                return { ...acc, values };
              }),
            },
            lastUpdated: new Date().toISOString(),
          },
        })),

      getBalanceSheetTotals: (year) => {
        const state = get();
        const y = year ?? new Date().getFullYear();
        const accounts = state.data.balanceSheet?.accounts ?? [];
        const sumFor = (section: string) =>
          accounts
            .filter((a) => a.section === section)
            .reduce((sum, acc) => {
              const total = acc.values
                .filter((v) => v.year === y)
                .reduce((s, v) => s + v.value, 0);
              return sum + total;
            }, 0);

        const totalCurrentAssets = sumFor("current_assets");
        const totalNonCurrentAssets = sumFor("non_current_assets");
        const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

        const totalCurrentLiabilities = sumFor("current_liabilities");
        const totalNonCurrentLiabilities = sumFor("non_current_liabilities");
        const totalLiabilities =
          totalCurrentLiabilities + totalNonCurrentLiabilities;

        const totalEquity = sumFor("equity");

        return { totalAssets, totalLiabilities, totalEquity };
      },

      setTaxRate: (rate) =>
        set((state) => ({
          data: {
            ...state.data,
            taxRate: rate,
            lastUpdated: new Date().toISOString(),
          },
        })),

      setTargetIncome: (target) =>
        set((state) => ({
          data: {
            ...state.data,
            targetIncome: target,
            lastUpdated: new Date().toISOString(),
          },
        })),

      resetToEmpty: () =>
        set(() => ({
          data: emptyFinancialData,
          currentViewType: "monthly",
        })),

      // Data backup and restore functions
      createBackup: (name, isUserData = false) => {
        const state = get();
        const backupId = crypto.randomUUID();
        const backup: DataBackup = {
          id: backupId,
          name,
          data: JSON.parse(JSON.stringify(state.data)),
          timestamp: new Date().toISOString(),
          isUserData,
        };

        set((prevState) => ({
          dataBackups: [...prevState.dataBackups, backup],
          currentBackupId: backupId,
        }));

        return backupId;
      },

      restoreFromBackup: (backupId) => {
        const state = get();
        const backup = state.dataBackups.find((b) => b.id === backupId);
        if (backup) {
          set({
            data: JSON.parse(JSON.stringify(backup.data)),
            currentBackupId: backupId,
          });
        }
      },

      deleteBackup: (backupId) => {
        set((state) => ({
          dataBackups: state.dataBackups.filter((b) => b.id !== backupId),
          currentBackupId:
            state.currentBackupId === backupId ? null : state.currentBackupId,
        }));
      },

      listBackups: () => {
        const state = get();
        return [...state.dataBackups].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      },

      hasUserDataBackup: () => {
        const state = get();
        return state.dataBackups.some((backup) => backup.isUserData);
      },

      restoreUserData: () => {
        const state = get();
        const userBackup = state.dataBackups.find(
          (backup) => backup.isUserData
        );
        if (userBackup) {
          state.restoreFromBackup(userBackup.id);
          return true;
        }
        return false;
      },

      // Add function to load sample data
      loadSampleData: () =>
        set((state) => {
          // First, create a backup of current data if it's not empty
          const hasData = state.data.categories.some(
            (cat) =>
              !cat.isCalculated &&
              cat.subcategories.some((sub) =>
                sub.rows.some((row) =>
                  row.values.some((val) => val.value !== 0)
                )
              )
          );

          if (hasData && !state.hasUserDataBackup()) {
            state.createBackup("User Data Backup", true);
          }

          // Create sample data with realistic values
          const sampleData = JSON.parse(
            JSON.stringify(sampleFinancialData)
          ) as FinancialData;

          // Add realistic sample values for 2024
          sampleData.categories.forEach((category) => {
            if (category.isCalculated) return;

            category.subcategories.forEach((subcategory) => {
              subcategory.rows.forEach((row) => {
                // Add sample values based on category type
                row.values = row.values.map((value, index) => {
                  const month = (index % 12) + 1;
                  const year = Math.floor(index / 12) + 2024;

                  // Only populate 2024 data for now
                  if (year > 2024) return value;

                  let sampleValue = 0;

                  switch (category.type) {
                    case "sales_revenue":
                      // Revenue grows from 15k to 25k per month with seasonal variation
                      const baseRevenue = 15000 + month * 800;
                      const seasonality =
                        1 + 0.1 * Math.sin(((month - 1) * Math.PI) / 6);
                      sampleValue =
                        baseRevenue * seasonality +
                        (Math.random() * 2000 - 1000);
                      break;
                    case "cogs":
                      // COGS is about 40% of revenue with some variation
                      const revenue = 15000 + month * 800;
                      const revenueSeasonality =
                        1 + 0.1 * Math.sin(((month - 1) * Math.PI) / 6);
                      const adjustedRevenue = revenue * revenueSeasonality;
                      if (
                        row.name.includes("Raw Materials") ||
                        row.name.includes("Materials")
                      ) {
                        sampleValue = -(
                          adjustedRevenue * 0.25 +
                          Math.random() * 500
                        );
                      } else if (
                        row.name.includes("Labor") ||
                        row.name.includes("Wages")
                      ) {
                        sampleValue = -(
                          adjustedRevenue * 0.15 +
                          Math.random() * 300
                        );
                      } else {
                        sampleValue = -(
                          adjustedRevenue * 0.1 +
                          Math.random() * 200
                        );
                      }
                      break;
                    case "operating_expenses":
                      // Operating expenses vary by subcategory
                      switch (subcategory.id) {
                        case "staff_costs":
                          sampleValue = row.name.includes("Salaries")
                            ? -(8000 + month * 100 + Math.random() * 1000)
                            : -(800 + month * 10 + Math.random() * 100);
                          break;
                        case "premises_expenses":
                          sampleValue = row.name.includes("Rent")
                            ? -2500
                            : -(300 + Math.random() * 100);
                          break;
                        case "office_admin":
                          sampleValue = -(
                            500 +
                            month * 25 +
                            Math.random() * 200
                          );
                          break;
                        case "marketing":
                          sampleValue = -(
                            1000 +
                            month * 50 +
                            Math.random() * 500
                          );
                          break;
                        case "travel_vehicle":
                          sampleValue = -(200 + Math.random() * 100);
                          break;
                        case "depreciation":
                          sampleValue = -(400 + Math.random() * 50);
                          break;
                        case "other_operating":
                          sampleValue = -(300 + Math.random() * 150);
                          break;
                        default:
                          sampleValue = -(150 + Math.random() * 75);
                      }
                      break;
                    case "other_income":
                      sampleValue = 100 + Math.random() * 300;
                      break;
                    case "financial_expenses":
                      sampleValue = -(150 + Math.random() * 50);
                      break;
                    case "other_expenses":
                      sampleValue = -(50 + Math.random() * 25);
                      break;
                  }

                  return {
                    ...value,
                    value: Math.round(sampleValue),
                    isProjected: month > new Date().getMonth() + 1,
                  };
                });
              });
            });
          });

          return {
            data: sampleData,
            currentViewType: "monthly",
          };
        }),

      forceLoadSampleData: () =>
        set((state) => {
          // First, create a backup of current data if it's not empty
          const hasData = state.data.categories.some(
            (cat) =>
              !cat.isCalculated &&
              cat.subcategories.some((sub) =>
                sub.rows.some((row) =>
                  row.values.some((val) => val.value !== 0)
                )
              )
          );

          if (hasData && !state.hasUserDataBackup()) {
            state.createBackup("User Data Backup", true);
          }

          // Create sample data with realistic values
          const sampleData = JSON.parse(
            JSON.stringify(sampleFinancialData)
          ) as FinancialData;

          // Add realistic sample values for 2024
          sampleData.categories.forEach((category) => {
            if (category.isCalculated) return;

            category.subcategories.forEach((subcategory) => {
              subcategory.rows.forEach((row) => {
                // Add sample values based on category type
                row.values = row.values.map((value, index) => {
                  const month = (index % 12) + 1;
                  const year = Math.floor(index / 12) + 2024;

                  // Only populate 2024 data for now
                  if (year > 2024) return value;

                  let sampleValue = 0;

                  switch (category.type) {
                    case "sales_revenue":
                      // Revenue grows from 15k to 25k per month with seasonal variation
                      const baseRevenue = 15000 + month * 800;
                      const seasonality =
                        1 + 0.1 * Math.sin(((month - 1) * Math.PI) / 6);
                      sampleValue =
                        baseRevenue * seasonality +
                        (Math.random() * 2000 - 1000);
                      break;
                    case "cogs":
                      // COGS is about 40% of revenue with some variation
                      const revenue = 15000 + month * 800;
                      const revenueSeasonality =
                        1 + 0.1 * Math.sin(((month - 1) * Math.PI) / 6);
                      const adjustedRevenue = revenue * revenueSeasonality;
                      if (
                        row.name.includes("Raw Materials") ||
                        row.name.includes("Materials")
                      ) {
                        sampleValue = -(
                          adjustedRevenue * 0.25 +
                          Math.random() * 500
                        );
                      } else if (
                        row.name.includes("Labor") ||
                        row.name.includes("Wages")
                      ) {
                        sampleValue = -(
                          adjustedRevenue * 0.15 +
                          Math.random() * 300
                        );
                      } else {
                        sampleValue = -(
                          adjustedRevenue * 0.1 +
                          Math.random() * 200
                        );
                      }
                      break;
                    case "operating_expenses":
                      // Operating expenses vary by subcategory
                      switch (subcategory.id) {
                        case "staff_costs":
                          sampleValue = row.name.includes("Salaries")
                            ? -(8000 + month * 100 + Math.random() * 1000)
                            : -(800 + month * 10 + Math.random() * 100);
                          break;
                        case "premises_expenses":
                          sampleValue = row.name.includes("Rent")
                            ? -2500
                            : -(300 + Math.random() * 100);
                          break;
                        case "office_admin":
                          sampleValue = -(
                            500 +
                            month * 25 +
                            Math.random() * 200
                          );
                          break;
                        case "marketing":
                          sampleValue = -(
                            1000 +
                            month * 50 +
                            Math.random() * 500
                          );
                          break;
                        case "travel_vehicle":
                          sampleValue = -(200 + Math.random() * 100);
                          break;
                        case "depreciation":
                          sampleValue = -(400 + Math.random() * 50);
                          break;
                        case "other_operating":
                          sampleValue = -(300 + Math.random() * 150);
                          break;
                        default:
                          sampleValue = -(150 + Math.random() * 75);
                      }
                      break;
                    case "other_income":
                      sampleValue = 100 + Math.random() * 300;
                      break;
                    case "financial_expenses":
                      sampleValue = -(150 + Math.random() * 50);
                      break;
                    case "other_expenses":
                      sampleValue = -(50 + Math.random() * 25);
                      break;
                  }

                  return {
                    ...value,
                    value: Math.round(sampleValue),
                    isProjected: month > new Date().getMonth() + 1,
                  };
                });
              });
            });
          });

          return {
            data: sampleData,
            currentViewType: "monthly",
          };
        }),

      // Forecast record management
      addForecastRecord: (record) =>
        set((state) => ({
          forecastRecords: [
            ...state.forecastRecords,
            {
              ...record,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateForecastRecord: (id, updates) =>
        set((state) => ({
          forecastRecords: state.forecastRecords.map((record) =>
            record.id === id ? { ...record, ...updates } : record
          ),
        })),

      deleteForecastRecord: (id) =>
        set((state) => ({
          forecastRecords: state.forecastRecords.filter(
            (record) => record.id !== id
          ),
        })),

      checkDateOverlap: (accountIds, startDate, endDate, excludeRecordId) => {
        const state = get();
        const relevantRecords = state.forecastRecords.filter(
          (record) =>
            record.id !== excludeRecordId &&
            record.status === "active" &&
            record.accountIds.some((id) => accountIds.includes(id))
        );

        const overlappingRecords: ForecastRecord[] = [];
        const overlappingAccountIds: string[] = [];

        relevantRecords.forEach((record) => {
          const recordStart = new Date(record.startDate);
          const recordEnd = new Date(record.endDate);
          const checkStart = new Date(startDate);
          const checkEnd = new Date(endDate);

          const hasDateOverlap =
            checkStart <= recordEnd && checkEnd >= recordStart;

          if (hasDateOverlap) {
            overlappingRecords.push(record);
            record.accountIds.forEach((accountId) => {
              if (
                accountIds.includes(accountId) &&
                !overlappingAccountIds.includes(accountId)
              ) {
                overlappingAccountIds.push(accountId);
              }
            });
          }
        });

        return {
          hasOverlap: overlappingRecords.length > 0,
          overlappingRecords,
          overlappingAccountIds,
        };
      },

      applyForecastRecord: (recordId) => {
        const state = get();
        const record = state.forecastRecords.find((r) => r.id === recordId);
        if (!record) return;
        state.applyForecastConfig({
          name: record.name,
          accountIds: record.accountIds,
          method: record.method,
          parameters: record.parameters,
          startDate: record.startDate,
          endDate: record.endDate,
          status: record.status,
        });
      },

      applyForecastConfig: (record) => {
        const state = get();
        const { accountIds, method, parameters, startDate, endDate } = record;

        // Convert dates to year/month boundaries (full months only)
        const start = new Date(startDate);
        const end = new Date(endDate);
        const startYear = start.getFullYear();
        const startMonth = start.getMonth() + 1; // 1-12
        const endYear = end.getFullYear();
        const endMonth = end.getMonth() + 1; // 1-12

        // Build list of (year, month) tuples inclusive
        const months: Array<{ year: number; month: number }> = [];
        let y = startYear;
        let m = startMonth;
        while (y < endYear || (y === endYear && m <= endMonth)) {
          months.push({ year: y, month: m });
          m += 1;
          if (m > 12) {
            m = 1;
            y += 1;
          }
        }

        // Helper to get the last existing value before the forecast window for a row
        const getLastValueBefore = (
          row: FinancialRow,
          year: number,
          month: number
        ): number => {
          // Find December of previous year starting point or last non-projected value if available
          // We will use the immediate previous month in the dataset as base
          const prevIndex =
            row.values.findIndex((v) => v.year === year && v.month === month) -
            1;
          if (prevIndex >= 0) {
            return row.values[prevIndex].value;
          }
          // If first month of dataset, fallback to 0
          return 0;
        };

        // Apply changes to selected accounts
        const updatedCategories = state.data.categories.map((category) => ({
          ...category,
          subcategories: category.subcategories.map((subcategory) => ({
            ...subcategory,
            rows: subcategory.rows.map((row) => {
              if (!accountIds.includes(row.id)) return row;

              // Clone values to mutate
              const newValues = [...row.values];

              if (method === "growth_rate") {
                const rate = ((parameters.growthRate as number) ?? 0) / 100;
                let baseValue: number | null = null;
                months.forEach(({ year, month }, idx) => {
                  const i = newValues.findIndex(
                    (v) => v.year === year && v.month === month
                  );
                  if (i === -1) return;
                  if (idx === 0) {
                    // Base: previous month value; if not found, use existing value at month
                    const prevVal = getLastValueBefore(row, year, month);
                    baseValue =
                      prevVal !== undefined ? prevVal : newValues[i].value;
                    newValues[i] = {
                      ...newValues[i],
                      value: Math.round((baseValue ?? 0) * (1 + rate)),
                      isProjected: true,
                    };
                  } else {
                    const prev =
                      newValues[
                        newValues.findIndex(
                          (v) =>
                            v.year === (month === 1 ? year - 1 : year) &&
                            v.month === (month === 1 ? 12 : month - 1)
                        )
                      ]?.value ??
                      baseValue ??
                      0;
                    newValues[i] = {
                      ...newValues[i],
                      value: Math.round(prev * (1 + rate)),
                      isProjected: true,
                    };
                  }
                });
              }

              if (method === "fixed_amount") {
                const amt = (parameters.fixedAmount as number) ?? 0;
                months.forEach(({ year, month }) => {
                  const i = newValues.findIndex(
                    (v) => v.year === year && v.month === month
                  );
                  if (i === -1) return;
                  newValues[i] = {
                    ...newValues[i],
                    value: Math.round(amt),
                    isProjected: true,
                  };
                });
              }

              return { ...row, values: newValues };
            }),
          })),
        }));

        set({
          data: {
            ...state.data,
            categories: updatedCategories,
            lastUpdated: new Date().toISOString(),
          },
        });
      },

      // Scenario management implementation
      addScenario: (scenario) =>
        set((state) => ({
          scenarios: [
            ...state.scenarios,
            {
              ...scenario,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateScenario: (id, updates) =>
        set((state) => ({
          scenarios: state.scenarios.map((scenario) =>
            scenario.id === id ? { ...scenario, ...updates } : scenario
          ),
        })),

      deleteScenario: (id) =>
        set((state) => ({
          scenarios: state.scenarios.filter((scenario) => scenario.id !== id),
        })),

      checkScenarioOverlap: (
        accountIds,
        startDate,
        endDate,
        excludeScenarioId
      ) => {
        const state = get();
        const relevantScenarios = state.scenarios.filter(
          (scenario) =>
            scenario.id !== excludeScenarioId &&
            scenario.status === "active" &&
            scenario.accountIds.some((id) => accountIds.includes(id))
        );

        const overlappingScenarios: ScenarioConfig[] = [];
        const overlappingAccountIds: string[] = [];

        relevantScenarios.forEach((scenario) => {
          const scenarioStart = new Date(scenario.startDate);
          const scenarioEnd = new Date(scenario.endDate);
          const checkStart = new Date(startDate);
          const checkEnd = new Date(endDate);

          const hasDateOverlap =
            checkStart <= scenarioEnd && checkEnd >= scenarioStart;

          if (hasDateOverlap) {
            overlappingScenarios.push(scenario);
            scenario.accountIds.forEach((accountId) => {
              if (
                accountIds.includes(accountId) &&
                !overlappingAccountIds.includes(accountId)
              ) {
                overlappingAccountIds.push(accountId);
              }
            });
          }
        });

        return {
          hasOverlap: overlappingScenarios.length > 0,
          overlappingScenarios,
          overlappingAccountIds,
        };
      },

      applyScenario: (scenarioId) => {
        const state = get();
        const scenario = state.scenarios.find((s) => s.id === scenarioId);
        if (!scenario) return;
        state.applyScenarioConfig(scenario);
      },

      applyScenarioConfig: (scenario) => {
        const state = get();
        const { accountIds, type, value, startDate, endDate } = scenario;

        // Convert dates to year/month boundaries (full months only)
        const start = new Date(startDate);
        const end = new Date(endDate);
        const startYear = start.getFullYear();
        const startMonth = start.getMonth() + 1; // 1-12
        const endYear = end.getFullYear();
        const endMonth = end.getMonth() + 1; // 1-12

        // Build list of (year, month) tuples inclusive
        const months: Array<{ year: number; month: number }> = [];
        let y = startYear;
        let m = startMonth;
        while (y < endYear || (y === endYear && m <= endMonth)) {
          months.push({ year: y, month: m });
          m += 1;
          if (m > 12) {
            m = 1;
            y += 1;
          }
        }

        // Helper to get the last existing value before the scenario window for a row
        const getLastValueBefore = (
          row: FinancialRow,
          year: number,
          month: number
        ): number => {
          const prevIndex =
            row.values.findIndex((v) => v.year === year && v.month === month) -
            1;
          return prevIndex >= 0 ? row.values[prevIndex].value : 0;
        };

        // Apply changes to selected accounts
        const updatedCategories = state.data.categories.map((category) => ({
          ...category,
          subcategories: category.subcategories.map((subcategory) => ({
            ...subcategory,
            rows: subcategory.rows.map((row) => {
              if (!accountIds.includes(row.id)) return row;

              // Clone values to mutate
              const newValues = [...row.values];

              if (type === "percentage") {
                const rate = value / 100;
                let baseValue: number | null = null;
                months.forEach(({ year, month }, idx) => {
                  const i = newValues.findIndex(
                    (v) => v.year === year && v.month === month
                  );
                  if (i === -1) return;
                  if (idx === 0) {
                    // Base: previous month value; if not found, use existing value at month
                    const prevVal = getLastValueBefore(row, year, month);
                    baseValue =
                      prevVal !== undefined ? prevVal : newValues[i].value;
                    newValues[i] = {
                      ...newValues[i],
                      value: Math.round((baseValue ?? 0) * (1 + rate)),
                      isProjected: true,
                    };
                  } else {
                    const prev =
                      newValues[
                        newValues.findIndex(
                          (v) =>
                            v.year === (month === 1 ? year - 1 : year) &&
                            v.month === (month === 1 ? 12 : month - 1)
                        )
                      ]?.value ??
                      baseValue ??
                      0;
                    newValues[i] = {
                      ...newValues[i],
                      value: Math.round(prev * (1 + rate)),
                      isProjected: true,
                    };
                  }
                });
              }

              if (type === "amount") {
                months.forEach(({ year, month }) => {
                  const i = newValues.findIndex(
                    (v) => v.year === year && v.month === month
                  );
                  if (i === -1) return;
                  newValues[i] = {
                    ...newValues[i],
                    value: Math.round(value),
                    isProjected: true,
                  };
                });
              }

              return { ...row, values: newValues };
            }),
          })),
        }));

        set({
          data: {
            ...state.data,
            categories: updatedCategories,
            lastUpdated: new Date().toISOString(),
          },
        });
      },

      getCategoryTotal: (categoryId) => {
        const state = get();
        const category = state.data.categories.find((c) => c.id === categoryId);
        if (!category) return 0;

        if (category.isCalculated) {
          return state.getCalculatedCategoryValue(categoryId, -1); // -1 for total
        }

        return category.subcategories.reduce(
          (total, sub) => total + state.getSubcategoryTotal(sub.id),
          0
        );
      },

      getSubcategoryTotal: (subcategoryId) => {
        const state = get();
        let total = 0;
        state.data.categories.forEach((category) => {
          category.subcategories.forEach((subcategory) => {
            if (subcategory.id === subcategoryId) {
              total = subcategory.rows.reduce(
                (sum, row) => sum + state.getRowTotal(row.id),
                0
              );
            }
          });
        });
        return total;
      },

      getRowTotal: (rowId) => {
        const state = get();
        let total = 0;
        state.data.categories.forEach((category) => {
          category.subcategories.forEach((subcategory) => {
            subcategory.rows.forEach((row) => {
              if (row.id === rowId) {
                total = row.values.reduce((sum, value) => sum + value.value, 0);
              }
            });
          });
        });
        return total;
      },

      getRowYearlyTotal: (rowId, year) => {
        const state = get();
        let total = 0;
        state.data.categories.forEach((category) => {
          category.subcategories.forEach((subcategory) => {
            subcategory.rows.forEach((row) => {
              if (row.id === rowId) {
                total = row.values.reduce((sum, value) => {
                  if (year && value.year !== year) return sum;
                  return sum + value.value;
                }, 0);
              }
            });
          });
        });
        return total;
      },

      getCategoryYearlyTotal: (categoryId, year) => {
        const state = get();
        const category = state.data.categories.find((c) => c.id === categoryId);
        if (!category) return 0;

        if (category.isCalculated) {
          if (!year) return state.getCalculatedCategoryValue(categoryId, -1);
          const months = Array.from({ length: 12 }, (_, idx) =>
            state.getCalculatedCategoryMonthlyValue(categoryId, idx, year)
          );
          return months.reduce((a, b) => a + b, 0);
        }

        return category.subcategories.reduce(
          (total, sub) =>
            total +
            sub.rows.reduce(
              (rowTotal, row) =>
                rowTotal + state.getRowYearlyTotal(row.id, year),
              0
            ),
          0
        );
      },

      // Helper function to get totals by category type instead of ID
      getCategoryYearlyTotalByType: (categoryType, year) => {
        const state = get();
        const category = state.data.categories.find(
          (c) => c.type === categoryType
        );
        if (!category) return 0;

        // For calculated categories, use the calculation logic
        if (category.isCalculated) {
          if (!year) return state.getCalculatedCategoryValue(category.id, -1);
          const months = Array.from({ length: 12 }, (_, idx) =>
            state.getCalculatedCategoryMonthlyValue(category.id, idx, year)
          );
          return months.reduce((a, b) => a + b, 0);
        }

        return state.getCategoryYearlyTotal(category.id, year);
      },

      getCalculatedCategoryValue: (categoryId, valueIndex) => {
        const state = get();
        const category = state.data.categories.find((c) => c.id === categoryId);
        if (!category?.isCalculated || !category.formula) return 0;

        const formula = category.formula;

        // Special handling for subcategory summation formulas
        if (
          formula === "revenue_subcategories" ||
          formula === "cogs_subcategories" ||
          formula === "operating_expenses_subcategories" ||
          formula === "other_income_subcategories" ||
          formula === "financial_expenses_subcategories" ||
          formula === "other_expenses_subcategories"
        ) {
          // Sum all subcategories for the category
          return category.subcategories.reduce((total, subcategory) => {
            return (
              total +
              subcategory.rows.reduce((subTotal, row) => {
                if (valueIndex === -1) {
                  // Get total for all periods
                  return (
                    subTotal +
                    row.values.reduce((sum, value) => sum + value.value, 0)
                  );
                } else {
                  // Get specific month value
                  const currentYear =
                    state.data.forecastPeriods[0]?.year || 2024;
                  const monthValue = row.values.find(
                    (v) => v.month === valueIndex + 1 && v.year === currentYear
                  );
                  return subTotal + (monthValue?.value || 0);
                }
              }, 0)
            );
          }, 0);
        }

        // Special handling for tax calculation formula
        if (formula === "net_profit_before_tax*taxRate/100") {
          const netProfitBeforeTax = state.getCalculatedCategoryValue(
            "net_profit_before_tax",
            valueIndex
          );
          const taxRate = state.data.taxRate;
          // No tax if there's a loss (negative net profit before tax)
          return netProfitBeforeTax > 0
            ? (netProfitBeforeTax * taxRate) / 100
            : 0;
        }

        const parts = formula.match(/[+\-*/]|\w+/g) || [];

        let result = 0;
        let operator = "+";

        for (const part of parts) {
          if (["+", "-", "*", "/"].includes(part)) {
            operator = part;
            continue;
          }

          let value = 0;
          if (part === "taxRate") {
            value = state.data.taxRate;
          } else {
            // Look for category by type (the formula uses type names)
            const targetCategory = state.data.categories.find(
              (c) => c.type === part || c.id === part
            );
            if (!targetCategory) continue;

            if (valueIndex === -1) {
              // Get total
              value = targetCategory.isCalculated
                ? state.getCalculatedCategoryValue(targetCategory.id, -1)
                : state.getCategoryYearlyTotal(targetCategory.id);
            } else {
              // Get specific month value - this should not be used for monthly calculations
              // Use getCalculatedCategoryMonthlyValue instead for proper year context
              value = targetCategory.isCalculated
                ? state.getCalculatedCategoryValue(
                    targetCategory.id,
                    valueIndex
                  )
                : targetCategory.subcategories.reduce((total, sub) => {
                    return (
                      total +
                      sub.rows.reduce((rowTotal, row) => {
                        // Find the value for the specific month (valueIndex + 1) in the current year
                        // Use the first year in forecast periods as default, or get from current context
                        const currentYear =
                          state.data.forecastPeriods[0]?.year || 2024;
                        const monthValue = row.values.find(
                          (v) =>
                            v.month === valueIndex + 1 && v.year === currentYear
                        );
                        return rowTotal + (monthValue?.value || 0);
                      }, 0)
                    );
                  }, 0);
            }
          }

          switch (operator) {
            case "+":
              result += value;
              break;
            case "-":
              result -= value;
              break;
            case "*":
              result *= value;
              break;
            case "/":
              result /= value || 1; // Avoid division by zero
              break;
          }
        }

        return result;
      },

      // New function for monthly calculations with year context
      getCalculatedCategoryMonthlyValue: (categoryId, monthIndex, year) => {
        const state = get();
        const category = state.data.categories.find((c) => c.id === categoryId);
        if (!category?.isCalculated || !category.formula) return 0;

        const formula = category.formula;

        // Special handling for subcategory summation formulas
        if (
          formula === "revenue_subcategories" ||
          formula === "cogs_subcategories" ||
          formula === "operating_expenses_subcategories" ||
          formula === "other_income_subcategories" ||
          formula === "financial_expenses_subcategories" ||
          formula === "other_expenses_subcategories"
        ) {
          // Sum all subcategories for the category for the specific month and year
          return category.subcategories.reduce((total, subcategory) => {
            return (
              total +
              subcategory.rows.reduce((subTotal, row) => {
                // Find the value for the specific month in the given year
                const monthValue = row.values.find(
                  (v) => v.month === monthIndex + 1 && v.year === year
                );
                return subTotal + (monthValue?.value || 0);
              }, 0)
            );
          }, 0);
        }

        // Special handling for tax calculation formula
        if (formula === "net_profit_before_tax*taxRate/100") {
          const netProfitBeforeTax = state.getCalculatedCategoryMonthlyValue(
            "net_profit_before_tax",
            monthIndex,
            year
          );
          const taxRate = state.data.taxRate;
          // No tax if there's a loss (negative net profit before tax)
          return netProfitBeforeTax > 0
            ? (netProfitBeforeTax * taxRate) / 100
            : 0;
        }

        const parts = formula.match(/[+\-*/]|\w+/g) || [];

        let result = 0;
        let operator = "+";

        for (const part of parts) {
          if (["+", "-", "*", "/"].includes(part)) {
            operator = part;
            continue;
          }

          let value = 0;
          if (part === "taxRate") {
            value = state.data.taxRate;
          } else {
            // Look for category by type (the formula uses type names)
            const targetCategory = state.data.categories.find(
              (c) => c.type === part || c.id === part
            );
            if (!targetCategory) continue;

            // Get specific month value for the given year
            value = targetCategory.isCalculated
              ? state.getCalculatedCategoryMonthlyValue(
                  targetCategory.id,
                  monthIndex,
                  year
                )
              : targetCategory.subcategories.reduce((total, sub) => {
                  return (
                    total +
                    sub.rows.reduce((rowTotal, row) => {
                      // Find the value for the specific month in the given year
                      const monthValue = row.values.find(
                        (v) => v.month === monthIndex + 1 && v.year === year
                      );
                      return rowTotal + (monthValue?.value || 0);
                    }, 0)
                  );
                }, 0);
          }

          switch (operator) {
            case "+":
              result += value;
              break;
            case "-":
              result -= value;
              break;
            case "*":
              result *= value;
              break;
            case "/":
              result /= value || 1; // Avoid division by zero
              break;
          }
        }

        return result;
      },

      // Enhanced calculation functions
      getMonthlyData: (year) => {
        const state = get();
        const monthlyData: Record<string, number[]> = {};

        state.data.categories.forEach((category) => {
          if (category.isCalculated) {
            // For calculated categories, get proper monthly values using the monthly calculation function
            monthlyData[category.id] = Array.from(
              { length: 12 },
              (_, monthIndex) =>
                state.getCalculatedCategoryMonthlyValue(
                  category.id,
                  monthIndex,
                  year
                )
            );

            // Also add by category type for easier access
            monthlyData[category.type] = monthlyData[category.id];
          } else {
            // For non-calculated categories, get monthly totals
            const monthlyValues = Array(12).fill(0);
            category.subcategories.forEach((subcategory) => {
              subcategory.rows.forEach((row) => {
                row.values.forEach((value) => {
                  if (
                    value.year === year &&
                    value.month >= 1 &&
                    value.month <= 12
                  ) {
                    monthlyValues[value.month - 1] += value.value;
                  }
                });
              });
            });
            monthlyData[category.id] = monthlyValues;

            // Also add by category type for easier access
            monthlyData[category.type] = monthlyValues;
          }
        });

        // Add calculated categories that might not exist in the data structure but are referenced by components
        if (!monthlyData["operating_profit"]) {
          const revenueData = monthlyData["sales_revenue"] || Array(12).fill(0);
          const cogsData = monthlyData["cogs"] || Array(12).fill(0);
          const opexData =
            monthlyData["operating_expenses"] || Array(12).fill(0);

          monthlyData["operating_profit"] = revenueData.map(
            (revenue, index) =>
              revenue - Math.abs(cogsData[index]) - Math.abs(opexData[index])
          );
        }

        return monthlyData;
      },

      getYearlyTotals: () => {
        const state = get();
        const yearlyTotals: Record<string, number> = {};

        state.data.categories.forEach((category) => {
          if (category.isCalculated) {
            yearlyTotals[category.id] = state.getCalculatedCategoryValue(
              category.id,
              -1
            );
          } else {
            yearlyTotals[category.id] = category.subcategories.reduce(
              (total, sub) =>
                total +
                sub.rows.reduce(
                  (rowTotal, row) => rowTotal + state.getRowYearlyTotal(row.id),
                  0
                ),
              0
            );
          }
        });

        return yearlyTotals;
      },

      getGrowthRates: () => {
        const state = get();
        const growthRates: Record<string, number> = {};

        state.data.categories.forEach((category) => {
          const years = Array.from(
            new Set(state.data.forecastPeriods.map((p) => p.year))
          ).sort((a, b) => a - b);
          const latestYear = years[years.length - 1];
          const prevYear =
            years.length > 1 ? years[years.length - 2] : undefined;
          if (!latestYear || !prevYear) {
            growthRates[category.id] = 0;
            return;
          }
          const currentTotal = get().getCategoryYearlyTotal(
            category.id,
            latestYear
          );
          const previousTotal = get().getCategoryYearlyTotal(
            category.id,
            prevYear
          );
          growthRates[category.id] =
            previousTotal === 0
              ? 0
              : ((currentTotal - previousTotal) / previousTotal) * 100;
        });

        return growthRates;
      },

      getCashFlowData: () => {
        const state = get();
        const cashFlow: number[] = Array(12).fill(0);

        // Use the model's first forecast year as active year
        const currentYear =
          state.data.forecastPeriods[0]?.year || new Date().getFullYear();

        state.data.categories.forEach((category) => {
          if (category.isCalculated) {
            // For calculated categories, get proper monthly values
            for (let month = 0; month < 12; month++) {
              const monthlyValue = state.getCalculatedCategoryMonthlyValue(
                category.id,
                month,
                currentYear
              );
              cashFlow[month] += monthlyValue;
            }
          } else {
            // For non-calculated categories, sum up monthly values
            category.subcategories.forEach((subcategory) => {
              subcategory.rows.forEach((row) => {
                row.values.forEach((value) => {
                  if (
                    value.year === currentYear &&
                    value.month >= 1 &&
                    value.month <= 12
                  ) {
                    cashFlow[value.month - 1] += value.value;
                  }
                });
              });
            });
          }
        });

        return cashFlow;
      },

      getFinancialRatios: () => {
        const state = get();
        const ratios: Record<string, number> = {};

        // Use model's first forecast year as default year context
        const currentYear =
          state.data.forecastPeriods[0]?.year ?? new Date().getFullYear();

        // Get key financial metrics using actual P&L data scoped to year
        const revenue = state.getCategoryYearlyTotalByType(
          "sales_revenue",
          currentYear
        );
        const cogs = Math.abs(
          state.getCategoryYearlyTotalByType("cogs", currentYear)
        );
        const grossProfit = revenue - cogs;
        const operatingExpenses = Math.abs(
          state.getCategoryYearlyTotalByType("operating_expenses", currentYear)
        );
        const otherIncome = state.getCategoryYearlyTotalByType(
          "other_income",
          currentYear
        );
        const financialExpenses = Math.abs(
          state.getCategoryYearlyTotalByType("financial_expenses", currentYear)
        );
        const otherExpenses = Math.abs(
          state.getCategoryYearlyTotalByType("other_expenses", currentYear)
        );

        // Calculate operating profit more accurately
        const operatingProfit = grossProfit - operatingExpenses;

        // Calculate net profit before tax using all P&L components
        const netProfitBeforeTax =
          operatingProfit + otherIncome - financialExpenses - otherExpenses;

        // Calculate tax expense
        const taxExpense =
          netProfitBeforeTax > 0
            ? netProfitBeforeTax * ((state.data.taxRate ?? 25) / 100)
            : 0;
        const netProfitAfterTax = netProfitBeforeTax - taxExpense;

        // Calculate actual financial ratios from P&L data
        ratios["Gross Profit Margin"] =
          revenue > 0 ? (grossProfit / revenue) * 100 : 0;
        ratios["Operating Profit Margin"] =
          revenue > 0 ? (operatingProfit / revenue) * 100 : 0;
        ratios["Net Profit Margin"] =
          revenue > 0 ? (netProfitAfterTax / revenue) * 100 : 0;
        // Use Depreciation & Amortisation rows if present; otherwise 0
        let depreciationAndAmortisation = 0;
        const opexCategory = state.data.categories.find(
          (c) => c.type === "operating_expenses"
        );
        if (opexCategory) {
          opexCategory.subcategories.forEach((sub) => {
            if (sub.id === "depreciation") {
              sub.rows.forEach((row) => {
                depreciationAndAmortisation += state.getRowYearlyTotal(row.id);
              });
            }
          });
        }
        ratios["EBITDA Margin"] =
          revenue > 0
            ? ((operatingProfit + Math.abs(depreciationAndAmortisation)) /
                revenue) *
              100
            : 0;

        // Cost structure ratios
        ratios["COGS as % of Revenue"] =
          revenue > 0 ? (cogs / revenue) * 100 : 0;
        ratios["Operating Expenses as % of Revenue"] =
          revenue > 0 ? (operatingExpenses / revenue) * 100 : 0;
        ratios["Total Expense Ratio"] =
          revenue > 0 ? ((cogs + operatingExpenses) / revenue) * 100 : 0;

        // Profitability efficiency ratios
        ratios["Gross Profit per Dollar of Revenue"] =
          revenue > 0 ? grossProfit / revenue : 0;
        ratios["Operating Leverage"] =
          cogs > 0 ? (revenue - cogs) / revenue : 0; // Contribution margin

        // Monthly performance ratios
        const monthlyRevenue = revenue / 12;
        ratios["Monthly Revenue"] = monthlyRevenue;
        ratios["Monthly Operating Profit"] = operatingProfit / 12;
        ratios["Monthly Net Profit"] = netProfitAfterTax / 12;

        // Break-even analysis ratios
        const fixedCosts = operatingExpenses;
        const variableCostRatio = revenue > 0 ? cogs / revenue : 0;
        const contributionMargin = 1 - variableCostRatio;
        ratios["Break-even Revenue"] =
          contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
        ratios["Margin of Safety"] =
          revenue > 0 && contributionMargin > 0
            ? ((revenue - fixedCosts / contributionMargin) / revenue) * 100
            : 0;

        // For balance sheet ratios, use improved estimates based on P&L performance
        const estimatedAssets = revenue * (netProfitAfterTax > 0 ? 0.8 : 1.2); // Better performing companies need fewer assets
        const estimatedEquity = revenue * (netProfitAfterTax > 0 ? 0.4 : 0.2); // Profitable companies have more equity
        const estimatedCurrentAssets = revenue * 0.25;
        const estimatedCurrentLiabilities = revenue * 0.15;

        ratios["Current Ratio"] =
          estimatedCurrentLiabilities > 0
            ? estimatedCurrentAssets / estimatedCurrentLiabilities
            : 0;
        ratios["Return on Assets"] =
          estimatedAssets > 0 ? (netProfitAfterTax / estimatedAssets) * 100 : 0;
        ratios["Return on Equity"] =
          estimatedEquity > 0 ? (netProfitAfterTax / estimatedEquity) * 100 : 0;

        // Debt ratios based on financial expenses
        const estimatedDebt =
          financialExpenses > 0 ? financialExpenses * 10 : revenue * 0.1; // Debt estimated from interest payments
        ratios["Debt to Equity Ratio"] =
          estimatedEquity > 0 ? estimatedDebt / estimatedEquity : 0;
        ratios["Interest Coverage Ratio"] =
          financialExpenses > 0 ? operatingProfit / financialExpenses : 999; // Very high if no financial expenses

        return ratios;
      },
    }),
    {
      name: "financial-store",
      version: 4,
      migrate: (persistedState: unknown) => {
        const base = {
          data: emptyFinancialData,
          currentViewType: "monthly",
          forecastRecords: [],
          scenarios: [],
          dataBackups: [],
          currentBackupId: null,
        };
        if (persistedState && typeof persistedState === "object") {
          const stateObj = persistedState as Record<string, unknown>;
          let data =
            (stateObj["data"] as typeof emptyFinancialData | undefined) ??
            emptyFinancialData;
          // Ensure balance sheet exists after migration
          if (
            !data.balanceSheet ||
            !Array.isArray(data.balanceSheet.accounts)
          ) {
            data = {
              ...data,
              balanceSheet: { accounts: createEmptyBalanceSheetAccounts() },
            };
          }
          return { ...base, ...stateObj, data };
        }
        return base;
      },
    }
  )
);
