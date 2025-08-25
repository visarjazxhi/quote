-- CreateEnum
CREATE TYPE "public"."ForecastStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED', 'TEMPLATE');

-- CreateEnum
CREATE TYPE "public"."CategoryType" AS ENUM ('SALES_REVENUE', 'COGS', 'GROSS_PROFIT', 'OPERATING_EXPENSES', 'OPERATING_PROFIT', 'OTHER_INCOME', 'FINANCIAL_EXPENSES', 'OTHER_EXPENSES', 'NET_PROFIT_BEFORE_TAX', 'INCOME_TAX_EXPENSE', 'NET_PROFIT_AFTER_TAX', 'CALCULATED');

-- CreateEnum
CREATE TYPE "public"."BalanceSheetSection" AS ENUM ('CURRENT_ASSETS', 'NON_CURRENT_ASSETS', 'CURRENT_LIABILITIES', 'NON_CURRENT_LIABILITIES', 'EQUITY');

-- CreateEnum
CREATE TYPE "public"."ForecastMethod" AS ENUM ('LINEAR_TREND', 'EXPONENTIAL_SMOOTHING', 'SEASONAL', 'GROWTH_RATE', 'FIXED_AMOUNT', 'PERCENTAGE_OF_REVENUE', 'ARIMA', 'MONTE_CARLO', 'MACHINE_LEARNING', 'POLYNOMIAL_REGRESSION', 'SEASONAL_DECOMPOSITION', 'HOLT_WINTERS');

-- CreateEnum
CREATE TYPE "public"."ScenarioType" AS ENUM ('PERCENTAGE', 'AMOUNT');

-- CreateEnum
CREATE TYPE "public"."RecordStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."forecasts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "companyName" TEXT,
    "industry" TEXT,
    "businessType" TEXT,
    "establishedYear" INTEGER,
    "employeeCount" INTEGER,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 25.0,
    "targetIncome" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "public"."ForecastStatus" NOT NULL DEFAULT 'DRAFT',
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."forecast_categories" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."CategoryType" NOT NULL,
    "order" INTEGER NOT NULL,
    "isExpanded" BOOLEAN NOT NULL DEFAULT true,
    "isCalculated" BOOLEAN NOT NULL DEFAULT false,
    "formula" TEXT,
    "forecastId" TEXT NOT NULL,

    CONSTRAINT "forecast_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."forecast_subcategories" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "forecast_subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."financial_rows" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."CategoryType" NOT NULL,
    "order" INTEGER NOT NULL,
    "subcategoryId" TEXT NOT NULL,

    CONSTRAINT "financial_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."financial_values" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "isProjected" BOOLEAN NOT NULL DEFAULT true,
    "rowId" TEXT NOT NULL,

    CONSTRAINT "financial_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."balance_sheet_accounts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "section" "public"."BalanceSheetSection" NOT NULL,
    "order" INTEGER NOT NULL,
    "forecastId" TEXT NOT NULL,

    CONSTRAINT "balance_sheet_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."balance_sheet_values" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "isProjected" BOOLEAN NOT NULL DEFAULT true,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "balance_sheet_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."forecast_records" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "accountIds" TEXT[],
    "method" "public"."ForecastMethod" NOT NULL,
    "parameters" JSONB NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "status" "public"."RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "forecastId" TEXT NOT NULL,

    CONSTRAINT "forecast_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scenario_configs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."ScenarioType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "accountIds" TEXT[],
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "status" "public"."RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "forecastId" TEXT NOT NULL,

    CONSTRAINT "scenario_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "financial_values_rowId_year_month_key" ON "public"."financial_values"("rowId", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "balance_sheet_values_accountId_year_month_key" ON "public"."balance_sheet_values"("accountId", "year", "month");

-- AddForeignKey
ALTER TABLE "public"."forecast_categories" ADD CONSTRAINT "forecast_categories_forecastId_fkey" FOREIGN KEY ("forecastId") REFERENCES "public"."forecasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."forecast_subcategories" ADD CONSTRAINT "forecast_subcategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."forecast_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."financial_rows" ADD CONSTRAINT "financial_rows_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "public"."forecast_subcategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."financial_values" ADD CONSTRAINT "financial_values_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "public"."financial_rows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."balance_sheet_accounts" ADD CONSTRAINT "balance_sheet_accounts_forecastId_fkey" FOREIGN KEY ("forecastId") REFERENCES "public"."forecasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."balance_sheet_values" ADD CONSTRAINT "balance_sheet_values_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."balance_sheet_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."forecast_records" ADD CONSTRAINT "forecast_records_forecastId_fkey" FOREIGN KEY ("forecastId") REFERENCES "public"."forecasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scenario_configs" ADD CONSTRAINT "scenario_configs_forecastId_fkey" FOREIGN KEY ("forecastId") REFERENCES "public"."forecasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
