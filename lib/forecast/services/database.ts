import type {
  BalanceSheetAccount,
  BalanceSheetSection,
  Category,
  CategoryType,
  FinancialData,
  ForecastRecord,
  ScenarioConfig,
} from "../types/financial";
import type {
  BalanceSheetSection as PrismaBalanceSheetSection,
  CategoryType as PrismaCategoryType,
  ForecastMethod as PrismaForecastMethod,
  RecordStatus as PrismaRecordStatus,
  ScenarioType as PrismaScenarioType,
} from "@prisma/client";

import { Prisma } from "@prisma/client";
import { emptyFinancialData } from "../data/empty-data";
import { prisma } from "@/lib/db";

// Type definitions for database operations
export type CreateForecastInput = {
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
};

export type ForecastWithDetails = Prisma.ForecastGetPayload<{
  include: {
    categories: {
      include: {
        subcategories: {
          include: {
            rows: {
              include: {
                values: true;
              };
            };
          };
        };
      };
    };
    balanceSheet: {
      include: {
        values: true;
      };
    };
    forecastRecords: true;
    scenarios: true;
  };
}>;

/**
 * Database service for managing forecasts
 */
export class ForecastDatabaseService {
  /**
   * Create a new forecast instance
   */
  static async createForecast(input: CreateForecastInput) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Create the forecast
        const forecast = await tx.forecast.create({
          data: {
            name: input.name,
            description: input.description,
            companyName: input.companyName,
            industry: input.industry,
            businessType: input.businessType,
            establishedYear: input.establishedYear,
            employeeCount: input.employeeCount,
            taxRate: input.taxRate ?? 25.0,
            targetIncome: input.targetIncome ?? 0,
            userId: input.userId,
            status: "DRAFT",
          },
        });

        // Initialize with standard P&L structure from emptyFinancialData
        const financialData = {
          ...emptyFinancialData,
          taxRate: input.taxRate ?? 25.0,
          targetIncome: input.targetIncome ?? 0,
        };

        // Save the standard structure
        for (const category of financialData.categories) {
          const dbCategory = await tx.forecastCategory.create({
            data: {
              forecastId: forecast.id,
              name: category.name,
              type: this.mapCategoryType(category.type),
              order: category.order,
              isExpanded: category.isExpanded,
              isCalculated: category.isCalculated ?? false,
              formula: category.formula,
            },
          });

          // Save subcategories
          for (const subcategory of category.subcategories) {
            const dbSubcategory = await tx.forecastSubcategory.create({
              data: {
                categoryId: dbCategory.id,
                name: subcategory.name,
                order: subcategory.order,
              },
            });

            // Save rows
            for (const row of subcategory.rows) {
              await tx.financialRow.create({
                data: {
                  subcategoryId: dbSubcategory.id,
                  name: row.name,
                  type: this.mapCategoryType(row.type),
                  order: row.order,
                },
              });
              // Don't create empty values - they will be created when user enters data
            }
          }
        }

        // Save balance sheet structure
        if (financialData.balanceSheet?.accounts) {
          for (const account of financialData.balanceSheet.accounts) {
            await tx.balanceSheetAccount.create({
              data: {
                forecastId: forecast.id,
                name: account.name,
                section: this.mapBalanceSheetSection(account.section),
                order: account.order,
              },
            });
            // Don't create empty balance sheet values - they will be created when user enters data
          }
        }

