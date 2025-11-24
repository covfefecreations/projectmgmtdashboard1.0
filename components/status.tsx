"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Target, DollarSign, AlertCircle, TrendingUp, TrendingDown, RefreshCw, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Metric {
  icon: any
  label: string
  value: string
  percentage: number
  color: string
  trend?: "up" | "down" | "neutral"
  trendValue?: number
  description?: string
}

interface StatusUpdate {
  id: string
  type: "success" | "warning" | "info" | "issue"
  message: string
  timestamp: string
  resolved?: boolean
}

export function Status() {
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [overallCompletion, setOverallCompletion] = useState(65)
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString())

  const [metrics, setMetrics] = useState<Metric[]>([
    {
      icon: CheckCircle2,
      label: "Tasks Completed",
      value: "34 / 50",
      percentage: 68,
      color: "text-chart-2",
      trend: "up",
      trendValue: 5,
      description: "5% increase from last week"
    },
    {
      icon: Target,
      label: "Milestones Reached",
      value: "2 / 6",
      percentage: 33,
      color: "text-chart-1",
      trend: "neutral",
      description: "On track with project timeline"
    },
    {
      icon: DollarSign,
      label: "Budget Utilization",
      value: "$52k / $105k",
      percentage: 49,
      color: "text-chart-4",
      trend: "down",
      trendValue: 3,
      description: "3% under budget"
    },
    {
      icon: AlertCircle,
      label: "Issues Open",
      value: "3",
      percentage: 0,
      color: "text-destructive",
      trend: "down",
      trendValue: 2,
      description: "2 issues resolved this week"
    },
  ])

  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([
    {
      id: "1",
      type: "success",
      message: "Development sprint 1 completed ahead of schedule",
      timestamp: "2025-02-25T10:30:00Z",
      resolved: true
    },
    {
      id: "2",
      type: "success",
      message: "Design phase successfully delivered and approved by stakeholders",
      timestamp: "2025-02-20T14:15:00Z",
      resolved: true
    },
    {
      id: "3",
      type: "issue",
      message: "3 minor issues requiring attention in mobile responsiveness",
      timestamp: "2025-02-26T09:45:00Z",
      resolved: false
    },
    {
      id: "4",
      type: "warning",
      message: "Content delivery delayed by 2 days due to client review",
      timestamp: "2025-02-27T16:20:00Z",
      resolved: false
    },
    {
      id: "5",
      type: "info",
      message: "Sprint planning session scheduled for next Monday",
      timestamp: "2025-02-28T11:00:00Z",
      resolved: false
    },
  ])

  const [projectHealth, setProjectHealth] = useState<"excellent" | "good" | "fair" | "poor">("good")

  const handleRefresh = async () => {
    setIsRefreshing(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update metrics with slight variations
    setMetrics(prev => prev.map(metric => ({
      ...metric,
      percentage: Math.min(100, Math.max(0, metric.percentage + (Math.random() * 10 - 5))),
      trendValue: metric.trendValue ? metric.trendValue + (Math.random() * 2 - 1) : undefined
    })))

    setLastUpdated(new Date().toISOString())
    setIsRefreshing(false)

    toast({
      title: "Status updated",
      description: "Project metrics have been refreshed.",
    })
  }

  const handleExportReport = () => {
    const report = {
      exportedAt: new Date().toISOString(),
      overallCompletion,
      projectHealth,
      metrics: metrics.map(m => ({
        label: m.label,
        value: m.value,
        percentage: m.percentage,
        trend: m.trend
      })),
      statusUpdates: statusUpdates.map(s => ({
        type: s.type,
        message: s.message,
        timestamp: s.timestamp,
        resolved: s.resolved
      }))
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `project-status-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Report exported",
      description: "Project status report has been downloaded.",
    })
  }

  const markUpdateResolved = (id: string) => {
    setStatusUpdates(prev => prev.map(update => 
      update.id === id ? { ...update, resolved: true } : update
    ))

    toast({
      title: "Issue resolved",
      description: "The status update has been marked as resolved.",
    })
  }

  const getHealthColor = (health: typeof projectHealth) => {
    switch (health) {
      case "excellent": return "text-green-600 bg-green-100"
      case "good": return "text-blue-600 bg-blue-100"
      case "fair": return "text-yellow-600 bg-yellow-100"
      case "poor": return "text-red-600 bg-red-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getHealthText = (health: typeof projectHealth) => {
    switch (health) {
      case "excellent": return "Excellent"
      case "good": return "Good"
      case "fair": return "Fair"
      case "poor": return "Needs Attention"
      default: return "Unknown"
    }
  }

  const getStatusIcon = (type: StatusUpdate["type"]) => {
    switch (type) {
      case "success": return <CheckCircle2 className="h-4 w-4 text-chart-2" />
      case "warning": return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "issue": return <AlertCircle className="h-4 w-4 text-destructive" />
      case "info": return <Target className="h-4 w-4 text-blue-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (type: StatusUpdate["type"]) => {
    switch (type) {
      case "success": return "border-l-chart-2"
      case "warning": return "border-l-yellow-500"
      case "issue": return "border-l-destructive"
      case "info": return "border-l-blue-500"
      default: return "border-l-gray-500"
    }
  }

  // Calculate project health based on metrics
  useEffect(() => {
    const completedTasks = metrics.find(m => m.label === "Tasks Completed")?.percentage || 0
    const budgetUsage = metrics.find(m => m.label === "Budget Utilization")?.percentage || 0
    const openIssues = parseInt(metrics.find(m => m.label === "Issues Open")?.value || "0")

    let health: typeof projectHealth = "good"

    if (completedTasks >= 80 && budgetUsage <= 60 && openIssues <= 1) {
      health = "excellent"
    } else if (completedTasks >= 60 && budgetUsage <= 80 && openIssues <= 3) {
      health = "good"
    } else if (completedTasks >= 40 && budgetUsage <= 90 && openIssues <= 5) {
      health = "fair"
    } else {
      health = "poor"
    }

    setProjectHealth(health)
  }, [metrics])

  const unresolvedIssues = statusUpdates.filter(update => !update.resolved && (update.type === "issue" || update.type === "warning"))

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Overall progress and key metrics</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportReport} aria-label="Export status report">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} aria-label="Refresh status metrics">
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Project Health & Overall Progress */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="shadow-sm" aria-label={`Project Health: ${getHealthText(projectHealth)}`}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">Project Health</h3>
                  <Badge className={getHealthColor(projectHealth)}>
                    {getHealthText(projectHealth)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {projectHealth === "excellent" && "Project is exceeding expectations across all metrics"}
                    {projectHealth === "good" && "Project is progressing well with minor areas for improvement"}
                    {projectHealth === "fair" && "Project requires attention in some areas"}
                    {projectHealth === "poor" && "Immediate attention needed to get project back on track"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm" aria-label={`Overall project completion: ${overallCompletion}%`}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">Overall Completion</h3>
                  <span className="text-2xl font-bold text-foreground">{overallCompletion}%</span>
                </div>
                <Progress value={overallCompletion} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  {overallCompletion >= 75 ? "Ahead of schedule" : 
                   overallCompletion >= 50 ? "On track for completion" : 
                   "Needs acceleration to meet deadline"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label} className="shadow-sm" aria-label={`${metric.label}: ${metric.value}`}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <metric.icon className={`h-5 w-5 ${metric.color}`} />
                      <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    </div>
                    {metric.trend && metric.trend !== "neutral" && (
                      <div className={`flex items-center gap-1 text-xs ${
                        metric.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}>
                        {metric.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {metric.trendValue && `${metric.trendValue}%`}
                      </div>
                    )}
                  </div>

                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>

                  {metric.percentage > 0 && (
                    <div className="space-y-2">
                      <Progress value={metric.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status Updates */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Recent Updates</h3>
            <Badge variant="outline">
              {unresolvedIssues.length} unresolved {unresolvedIssues.length === 1 ? 'issue' : 'issues'}
            </Badge>
          </div>

          <div className="space-y-3">
            {statusUpdates.slice(0, 5).map((update) => (
              <Card 
                key={update.id} 
                className={`shadow-sm border-l-4 ${getStatusColor(update.type)} ${
                  update.resolved ? "opacity-60" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(update.type)}
                      <div className="space-y-1 flex-1">
                        <p className={`text-sm ${update.resolved ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {update.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(update.timestamp).toLocaleDateString()} at{" "}
                          {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    {!update.resolved && (update.type === "issue" || update.type === "warning") && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => markUpdateResolved(update.id)}
                        className="shrink-0"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                    {update.resolved && (
                      <Badge variant="secondary" className="shrink-0">
                        Resolved
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Last updated: {new Date(lastUpdated).toLocaleDateString()} at{" "}
            {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span>{statusUpdates.length} total updates</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading Skeleton Component
export function StatusSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-muted rounded animate-pulse" />
            <div className="h-9 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Health & Progress Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Metrics Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Updates Skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}