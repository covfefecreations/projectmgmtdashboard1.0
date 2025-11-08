import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Target, DollarSign, AlertCircle } from "lucide-react"

const metrics = [
  {
    icon: CheckCircle2,
    label: "Tasks Completed",
    value: "34 / 50",
    percentage: 68,
    color: "text-chart-2",
  },
  {
    icon: Target,
    label: "Milestones Reached",
    value: "2 / 6",
    percentage: 33,
    color: "text-chart-1",
  },
  {
    icon: DollarSign,
    label: "Budget Utilization",
    value: "$52k / $105k",
    percentage: 49,
    color: "text-chart-4",
  },
  {
    icon: AlertCircle,
    label: "Issues Open",
    value: "3",
    percentage: 0,
    color: "text-destructive",
  },
]

export function Status() {
  const overallCompletion = 65

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Status</CardTitle>
        <CardDescription>Overall progress and key metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Overall Completion</h3>
            <span className="text-2xl font-bold text-foreground">{overallCompletion}%</span>
          </div>
          <Progress value={overallCompletion} className="h-3" />
          <p className="text-sm text-muted-foreground">Project is on track for completion by target date</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map((metric) => (
            <Card key={metric.label} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <metric.icon className={`h-5 w-5 ${metric.color}`} />
                      <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    {metric.percentage > 0 && <Progress value={metric.percentage} className="h-2" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status Summary */}
        <Card className="border-l-4 border-l-chart-2 shadow-sm">
          <CardContent className="p-6">
            <h4 className="mb-2 font-semibold text-foreground">Status Summary</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-chart-2" />
                <span>Development sprint 1 completed ahead of schedule</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-chart-2" />
                <span>Design phase successfully delivered and approved</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span>3 minor issues requiring attention in mobile responsiveness</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
