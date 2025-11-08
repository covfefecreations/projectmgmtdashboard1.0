"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TeamMember {
  id: string
  name: string
  role: string
}

export function ProjectInfo() {
  const { toast } = useToast()
  const [projectName, setProjectName] = useState("Website Redesign")
  const [startDate, setStartDate] = useState("2025-01-15")
  const [targetDate, setTargetDate] = useState("2025-04-30")
  const [scope, setScope] = useState("Complete redesign of corporate website with improved UX and modern design")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "Sarah Chen", role: "Project Manager" },
    { id: "2", name: "Marcus Rivera", role: "Lead Designer" },
    { id: "3", name: "Emily Watson", role: "Frontend Developer" },
  ])

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { id: Date.now().toString(), name: "", role: "" }])
  }

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
  }

  const updateTeamMember = (id: string, field: "name" | "role", value: string) => {
    setTeamMembers(teamMembers.map((member) => (member.id === id ? { ...member, [field]: value } : member)))
  }

  const handleSave = () => {
    toast({
      title: "Project saved",
      description: "Your project information has been updated successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Information</CardTitle>
        <CardDescription>Manage your project details and team members</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="project-name">Project Name</Label>
          <Input
            id="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-date">Target Completion</Label>
            <Input id="target-date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scope">Project Scope</Label>
          <Textarea
            id="scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            placeholder="Brief description of project scope"
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Team Members</Label>
            <Button variant="outline" size="sm" onClick={addTeamMember} className="h-8 bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>

          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex gap-2">
                <Input
                  value={member.name}
                  onChange={(e) => updateTeamMember(member.id, "name", e.target.value)}
                  placeholder="Name"
                  className="flex-1"
                />
                <Input
                  value={member.role}
                  onChange={(e) => updateTeamMember(member.id, "role", e.target.value)}
                  placeholder="Role"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" onClick={() => removeTeamMember(member.id)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" />
          Save Project
        </Button>
      </CardContent>
    </Card>
  )
}
