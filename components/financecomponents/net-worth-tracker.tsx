"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const netWorthData = [
  { month: "Jan", Assets: 220000, Liabilities: 185000, NetWorth: 35000 },
  { month: "Feb", Assets: 225000, Liabilities: 184000, NetWorth: 41000 },
  { month: "Mar", Assets: 232000, Liabilities: 183000, NetWorth: 49000 },
  { month: "Apr", Assets: 240000, Liabilities: 182000, NetWorth: 58000 },
  { month: "May", Assets: 245000, Liabilities: 181000, NetWorth: 64000 },
  { month: "Jun", Assets: 250000, Liabilities: 180000, NetWorth: 70000 },
  { month: "Jul", Assets: 260000, Liabilities: 179000, NetWorth: 81000 },
  { month: "Aug", Assets: 265000, Liabilities: 178000, NetWorth: 87000 },
  { month: "Sep", Assets: 270000, Liabilities: 177000, NetWorth: 93000 },
  { month: "Oct", Assets: 280000, Liabilities: 176000, NetWorth: 104000 },
  { month: "Nov", Assets: 290000, Liabilities: 175000, NetWorth: 115000 },
  { month: "Dec", Assets: 420000, Liabilities: 174220, NetWorth: 245780 },
]

const assetBreakdown = [
  { name: "Primary Home", value: 320000 },
  { name: "Investment Accounts", value: 45000 },
  { name: "Retirement Accounts", value: 35000 },
  { name: "Cash & Savings", value: 12000 },
  { name: "Vehicles", value: 8000 },
]

const liabilityBreakdown = [
  { name: "Mortgage", value: 150000 },
  { name: "Student Loans", value: 12000 },
  { name: "Car Loans", value: 8000 },
  { name: "Credit Cards", value: 4220 },
]

export function NetWorthTracker() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$420,000.00</div>
            <p className="text-xs text-muted-foreground">+$130,000.00 from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$174,220.00</div>
            <p className="text-xs text-muted-foreground">-$10,780.00 from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$245,780.00</div>
            <p className="text-xs text-muted-foreground">+$140,780.00 from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Debt-to-Asset Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">41.5%</div>
            <p className="text-xs text-muted-foreground">-12.3% from last year</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Net Worth Trend</CardTitle>
          <CardDescription>12-month history of your assets, liabilities, and net worth</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={netWorthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="Assets" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                <Area type="monotone" dataKey="Liabilities" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                <Area type="monotone" dataKey="NetWorth" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
            <ChartLegend className="mt-4">
              <ChartLegendItem name="Assets" color="#22c55e" />
              <ChartLegendItem name="Liabilities" color="#ef4444" />
              <ChartLegendItem name="Net Worth" color="#3b82f6" />
            </ChartLegend>
          </Chart>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asset Breakdown</CardTitle>
            <CardDescription>What makes up your total assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assetBreakdown.map((asset) => (
                <div key={asset.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span>{asset.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">${asset.value.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">{((asset.value / 420000) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liability Breakdown</CardTitle>
            <CardDescription>What makes up your total liabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liabilityBreakdown.map((liability) => (
                <div key={liability.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-destructive mr-2"></div>
                    <span>{liability.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">${liability.value.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">
                      {((liability.value / 174220) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

