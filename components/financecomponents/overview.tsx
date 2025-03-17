"use client"
import { Chart, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    Income: 4000,
    Expenses: 2400,
    Savings: 1600,
  },
  {
    name: "Feb",
    Income: 4200,
    Expenses: 2800,
    Savings: 1400,
  },
  {
    name: "Mar",
    Income: 4100,
    Expenses: 2700,
    Savings: 1400,
  },
  {
    name: "Apr",
    Income: 4500,
    Expenses: 2900,
    Savings: 1600,
  },
  {
    name: "May",
    Income: 4300,
    Expenses: 3100,
    Savings: 1200,
  },
  {
    name: "Jun",
    Income: 4800,
    Expenses: 3000,
    Savings: 1800,
  },
]

export function Overview() {
  return (
    <div className="space-y-4">
      <Chart>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Savings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <ChartLegend className="mt-4">
          <ChartLegendItem name="Income" color="#22c55e" />
          <ChartLegendItem name="Expenses" color="#ef4444" />
          <ChartLegendItem name="Savings" color="#3b82f6" />
        </ChartLegend>
      </Chart>
    </div>
  )
}

