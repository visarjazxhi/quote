"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Chart, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import { Bar, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, ResponsiveContainer } from "recharts"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, AlertTriangle } from "lucide-react"

const budgetCategories = [
  { name: "Housing", budgeted: 1200, actual: 1200, remaining: 0 },
  { name: "Utilities", budgeted: 300, actual: 285, remaining: 15 },
  { name: "Groceries", budgeted: 500, actual: 420, remaining: 80 },
  { name: "Transportation", budgeted: 200, actual: 180, remaining: 20 },
  { name: "Dining Out", budgeted: 300, actual: 350, remaining: -50 },
  { name: "Entertainment", budgeted: 150, actual: 200, remaining: -50 },
  { name: "Healthcare", budgeted: 200, actual: 150, remaining: 50 },
  { name: "Personal Care", budgeted: 100, actual: 85, remaining: 15 },
  { name: "Debt Payments", budgeted: 500, actual: 500, remaining: 0 },
  { name: "Savings", budgeted: 800, actual: 800, remaining: 0 },
  { name: "Miscellaneous", budgeted: 150, actual: 175, remaining: -25 },
]

const monthlyBudgetData = [
  { month: "Jan", Budgeted: 4200, Actual: 4100 },
  { month: "Feb", Budgeted: 4200, Actual: 4300 },
  { month: "Mar", Budgeted: 4300, Actual: 4250 },
  { month: "Apr", Budgeted: 4300, Actual: 4400 },
  { month: "May", Budgeted: 4400, Actual: 4350 },
  { month: "Jun", Budgeted: 4400, Actual: 4345 },
]

export function BudgetPlanner() {
  const [showAddCategory, setShowAddCategory] = useState(false)

  const totalBudgeted = budgetCategories.reduce((sum, category) => sum + category.budgeted, 0)
  const totalActual = budgetCategories.reduce((sum, category) => sum + category.actual, 0)
  const totalRemaining = totalBudgeted - totalActual

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,395.00</div>
            <p className="text-xs text-muted-foreground">After taxes and deductions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budgeted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudgeted.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{((totalBudgeted / 4395) * 100).toFixed(1)}% of income</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actual Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalActual.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{((totalActual / 4395) * 100).toFixed(1)}% of income</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalRemaining >= 0 ? "text-green-500" : "text-red-500"}`}>
              ${totalRemaining.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">{totalRemaining >= 0 ? "Under budget" : "Over budget"}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Budget Categories</TabsTrigger>
          <TabsTrigger value="trends">Budget Trends</TabsTrigger>
          <TabsTrigger value="income">Income Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Budget Categories</CardTitle>
                  <CardDescription>Your monthly budget breakdown</CardDescription>
                </div>
                <Button onClick={() => setShowAddCategory(!showAddCategory)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddCategory && (
                <div className="mb-6 p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Add New Budget Category</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category-name">Category Name</Label>
                      <Input id="category-name" placeholder="e.g., Subscriptions" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budgeted-amount">Budgeted Amount</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                          $
                        </span>
                        <Input id="budgeted-amount" type="number" placeholder="0.00" className="pl-7" />
                      </div>
                    </div>
                    <div className="md:col-span-2 flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddCategory(false)}>
                        Cancel
                      </Button>
                      <Button>Add Category</Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {budgetCategories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium">{category.name}</span>
                        {category.remaining < 0 && <AlertTriangle className="h-4 w-4 text-amber-500 ml-2" />}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-muted-foreground">
                          ${category.actual} of ${category.budgeted}
                        </div>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Progress
                      value={(category.actual / category.budgeted) * 100}
                      className={`h-2 ${category.remaining < 0 ? "bg-amber-100" : "bg-green-100"}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{((category.actual / category.budgeted) * 100).toFixed(0)}% used</span>
                      <span className={category.remaining < 0 ? "text-red-500" : "text-green-500"}>
                        {category.remaining >= 0
                          ? `$${category.remaining} remaining`
                          : `$${Math.abs(category.remaining)} over budget`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Budget Trends</CardTitle>
              <CardDescription>Compare your budgeted vs. actual spending over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Chart>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyBudgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Budgeted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Actual" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <ChartLegend className="mt-4 flex justify-center gap-8">
                  <ChartLegendItem name="Budgeted" color="#3b82f6" />
                  <ChartLegendItem name="Actual" color="#ef4444" />
                </ChartLegend>
              </Chart>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Income Sources</CardTitle>
                  <CardDescription>Track your various income streams</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Income
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Monthly Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Primary Job</TableCell>
                    <TableCell>Bi-weekly</TableCell>
                    <TableCell className="text-right">$1,850.00</TableCell>
                    <TableCell className="text-right">$4,008.33</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Side Gig</TableCell>
                    <TableCell>Monthly</TableCell>
                    <TableCell className="text-right">$350.00</TableCell>
                    <TableCell className="text-right">$350.00</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Dividends</TableCell>
                    <TableCell>Quarterly</TableCell>
                    <TableCell className="text-right">$110.00</TableCell>
                    <TableCell className="text-right">$36.67</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between items-center w-full">
                <span className="font-medium">Total Monthly Income:</span>
                <span className="font-bold">$4,395.00</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

