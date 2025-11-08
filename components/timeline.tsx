"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle2, Circle, Clock, Edit, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Milestone {
  id: number
  title: string
  date: string
  description: string
  status: "completed" | "in-progress" | "upcoming"
}

const initialMilestones: Milestone[] = [
  {
    id: 1,
    title: "Project Kickoff",
    date: "2025-01-15",
    description: "Initial team meeting and project planning session",
    status: "completed",
  },
  {
    id: 2,
    title: "Design Phase Complete",
    date: "2025-02-20",
    description: "All design mockups and wireframes approved by stakeholders",
    status: "completed",
  },
  {
    id: 3,
    title: "Development Sprint 1",
    date: "2025-03-10",
    description: "Homepage and core navigation components implemented",
    status: "in-progress",
  },
  {
    id: 4,
    title: "Development Sprint 2",
    date: "2025-03-31",
    description: "Product pages and responsive design implementation",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Testing & QA",
    date: "2025-04-15",
    description: "Comprehensive testing across all devices and browsers",
    status: "upcoming",
  },
  {
    id: 6,
    title: "Launch",
    date: "2025-04-30",
    description: "Production deployment and go-live announcement",
    status: "upcoming",
  },
]

export function Timeline() {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [newMilestone, setNewMilestone] = useState<Omit<Milestone, "id">>({
    title: "",
    date: "",
    description: "",
    status: "upcoming",
  })

  const handleAddMilestone = () => {
    if (newMilestone.title && newMilestone.date && newMilestone.description) {
      const milestone: Milestone = {
        ...newMilestone,
        id: Math.max(...milestones.map(m => m.id)) + 1,
      }
      setMilestones([...milestones, milestone])
      setNewMilestone({ title: "", date: "", description: "", status: "upcoming" })
      setIsAddDialogOpen(false)
    }
  }

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone)
  }

  const handleUpdateMilestone = () => {
    if (editingMilestone) {
      setMilestones(milestones.map(m => m.id === editingMilestone.id ? editingMilestone : m))
      setEditingMilestone(null)
    }
  }

  const handleDeleteMilestone = (id: number) => {
    setMilestones(milestones.filter(m => m.id !== id))
  }

  const handleStatusChange = (id: number, newStatus: Milestone["status"]) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, status: newStatus } : m))
  }

  const getStatusIcon = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5" />
      case "in-progress":
        return <Clock className="h-5 w-5" />
      default:
        return <Circle className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return "bg-primary text-primary-foreground"
      case "in-progress":
        return "bg-chart-2 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusBadgeVariant = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return "default"
      case "in-progress":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "in-progress":
        return "In Progress"
      default:
        return "Upcoming"
    }
  }

  const completedCount = milestones.filter(m => m.status === "completed").length
  const progressPercentage = Math.round((completedCount / milestones.length) * 100)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Project Timeline</CardTitle>
          <CardDescription>Key milestones and deliverables</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Milestone</DialogTitle>
              <DialogDescription>Create a new project milestone with details and due date.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  placeholder="Enter milestone title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Due Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newMilestone.date}
                  onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  placeholder="Enter milestone description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newMilestone.status}
                  onValueChange={(value: Milestone["status"]) => setNewMilestone({ ...newMilestone, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMilestone}>
                  Add Milestone
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {/* Progress Summary */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Overall Progress</h3>
              <p className="text-2xl font-bold">{progressPercentage}%</p>
              <p className="text-xs text-muted-foreground">
                {completedCount} of {milestones.length} milestones completed
              </p>
            </div>
            <div className="w-1/2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="flex gap-4 group">
              {/* Icon and Line */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${getStatusColor(milestone.status)}`}
                >
                  {getStatusIcon(milestone.status)}
                </div>
                {index < milestones.length - 1 && (
                  <div className="h-full w-px bg-border" />
                )}
              </div>

              {/* Content */}
              <Card className="flex-1 shadow-sm transition-all hover:shadow-md group-hover:border-primary/20">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1 flex-1">
                      <h3 className="font-semibold text-foreground">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <div className="flex items-center gap-2">
                        <Select
                          value={milestone.status}
                          onValueChange={(value: Milestone["status"]) => handleStatusChange(milestone.id, value)}
                        >
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleEditMilestone(milestone)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                          onClick={() => handleDeleteMilestone(milestone.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(milestone.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Edit Milestone Dialog */}
        <Dialog open={!!editingMilestone} onOpenChange={(open) => !open && setEditingMilestone(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Milestone</DialogTitle>
              <DialogDescription>Update milestone details and status.</DialogDescription>
            </DialogHeader>
            {editingMilestone && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingMilestone.title}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Due Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingMilestone.date}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingMilestone.description}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingMilestone.status}
                    onValueChange={(value: Milestone["status"]) => setEditingMilestone({ ...editingMilestone, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingMilestone(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateMilestone}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

// Loading Skeleton Component
export function TimelineSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            </div>
            <div className="w-1/2">
              <div className="h-2 bg-muted rounded-full animate-pulse" />
            </div>
          </div>

          {/* Timeline Items Skeleton */}
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                  {index < 3 && <div className="h-full w-px bg-border" />}
                </div>
                <div className="flex-1">
                  <div className="h-24 bg-muted rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}