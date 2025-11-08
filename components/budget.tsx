"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface BudgetItem {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    payload: BudgetItem
    value: number
  }>
  totalBudget?: number
}

const CustomTooltip = ({ active, payload, totalBudget = 0 }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const percentage = ((data.value / totalBudget) * 100).toFixed(1)

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">${data.value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{percentage}% of total</p>
      </div>
    )
  }
  return null
}

export function Budget() {
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([
    { name: "Design", value: 25000, color: "hsl(var(--chart-1))" },
    { name: "Development", value: 45000, color: "hsl(var(--chart-2))" },
    { name: "Content", value: 12000, color: "hsl(var(--chart-3))" },
    { name: "Marketing", value: 15000, color: "hsl(var(--chart-4))" },
    { name: "Misc", value: 8000, color: "hsl(var(--chart-5))" },
  ])

  const totalBudget = budgetData.reduce((sum, item) => sum + item.value, 0)
  const spentBudget = 52000
  const remainingBudget = totalBudget - spentBudget

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>Financial distribution and spending</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Screen Reader Summary */}
          <div className="sr-only">
            <h4>Budget Summary</h4>
            <p>Total budget: ${totalBudget.toLocaleString()}</p>
            <p>Spent: ${spentBudget.toLocaleString()} ({(spentBudget/totalBudget*100).toFixed(1)}%)</p>
            <p>Remaining: ${remainingBudget.toLocaleString()} ({(remainingBudget/totalBudget*100).toFixed(1)}%)</p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                  <p className="text-3xl font-bold text-foreground">${totalBudget.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Spent</p>
                  <p className="text-3xl font-bold text-chart-2">${spentBudget.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {((spentBudget / totalBudget) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                  <p className="text-3xl font-bold text-chart-4">${remainingBudget.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {((remainingBudget / totalBudget) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pie Chart */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Budget Distribution</h3>
            <div 
              role="img" 
              aria-label="Budget distribution pie chart"
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip totalBudget={totalBudget} />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown with Progress Bars */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Category Details</h3>
            {budgetData.map((category) => {
              const percentage = (category.value / totalBudget) * 100
              return (
                <div
                  key={category.name}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="font-medium text-foreground min-w-[100px]">{category.name}</span>
                    <div className="flex-1 max-w-[200px]">
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            backgroundColor: category.color, 
                            width: `${percentage}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-foreground">
                    ${category.value.toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading Skeleton Component
export function BudgetSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Skeleton for summary cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Skeleton for chart */}
          <div className="h-[300px] w-full bg-muted rounded animate-pulse" />
          {/* Skeleton for category breakdown */}
          <div className="space-y-3">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="flex-1 max-w-[200px]">
                    <div className="w-full bg-muted rounded-full h-2 animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}