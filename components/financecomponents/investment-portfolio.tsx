"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Chart, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, TrendingUp, Plus } from "lucide-react"

const portfolioAllocation = [
  { name: "US Stocks", value: 25000, color: "#3b82f6", performance: 8.2 },
  { name: "International Stocks", value: 10000, color: "#22c55e", performance: 5.4 },
  { name: "Bonds", value: 15000, color: "#eab308", performance: 2.1 },
  { name: "REITs", value: 5000, color: "#a855f7", performance: 6.8 },
  { name: "Crypto", value: 2000, color: "#ec4899", performance: -12.5 },
  { name: "Cash", value: 3000, color: "#64748b", performance: 0.8 },
]

const investments = [
  {
    id: 1,
    name: "VTSAX",
    type: "Mutual Fund",
    shares: 45.23,
    price: 120.45,
    value: 5447.96,
    costBasis: 4800.0,
    gain: 647.96,
    performance: 13.5,
  },
  {
    id: 2,
    name: "AAPL",
    type: "Stock",
    shares: 10,
    price: 182.63,
    value: 1826.3,
    costBasis: 1500.0,
    gain: 326.3,
    performance: 21.8,
  },
  {
    id: 3,
    name: "MSFT",
    type: "Stock",
    shares: 5,
    price: 328.79,
    value: 1643.95,
    costBasis: 1400.0,
    gain: 243.95,
    performance: 17.4,
  },
  {
    id: 4,
    name: "BND",
    type: "ETF",
    shares: 60,
    price: 72.54,
    value: 4352.4,
    costBasis: 4200.0,
    gain: 152.4,
    performance: 3.6,
  },
  {
    id: 5,
    name: "VNQ",
    type: "ETF",
    shares: 25,
    price: 84.32,
    value: 2108.0,
    costBasis: 1950.0,
    gain: 158.0,
    performance: 8.1,
  },
]

export function InvestmentPortfolio() {


  const totalValue = portfolioAllocation.reduce((sum, item) => sum + item.value, 0)
  const totalGain = investments.reduce((sum, item) => sum + item.gain, 0)
  const totalPerformance = (totalGain / investments.reduce((sum, item) => sum + item.costBasis, 0)) * 100

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+$1,245 (2.1%) this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGain >= 0 ? "text-green-500" : "text-red-500"}`}>
              {totalGain >= 0 ? "+" : ""}
              {totalGain.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{totalPerformance.toFixed(2)}% return</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+7.2%</div>
            <p className="text-xs text-muted-foreground">vs. S&P 500: +8.4%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dividend Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3%</div>
            <p className="text-xs text-muted-foreground">$1,380 annually</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>How your investments are distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={portfolioAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {portfolioAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <ChartLegend className="mt-4 grid grid-cols-2 gap-4">
                    {portfolioAllocation.map((item) => (
                      <ChartLegendItem key={item.name} name={item.name} color={item.color} />
                    ))}
                  </ChartLegend>
                </Chart>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Your best performing investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioAllocation
                    .sort((a, b) => b.performance - a.performance)
                    .slice(0, 4)
                    .map((asset) => (
                      <div key={asset.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: asset.color }}></div>
                          <span>{asset.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`font-medium ${asset.performance >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {asset.performance >= 0 ? "+" : ""}
                            {asset.performance}%
                          </span>
                          {asset.performance >= 0 ? (
                            <ArrowUp className="h-4 w-4 text-green-500 ml-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-red-500 ml-1" />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View All Performance
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="holdings">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Investment Holdings</CardTitle>
                  <CardDescription>Your current investment portfolio</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Investment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Gain/Loss</TableHead>
                    <TableHead className="text-right">Return</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((investment) => (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium">{investment.name}</TableCell>
                      <TableCell>{investment.type}</TableCell>
                      <TableCell className="text-right">{investment.shares.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${investment.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${investment.value.toFixed(2)}</TableCell>
                      <TableCell className={`text-right ${investment.gain >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {investment.gain >= 0 ? "+" : ""}${investment.gain.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={`text-right ${investment.performance >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {investment.performance >= 0 ? "+" : ""}
                        {investment.performance.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>How your investments have performed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Performance charts coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

