"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const assetData = [
  { name: "Real Estate", value: 320000, color: "#3b82f6" },
  { name: "Stocks", value: 25000, color: "#22c55e" },
  { name: "Bonds", value: 15000, color: "#eab308" },
  { name: "Cash", value: 12000, color: "#a855f7" },
  { name: "Retirement", value: 35000, color: "#ec4899" },
  { name: "Other", value: 13000, color: "#64748b" },
]

const realEstateData = [{ name: "Primary Home", value: 320000, color: "#3b82f6" }]

const stocksData = [
  { name: "Individual Stocks", value: 15000, color: "#22c55e" },
  { name: "ETFs", value: 7000, color: "#16a34a" },
  { name: "Mutual Funds", value: 3000, color: "#84cc16" },
]

const retirementData = [
  { name: "401(k)", value: 25000, color: "#ec4899" },
  { name: "IRA", value: 10000, color: "#d946ef" },
]

interface AssetAllocationProps {
  showDetails?: boolean
}

export function AssetAllocation({ showDetails = false }: AssetAllocationProps) {
  return (
    <div className="space-y-4">
      <div className={showDetails ? "grid gap-4 md:grid-cols-2" : ""}>
        <Card className={!showDetails ? "border-0 shadow-none" : ""}>
          <CardHeader className={!showDetails ? "px-0" : ""}>
            <CardTitle>Asset Allocation</CardTitle>
            {showDetails && (
              <CardDescription>How your assets are distributed across different categories</CardDescription>
            )}
          </CardHeader>
          <CardContent className={!showDetails ? "px-0" : ""}>
            <Chart>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={assetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <ChartLegend className="mt-4 grid grid-cols-2 gap-4">
                {assetData.map((item) => (
                  <ChartLegendItem key={item.name} name={item.name} color={item.color} />
                ))}
              </ChartLegend>
            </Chart>
          </CardContent>
        </Card>

        {showDetails && (
          <Card>
            <CardHeader>
              <CardTitle>Asset Details</CardTitle>
              <CardDescription>Breakdown of your asset categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="realestate">Real Estate</TabsTrigger>
                  <TabsTrigger value="stocks">Stocks</TabsTrigger>
                  <TabsTrigger value="retirement">Retirement</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="pt-4">
                  <div className="space-y-4">
                    {assetData.map((asset) => (
                      <div key={asset.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: asset.color }}></div>
                          <span>{asset.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">${asset.value.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">
                            {((asset.value / assetData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="realestate" className="pt-4">
                  <div className="space-y-4">
                    {realEstateData.map((asset) => (
                      <div key={asset.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: asset.color }}></div>
                          <span>{asset.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">${asset.value.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="stocks" className="pt-4">
                  <div className="space-y-4">
                    {stocksData.map((asset) => (
                      <div key={asset.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: asset.color }}></div>
                          <span>{asset.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">${asset.value.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">
                            {((asset.value / stocksData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="retirement" className="pt-4">
                  <div className="space-y-4">
                    {retirementData.map((asset) => (
                      <div key={asset.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: asset.color }}></div>
                          <span>{asset.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">${asset.value.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">
                            {((asset.value / retirementData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(
                              1,
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>

      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Asset</CardTitle>
            <CardDescription>Record a new asset to track in your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Asset form would go here */}
            <div className="text-center text-muted-foreground py-4">Asset entry form coming soon</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