        // Return the complete forecast with all data
        return await tx.forecast.findUnique({
          where: { id: forecast.id },
          include: {
            categories: {
              include: {
                subcategories: {
                  include: {
                    rows: {
                      include: {
                        values: true,
                      },
                    },
                  },
                },
              },
            },
            balanceSheet: {
              include: {
                values: true,
              },
            },
            forecastRecords: true,
            scenarios: true,
          },
        });
      });
    } catch (error) {
      console.error("Error creating forecast:", error);
      throw new Error("Failed to create forecast");
    }
  }

  /**
   * Get a forecast by ID with all related data
   */
  static async getForecast(id: string): Promise<ForecastWithDetails | null> {
    try {
      const forecast = await prisma.forecast.findUnique({
        where: { id },
        include: {
          categories: {
            include: {
              subcategories: {
                include: {
                  rows: {
                    include: {
                      values: true,
                    },
                  },
                },
              },
            },
            orderBy: { order: "asc" },
          },
          balanceSheet: {
            include: {
              values: true,
            },
            orderBy: { order: "asc" },
          },
          forecastRecords: {
            orderBy: { createdAt: "desc" },
          },
          scenarios: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      return forecast;
    } catch (error) {
      console.error("Error fetching forecast:", error);
      throw new Error("Failed to fetch forecast");
    }
  }

  /**
   * Get all forecasts for a user (or all if no userId provided)
   */
  static async getForecasts(userId?: string) {
    try {
      const forecasts = await prisma.forecast.findMany({
        where: userId ? { userId } : {},
        include: {
          _count: {
            select: {
              categories: true,
              forecastRecords: true,
              scenarios: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      return forecasts;
    } catch (error) {
      console.error("Error fetching forecasts:", error);
      throw new Error("Failed to fetch forecasts");
    }
  }

  /**
   * Save financial data to database
   */
  static async saveFinancialData(
    forecastId: string,
    financialData: FinancialData
  ) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Update forecast metadata
        await tx.forecast.update({
          where: { id: forecastId },
          data: {
            taxRate: financialData.taxRate,
            targetIncome: financialData.targetIncome,
            lastUpdated: new Date(financialData.lastUpdated),
          },
        });

        // Only save values that are not empty/zero
        for (const category of financialData.categories) {
          for (const subcategory of category.subcategories) {
            for (const row of subcategory.rows) {
              // Only save values that have actual data
              for (const value of row.values) {
                if (
                  value.value !== 0 &&
                  value.value !== null &&
                  value.value !== undefined
                ) {
                  await tx.financialValue.upsert({
                    where: {
                      rowId_year_month: {
                        rowId: row.id,
                        year: value.year,
                        month: value.month,
                      },
                    },
                    update: {
                      value: value.value,
                      date: value.date,
                      isProjected: value.isProjected,
                    },
                    create: {
                      rowId: row.id,
                      value: value.value,
                      year: value.year,
                      month: value.month,
                      date: value.date,
                      isProjected: value.isProjected,
                    },
                  });
                }
              }
            }
          }
        }

        // Update balance sheet data - only save non-empty values
        if (financialData.balanceSheet?.accounts) {
          for (const account of financialData.balanceSheet.accounts) {
            // Only save values that have actual data
            for (const value of account.values) {
              if (
                value.value !== 0 &&
                value.value !== null &&
                value.value !== undefined
              ) {
                await tx.balanceSheetValue.upsert({
                  where: {
                    accountId_year_month: {
                      accountId: account.id,
                      year: value.year,
                      month: value.month,
                    },
                  },
                  update: {
                    value: value.value,
                    date: value.date,
                    isProjected: value.isProjected,
                  },
                  create: {
                    accountId: account.id,
                    value: value.value,
                    year: value.year,
                    month: value.month,
                    date: value.date,
                    isProjected: value.isProjected,
                  },
                });
              }
            }
          }
        }

        return { success: true };
      });
    } catch (error) {
      console.error("Error saving financial data:", error);
      throw new Error("Failed to save financial data");
    }
  }

  /**
   * Convert database forecast to FinancialData format
   */
  static convertToFinancialData(forecast: ForecastWithDetails): FinancialData {
    const categories: Category[] = forecast.categories.map((category) => ({
      id: category.id,
      name: category.name,
      type: this.mapCategoryTypeFromDb(category.type),
      order: category.order,
      isExpanded: category.isExpanded,
      isCalculated: category.isCalculated,
      formula: category.formula ?? undefined,
      subcategories: category.subcategories.map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.name,
        order: subcategory.order,
        rows: subcategory.rows.map((row) => ({
          id: row.id,
          name: row.name,
          type: this.mapCategoryTypeFromDb(row.type),
          categoryId: category.id,
          subcategoryId: subcategory.id,
          order: row.order,
          values: row.values.map((value) => ({
            value: value.value,
            year: value.year,
            month: value.month,
            date: value.date,
            isProjected: value.isProjected,
          })),
        })),
      })),
    }));

    const balanceSheetAccounts: BalanceSheetAccount[] =
      forecast.balanceSheet.map((account) => ({
        id: account.id,
        name: account.name,
        section: this.mapBalanceSheetSectionFromDb(account.section),
        order: account.order,
        values: account.values.map((value) => ({
          value: value.value,
          year: value.year,
          month: value.month,
          date: value.date,
          isProjected: value.isProjected,
        })),
      }));

    // Generate forecast periods (2024-2030)
    const forecastPeriods = [];
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

    for (let year = 2024; year <= 2030; year++) {
      for (let month = 1; month <= 12; month++) {
        const date = new Date(year, month - 1);
        forecastPeriods.push({
          year,
          month,
          label: `${year} ${monthNames[month - 1]}`,
          date: date.toISOString().split("T")[0],
        });
      }
    }

    return {
      categories,
      forecastPeriods,
      lastUpdated: forecast.lastUpdated.toISOString(),
      taxRate: forecast.taxRate,
      targetIncome: forecast.targetIncome,
      balanceSheet: {
        accounts: balanceSheetAccounts,
      },
    };
  }

  /**
   * Save forecast record
   */
  static async saveForecastRecord(
    forecastId: string,
    record: Omit<ForecastRecord, "id" | "createdAt">
  ) {
    try {
      const dbRecord = await prisma.forecastRecord.create({
        data: {
          forecastId,
          name: record.name,
          accountIds: record.accountIds,
          method: this.mapForecastMethod(record.method),
          parameters: record.parameters as Prisma.JsonObject,
          startDate: record.startDate,
          endDate: record.endDate,
          status: this.mapRecordStatus(record.status),
        },
      });

      return dbRecord;
    } catch (error) {
      console.error("Error saving forecast record:", error);
      throw new Error("Failed to save forecast record");
    }
  }

  /**
   * Save scenario config
   */
  static async saveScenarioConfig(
    forecastId: string,
    scenario: Omit<ScenarioConfig, "id" | "createdAt">
  ) {
    try {
      const dbScenario = await prisma.scenarioConfig.create({
        data: {
          forecastId,
          name: scenario.name,
          description: scenario.description,
          type: this.mapScenarioType(scenario.type),
          value: scenario.value,
          accountIds: scenario.accountIds,
          startDate: scenario.startDate,
          endDate: scenario.endDate,
          status: this.mapRecordStatus(scenario.status),
        },
      });

      return dbScenario;
    } catch (error) {
      console.error("Error saving scenario config:", error);
      throw new Error("Failed to save scenario config");
    }
  }

  /**
   * Delete a forecast and all related data
   */
  static async deleteForecast(id: string) {
    try {
      await prisma.forecast.delete({
        where: { id },
      });
      return { success: true };
    } catch (error) {
      console.error("Error deleting forecast:", error);
      throw new Error("Failed to delete forecast");
    }
  }

  // Helper methods for type mapping
  private static mapCategoryType(type: string): PrismaCategoryType {
    const typeMap: Record<string, PrismaCategoryType> = {
      sales_revenue: "SALES_REVENUE",
      cogs: "COGS",
      gross_profit: "GROSS_PROFIT",
      operating_expenses: "OPERATING_EXPENSES",
      operating_profit: "OPERATING_PROFIT",
      other_income: "OTHER_INCOME",
      financial_expenses: "FINANCIAL_EXPENSES",
      other_expenses: "OTHER_EXPENSES",
      net_profit_before_tax: "NET_PROFIT_BEFORE_TAX",
      income_tax_expense: "INCOME_TAX_EXPENSE",
      net_profit_after_tax: "NET_PROFIT_AFTER_TAX",
      calculated: "CALCULATED",
    };
    return typeMap[type] ?? "CALCULATED";
  }

  private static mapCategoryTypeFromDb(type: PrismaCategoryType): CategoryType {
    const typeMap: Record<PrismaCategoryType, CategoryType> = {
      SALES_REVENUE: "sales_revenue",
      COGS: "cogs",
      GROSS_PROFIT: "gross_profit",
      OPERATING_EXPENSES: "operating_expenses",
      OPERATING_PROFIT: "operating_profit",
      OTHER_INCOME: "other_income",
      FINANCIAL_EXPENSES: "financial_expenses",
      OTHER_EXPENSES: "other_expenses",
      NET_PROFIT_BEFORE_TAX: "net_profit_before_tax",
      INCOME_TAX_EXPENSE: "income_tax_expense",
      NET_PROFIT_AFTER_TAX: "net_profit_after_tax",
      CALCULATED: "calculated",
    };
    return typeMap[type] ?? "calculated";
  }

  private static mapBalanceSheetSection(
    section: string
  ): PrismaBalanceSheetSection {
    const sectionMap: Record<string, PrismaBalanceSheetSection> = {
      current_assets: "CURRENT_ASSETS",
      non_current_assets: "NON_CURRENT_ASSETS",
      current_liabilities: "CURRENT_LIABILITIES",
      non_current_liabilities: "NON_CURRENT_LIABILITIES",
      equity: "EQUITY",
    };
    return sectionMap[section] ?? "CURRENT_ASSETS";
  }

  private static mapBalanceSheetSectionFromDb(
    section: PrismaBalanceSheetSection
  ): BalanceSheetSection {
    const sectionMap: Record<PrismaBalanceSheetSection, BalanceSheetSection> = {
      CURRENT_ASSETS: "current_assets",
      NON_CURRENT_ASSETS: "non_current_assets",
      CURRENT_LIABILITIES: "current_liabilities",
      NON_CURRENT_LIABILITIES: "non_current_liabilities",
      EQUITY: "equity",
    };
    return sectionMap[section] ?? "current_assets";
  }

  private static mapForecastMethod(method: string): PrismaForecastMethod {
    const methodMap: Record<string, PrismaForecastMethod> = {
      linear_trend: "LINEAR_TREND",
      exponential_smoothing: "EXPONENTIAL_SMOOTHING",
      seasonal: "SEASONAL",
      growth_rate: "GROWTH_RATE",
      fixed_amount: "FIXED_AMOUNT",
      percentage_of_revenue: "PERCENTAGE_OF_REVENUE",
      arima: "ARIMA",
      monte_carlo: "MONTE_CARLO",
      machine_learning: "MACHINE_LEARNING",
      polynomial_regression: "POLYNOMIAL_REGRESSION",
      seasonal_decomposition: "SEASONAL_DECOMPOSITION",
      holt_winters: "HOLT_WINTERS",
    };
    return methodMap[method] ?? "GROWTH_RATE";
  }

  private static mapScenarioType(type: string): PrismaScenarioType {
    return type === "percentage" ? "PERCENTAGE" : "AMOUNT";
  }

  private static mapRecordStatus(status: string): PrismaRecordStatus {
    const statusMap: Record<string, PrismaRecordStatus> = {
      active: "ACTIVE",
      paused: "PAUSED",
      completed: "COMPLETED",
    };
    return statusMap[status] ?? "ACTIVE";
  }
}
