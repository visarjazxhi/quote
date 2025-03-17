"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/financecomponents/overview"
import { RecentTransactions } from "@/components/financecomponents/recent-transactions"
import { AccountSummary } from "@/components/financecomponents/account-summary"
import { FinancialGoals } from "@/components/financecomponents/financial-goals"
import { AddTransactionForm } from "@/components/financecomponents/add-transaction-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { LoansOverview } from "@/components/financecomponents/loans-overview"
import { SavingsOverview } from "@/components/financecomponents/savings-overview"
import { NetWorthTracker } from "@/components/financecomponents/net-worth-tracker"
import { AssetAllocation } from "@/components/financecomponents/asset-allocation"
import { FinancialHealthIndicators } from "@/components/financecomponents/financial-health-indicators"
import { InvestmentPortfolio } from "@/components/financecomponents/investment-portfolio"
import { BudgetPlanner } from "@/components/financecomponents/budget-planner"

export default function DashboardPage() {
  const [showAddTransaction, setShowAddTransaction] = useState(false)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Wealth Management/Finance Tracker Dashboard</h1>
          <Button onClick={() => setShowAddTransaction(!showAddTransaction)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        {showAddTransaction && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Add New Transaction</CardTitle>
              <CardDescription>Record a new expense or income</CardDescription>
            </CardHeader>
            <CardContent>
              <AddTransactionForm onComplete={() => setShowAddTransaction(false)} />
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$245,780.00</div>
              <p className="text-xs text-muted-foreground">+$5,245.00 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,395.00</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,860.00</div>
              <p className="text-xs text-muted-foreground">+18.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Debt-to-Income Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28.4%</div>
              <p className="text-xs text-muted-foreground">-2.1% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-9">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="networth">Net Worth</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>You made 12 transactions this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentTransactions />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <AssetAllocation />
                </CardContent>
              </Card>
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Financial Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <FinancialHealthIndicators />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="networth" className="space-y-4">
            <NetWorthTracker />
          </TabsContent>
          <TabsContent value="budget" className="space-y-4">
            <BudgetPlanner />
          </TabsContent>
          <TabsContent value="accounts" className="space-y-4">
            <AccountSummary />
          </TabsContent>
          <TabsContent value="assets" className="space-y-4">
            <AssetAllocation showDetails={true} />
          </TabsContent>
          <TabsContent value="loans" className="space-y-4">
            <LoansOverview />
          </TabsContent>
          <TabsContent value="investments" className="space-y-4">
            <InvestmentPortfolio />
          </TabsContent>
          <TabsContent value="savings" className="space-y-4">
            <SavingsOverview />
          </TabsContent>
          <TabsContent value="goals" className="space-y-4">
            <FinancialGoals />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

