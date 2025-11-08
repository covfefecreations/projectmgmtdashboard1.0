"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Plus, X, Edit, Users, Calendar, Target, FolderOpen, Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  status: "active" | "inactive"
}

interface ProjectInfoData {
  projectName: string
  startDate: string
  targetDate: string
  scope: string
  status: "planning" | "active" | "on-hold" | "completed"
  priority: "low" | "medium" | "high"
  budget: string
  client: string
  description: string
  teamMembers: TeamMember[]
}

export function ProjectInfo() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [projectData, setProjectData] = useState<ProjectInfoData>({
    projectName: "Website Redesign",
    startDate: "2025-01-15",
    targetDate: "2025-04-30",
    scope: "Complete redesign of corporate website with improved UX and modern design",
    status: "active",
    priority: "high",
    budget: "$85,000",
    client: "Acme Corporation",
    description: "Modernize the corporate website with responsive design, improved user experience, and updated content management system.",
    teamMembers: [
      { id: "1", name: "Sarah Chen", role: "Project Manager", email: "sarah.chen@company.com", status: "active" },
      { id: "2", name: "Marcus Rivera", role: "Lead Designer", email: "marcus.rivera@company.com", status: "active" },
      { id: "3", name: "Emily Watson", role: "Frontend Developer", email: "emily.watson@company.com", status: "active" },
      { id: "4", name: "Alex Kim", role: "Backend Developer", email: "alex.kim@company.com", status: "active" },
    ],
  })

  const addTeamMember = () => {
    setProjectData({
      ...projectData,
      teamMembers: [
        ...projectData.teamMembers,
        { id: Date.now().toString(), name: "", role: "", email: "", status: "active" }
      ]
    })
  }

  const removeTeamMember = (id: string) => {
    setProjectData({
      ...projectData,
      teamMembers: projectData.teamMembers.filter((member) => member.id !== id)
    })
  }

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setProjectData({
      ...projectData,
      teamMembers: projectData.teamMembers.map((member) => 
        member.id === id ? { ...member, [field]: value } : member
      )
    })
  }

  const updateProjectField = (field: keyof ProjectInfoData, value: string) => {
    setProjectData({
      ...projectData,
      [field]: value
    })
  }

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Project saved",
      description: "Your project information has been updated successfully.",
    })
  }

  const handleCancel = () => {
    // In a real app, you might want to reset to original data
    setIsEditing(false)
    toast({
      title: "Changes cancelled",
      description: "Your changes have been reverted.",
    })
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(projectData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${projectData.projectName.replace(/\s+/g, '-').toLowerCase()}-project-data.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Project exported",
      description: "Project data has been exported as JSON.",
    })
  }

  const getStatusColor = (status: ProjectInfoData["status"]) => {
    switch (status) {
      case "planning": return "bg-blue-100 text-blue-800"
      case "active": return "bg-green-100 text-green-800"
      case "on-hold": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: ProjectInfoData["priority"]) => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "high": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const calculateProgress = () => {
    const start = new Date(projectData.startDate).getTime()
    const target = new Date(projectData.targetDate).getTime()
    const today = new Date().getTime()

    if (today < start) return 0
    if (today > target) return 100

    const total = target - start
    const elapsed = today - start
    return Math.round((elapsed / total) * 100)
  }

  const progress = calculateProgress()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>Manage your project details and team members</CardDescription>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button variant="outline" onClick={handleExport} className="flex-1 sm:flex-none">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-none">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Project
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1 sm:flex-none">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Status Overview */}
        {!isEditing && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Timeline Progress</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{progress}%</p>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Team Size</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{projectData.teamMembers.length}</p>
                  <p className="text-xs text-muted-foreground">
                    {projectData.teamMembers.filter(m => m.status === "active").length} active members
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(projectData.status)}>
                    {projectData.status.charAt(0).toUpperCase() + projectData.status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Priority</p>
                  <Badge className={getPriorityColor(projectData.priority)}>
                    {projectData.priority.charAt(0).toUpperCase() + projectData.priority.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Project Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={projectData.projectName}
                onChange={(e) => updateProjectField("projectName", e.target.value)}
                placeholder="Enter project name"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={projectData.client}
                onChange={(e) => updateProjectField("client", e.target.value)}
                placeholder="Client name"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => updateProjectField("description", e.target.value)}
                placeholder="Detailed project description"
                rows={4}
                disabled={!isEditing}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input 
                  id="start-date" 
                  type="date" 
                  value={projectData.startDate} 
                  onChange={(e) => updateProjectField("startDate", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-date">Target Completion</Label>
                <Input 
                  id="target-date" 
                  type="date" 
                  value={projectData.targetDate} 
                  onChange={(e) => updateProjectField("targetDate", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Project Status</Label>
                <Select 
                  value={projectData.status} 
                  onValueChange={(value: ProjectInfoData["status"]) => updateProjectField("status", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={projectData.priority} 
                  onValueChange={(value: ProjectInfoData["priority"]) => updateProjectField("priority", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                value={projectData.budget}
                onChange={(e) => updateProjectField("budget", e.target.value)}
                placeholder="Project budget"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scope">Project Scope</Label>
              <Textarea
                id="scope"
                value={projectData.scope}
                onChange={(e) => updateProjectField("scope", e.target.value)}
                placeholder="Brief description of project scope"
                rows={3}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Team Members</Label>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={addTeamMember} className="h-8">
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {projectData.teamMembers.map((member) => (
              <div key={member.id} className="flex gap-2 items-start">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                  <Input
                    value={member.name}
                    onChange={(e) => updateTeamMember(member.id, "name", e.target.value)}
                    placeholder="Name"
                    disabled={!isEditing}
                  />
                  <Input
                    value={member.role}
                    onChange={(e) => updateTeamMember(member.id, "role", e.target.value)}
                    placeholder="Role"
                    disabled={!isEditing}
                  />
                  <Input
                    value={member.email}
                    onChange={(e) => updateTeamMember(member.id, "email", e.target.value)}
                    placeholder="Email"
                    type="email"
                    disabled={!isEditing}
                  />
                </div>
                {isEditing && (
                  <Button variant="ghost" size="icon" onClick={() => removeTeamMember(member.id)} className="shrink-0 mt-0.5">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Only show save button at bottom in edit mode */}
        {isEditing && (
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Loading Skeleton Component
export function ProjectInfoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Form Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-10 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-10 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Team Members Skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}