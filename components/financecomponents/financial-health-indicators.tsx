"use client"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

const indicators = [
  {
    name: "Emergency Fund",
    value: 80,
    target: 100,
    description: "6 months of expenses saved",
    status: "good",
    details: "You have 4.8 months of expenses saved. Target is 6 months.",
  },
  {
    name: "Debt-to-Income Ratio",
    value: 28.4,
    target: 36,
    description: "Monthly debt payments / monthly income",
    status: "good",
    details: "Your debt-to-income ratio is 28.4%, which is considered good. Keep it under 36%.",
  },
  {
    name: "Savings Rate",
    value: 15,
    target: 20,
    description: "Percentage of income saved",
    status: "warning",
    details: "You're saving 15% of your income. Try to increase to at least 20%.",
  },
  {
    name: "Housing Expense Ratio",
    value: 25,
    target: 28,
    description: "Housing costs / gross income",
    status: "good",
    details: "Your housing costs are 25% of your income, which is within the recommended range.",
  },
]

export function FinancialHealthIndicators() {
  return (
    <div className="space-y-4">
      {indicators.map((indicator) => (
        <div key={indicator.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{indicator.name}</h3>
              <p className="text-xs text-muted-foreground">{indicator.description}</p>
            </div>
            <div className="flex items-center">
              {indicator.status === "good" && <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />}
              {indicator.status === "warning" && <Info className="h-4 w-4 text-amber-500 mr-1" />}
              {indicator.status === "warning" && <Info className="h-4 w-4 text-amber-500 mr-1" />}
              {indicator.status === "danger" && <AlertCircle className="h-4 w-4 text-red-500 mr-1" />}
              <span
                className={`font-medium ${
                  indicator.status === "good"
                    ? "text-green-500"
                    : indicator.status === "warning"
                      ? "text-amber-500"
                      : "text-red-500"
                }`}
              >
                {indicator.value}%
              </span>
            </div>
          </div>
          <Progress
            value={(indicator.value / indicator.target) * 100}
            className={`h-2 ${
              indicator.status === "good"
                ? "bg-green-100"
                : indicator.status === "warning"
                  ? "bg-amber-100"
                  : "bg-red-100"
            }`}
          />
          <p className="text-xs text-muted-foreground">{indicator.details}</p>
        </div>
      ))}

      <Alert className="mt-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Financial Health Score: 82/100</AlertTitle>
        <AlertDescription>
          Your overall financial health is good. Focus on increasing your savings rate to improve your score.
        </AlertDescription>
      </Alert>
    </div>
  )
}

