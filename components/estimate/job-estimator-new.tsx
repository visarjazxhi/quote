// components/job-estimator-new.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Staff } from "./staff-management"

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

interface JobEstimatorProps {
  staff: Staff[]
}

interface SelectedStaff {
  id: string
  hoursWorked: number
  budgetedHours: number
}

export default function JobEstimator({ staff }: Readonly<JobEstimatorProps>) {
  const [client, setClient] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [selectedStaff, setSelectedStaff] = useState<SelectedStaff[]>([])
  const [clientCharge, setClientCharge] = useState("")

  const handleStaffSelection = (staffId: string) => {
    const isSelected = selectedStaff.some(s => s.id === staffId)
    
    if (isSelected) {
      setSelectedStaff(selectedStaff.filter(s => s.id !== staffId))
    } else {
      setSelectedStaff([...selectedStaff, { id: staffId, hoursWorked: 0, budgetedHours: 0 }])
    }
  }

  const updateStaffField = (staffId: string, field: keyof SelectedStaff, value: number) => {
    setSelectedStaff(selectedStaff.map(s => 
      s.id === staffId ? { ...s, [field]: value } : s
    ))
  }

  // Calculate totals and costs
  const getStaffMember = (id: string) => staff.find(s => s.id === id)
  
  const totalHours = selectedStaff.reduce((sum, s) => sum + s.hoursWorked, 0)
  const totalCost = selectedStaff.reduce((sum, s) => {
    const staffMember = getStaffMember(s.id)
    return sum + (staffMember ? staffMember.hourlyRate * s.hoursWorked : 0)
  }, 0)
  
  const totalBudgetedHours = selectedStaff.reduce((sum, s) => sum + s.budgetedHours, 0)
  const totalBudgetedCost = selectedStaff.reduce((sum, s) => {
    const staffMember = getStaffMember(s.id)
    return sum + (staffMember ? staffMember.hourlyRate * s.budgetedHours : 0)
  }, 0)
  
  const profit = parseFloat(clientCharge || "0") - totalBudgetedCost
  const costPercentage = parseFloat(clientCharge) > 0 
    ? (totalBudgetedCost / parseFloat(clientCharge)) * 100 
    : 0
  const profitPercentage = 100 - costPercentage

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader className="pb-4 flex justify-between items-start border-b">
          <div>
            <CardTitle>Job Estimation</CardTitle>
            <CardDescription>Enter job details and calculate costs</CardDescription>
          </div>
          {selectedStaff.length > 0 && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Estimated Profit</div>
              <div className={`text-lg font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(profit)} ({profitPercentage.toFixed(1)}%)
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-12 gap-6">
            {/* Left Column - Job Details & Profit Analysis */}
            <div className="md:col-span-3 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client" className="text-sm">Client</Label>
                <Input
                  id="client"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Enter client name"
                  className="h-8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientCharge" className="text-sm">Client Charge</Label>
                <Input
                  id="clientCharge"
                  type="number"
                  step="0.01"
                  min="0"
                  value={clientCharge}
                  onChange={(e) => setClientCharge(e.target.value)}
                  placeholder="Enter amount"
                  className="h-8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobDescription" className="text-sm">Description</Label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Brief description..."
                  rows={2}
                  className="resize-none text-sm"
                />
              </div>

              {selectedStaff.length > 0 && (
                <div className="pt-4">
                  <div className="relative aspect-square max-w-[200px] mx-auto">
                    {/* Gauge Background */}
                    <div className="absolute inset-0 rounded-full border-[6px] border-gray-200" />
                    {/* Gauge Fill */}
                    <div 
                      className="absolute inset-0 rounded-full border-[6px] transition-all duration-700"
                      style={{
                        borderColor: profit >= 0 ? '#059669' : '#DC2626',
                        transform: `rotate(${180 + (profitPercentage * 1.8)}deg)`
                      }}
                    />
                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <span className="text-xs font-medium text-gray-500">Profit</span>
                      <span className={`text-xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profitPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Cost:</span>
                      <span>{formatCurrency(totalBudgetedCost)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Profit:</span>
                      <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(profit)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Staff Selection & Hours */}
            <div className="md:col-span-9 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Select Staff</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {staff.map(staffMember => (
                    <Button
                      key={staffMember.id}
                      type="button"
                      variant={selectedStaff.some(s => s.id === staffMember.id) ? "default" : "outline"}
                      onClick={() => handleStaffSelection(staffMember.id)}
                      className="w-full text-sm justify-between px-3 py-1.5 h-auto"
                    >
                      <span>{staffMember.name}</span>
                      <span className="text-xs opacity-70">{formatCurrency(staffMember.hourlyRate)}/hr</span>
                    </Button>
                  ))}
                </div>
              </div>

              {selectedStaff.length > 0 && (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[140px]">Staff</TableHead>
                        <TableHead className="w-[80px] text-right">Rate</TableHead>
                        <TableHead className="w-[100px] text-center">Past Hrs</TableHead>
                        <TableHead className="w-[100px] text-right">Past Cost</TableHead>
                        <TableHead className="w-[100px] text-center">Budget Hrs</TableHead>
                        <TableHead className="w-[100px] text-right">Budget Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedStaff.map(selected => {
                        const staffMember = getStaffMember(selected.id)
                        if (!staffMember) return null
                        
                        const cost = staffMember.hourlyRate * selected.hoursWorked
                        const budgetedCost = staffMember.hourlyRate * selected.budgetedHours
                        
                        return (
                          <TableRow key={selected.id}>
                            <TableCell className="py-2">{staffMember.name}</TableCell>
                            <TableCell className="text-right py-2 font-mono text-sm">
                              {formatCurrency(staffMember.hourlyRate)}
                            </TableCell>
                            <TableCell className="py-2">
                              <Input
                                type="number"
                                step="0.5"
                                min="0"
                                value={selected.hoursWorked}
                                onChange={(e) => updateStaffField(selected.id, "hoursWorked", parseFloat(e.target.value) || 0)}
                                className="w-16 h-7 text-center mx-auto text-sm"
                              />
                            </TableCell>
                            <TableCell className="text-right py-2 font-mono text-sm">
                              {formatCurrency(cost)}
                            </TableCell>
                            <TableCell className="py-2">
                              <Input
                                type="number"
                                step="0.5"
                                min="0"
                                value={selected.budgetedHours}
                                onChange={(e) => updateStaffField(selected.id, "budgetedHours", parseFloat(e.target.value) || 0)}
                                className="w-16 h-7 text-center mx-auto text-sm"
                              />
                            </TableCell>
                            <TableCell className="text-right py-2 font-mono text-sm">
                              {formatCurrency(budgetedCost)}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={2} className="text-right">Totals:</TableCell>
                        <TableCell className="text-center">{totalHours.toFixed(1)} hrs</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(totalCost)}</TableCell>
                        <TableCell className="text-center">{totalBudgetedHours.toFixed(1)} hrs</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(totalBudgetedCost)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
