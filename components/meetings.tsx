"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar, Mail, Edit, Trash2, Search, Download, MoreVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Meeting {
  id: string
  title: string
  date: string
  summary: string
  participants?: string[]
  tags?: string[]
}

export function Meetings() {
  const { toast } = useToast()
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Project Kickoff Meeting",
      date: "2025-01-15",
      summary: "Discussed project scope, timeline, and team responsibilities. Established communication channels and weekly check-in schedule.",
      participants: ["John Doe", "Jane Smith", "Mike Johnson"],
      tags: ["planning", "kickoff"],
    },
    {
      id: "2",
      title: "Design Review",
      date: "2025-02-10",
      summary: "Reviewed initial design concepts and wireframes. Stakeholders approved the modern, minimal aesthetic. Requested minor adjustments to navigation.",
      participants: ["Jane Smith", "Sarah Wilson", "Design Team"],
      tags: ["design", "review"],
    },
    {
      id: "3",
      title: "Sprint Planning - Development",
      date: "2025-02-25",
      summary: "Planned development sprint 1 focusing on homepage and core components. Assigned tasks to frontend team and set milestone for March 10.",
      participants: ["Mike Johnson", "Dev Team", "QA Team"],
      tags: ["sprint", "planning", "development"],
    },
  ])

  const [open, setOpen] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    summary: "",
    participants: "",
    tags: "",
  })

  // Get all unique tags for filter
  const allTags = Array.from(new Set(meetings.flatMap(meeting => meeting.tags || [])))

  // Filter meetings based on search and tag
  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = selectedTag === "all" || meeting.tags?.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const handleAddMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.summary) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      date: newMeeting.date,
      summary: newMeeting.summary,
      participants: newMeeting.participants ? newMeeting.participants.split(',').map(p => p.trim()) : [],
      tags: newMeeting.tags ? newMeeting.tags.split(',').map(t => t.trim()) : [],
    }

    setMeetings([...meetings, meeting])
    setNewMeeting({ title: "", date: "", summary: "", participants: "", tags: "" })
    setOpen(false)

    toast({
      title: "Meeting added",
      description: "Your meeting notes have been saved successfully.",
    })
  }

  const handleEditMeeting = () => {
    if (!editingMeeting) return

    if (!editingMeeting.title || !editingMeeting.date || !editingMeeting.summary) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setMeetings(meetings.map(meeting => meeting.id === editingMeeting.id ? editingMeeting : meeting))
    setEditingMeeting(null)

    toast({
      title: "Meeting updated",
      description: "Your meeting notes have been updated successfully.",
    })
  }

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter(meeting => meeting.id !== id))
    toast({
      title: "Meeting deleted",
      description: "The meeting notes have been removed.",
    })
  }

  const handleDeleteAllMeetings = () => {
    // This is a placeholder function - you can implement the actual delete logic later
    toast({
      title: "Delete All Meetings",
      description: "This feature is not implemented yet.",
      variant: "destructive",
    })
  }

  const handleEmailNotes = (meeting?: Meeting) => {
    if (meeting) {
      // Email single meeting
      const subject = `Meeting Notes: ${meeting.title}`
      const body = `${meeting.title}\nDate: ${new Date(meeting.date).toLocaleDateString()}\n\nSummary:\n${meeting.summary}\n\nParticipants: ${meeting.participants?.join(', ') || 'N/A'}`

      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

      toast({
        title: "Email client opened",
        description: "Your default email client has been opened with meeting notes.",
      })
    } else {
      // Email all meetings
      const subject = "Project Meeting Notes Summary"
      const body = meetings.map(m => 
        `${m.title}\nDate: ${new Date(m.date).toLocaleDateString()}\nSummary: ${m.summary}\nParticipants: ${m.participants?.join(', ') || 'N/A'}\n\n`
      ).join("")

      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

      toast({
        title: "Email client opened",
        description: "Your default email client has been opened with all meeting notes.",
      })
    }
  }

  const handleExportNotes = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      totalMeetings: meetings.length,
      meetings: meetings
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meeting-notes-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Notes exported",
      description: "Meeting notes have been exported as JSON.",
    })
  }

  const openEditDialog = (meeting: Meeting) => {
    setEditingMeeting({
      ...meeting,
      participants: meeting.participants || [],
      tags: meeting.tags || []
    })
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">Meeting Notes</CardTitle>
            <CardDescription>Record and track project meetings</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportNotes} 
                className="flex-1 sm:flex-none"
              >
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEmailNotes()} 
                className="flex-1 sm:flex-none"
              >
                <Mail className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Email All</span>
              </Button>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex-1 sm:flex-none">
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Meeting</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-[525px] mx-auto">
                  <DialogHeader>
                    <DialogTitle>Add Meeting Notes</DialogTitle>
                    <DialogDescription>Record details from your project meeting</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-2">
                      <Label htmlFor="meeting-title">Meeting Title *</Label>
                      <Input
                        id="meeting-title"
                        value={newMeeting.title}
                        onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                        placeholder="e.g., Weekly Status Update"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meeting-date">Date *</Label>
                      <Input
                        id="meeting-date"
                        type="date"
                        value={newMeeting.date}
                        onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meeting-participants">Participants</Label>
                      <Input
                        id="meeting-participants"
                        value={newMeeting.participants}
                        onChange={(e) => setNewMeeting({ ...newMeeting, participants: e.target.value })}
                        placeholder="e.g., John Doe, Jane Smith (comma separated)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meeting-tags">Tags</Label>
                      <Input
                        id="meeting-tags"
                        value={newMeeting.tags}
                        onChange={(e) => setNewMeeting({ ...newMeeting, tags: e.target.value })}
                        placeholder="e.g., planning, review, sprint (comma separated)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meeting-summary">Summary *</Label>
                      <Textarea
                        id="meeting-summary"
                        value={newMeeting.summary}
                        onChange={(e) => setNewMeeting({ ...newMeeting, summary: e.target.value })}
                        placeholder="Key discussion points, decisions, and action items..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleAddMeeting} className="flex-1">
                      Save Meeting
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDeleteAllMeetings}
                className="flex-1 sm:flex-none"
              >
                <Trash2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Delete All</span>
                <span className="sm:hidden">Delete</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter - FIXED TO PREVENT HORIZONTAL OVERFLOW */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
            <div className="relative w-full min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search meetings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full max-w-full"
              />
            </div>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          {filteredMeetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {meetings.length === 0 ? "No meetings yet" : "No meetings found"}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground max-w-sm">
                {meetings.length === 0 
                  ? "Start by adding your first meeting notes" 
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {meetings.length === 0 && (
                <Button onClick={() => setOpen(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Meeting
                </Button>
              )}
            </div>
          ) : (
            filteredMeetings.map((meeting) => (
              <Card key={meeting.id} className="shadow-sm group hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base sm:text-lg font-semibold text-foreground break-words pr-2 flex-1">
                            {meeting.title}
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-60 hover:opacity-100">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(meeting)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEmailNotes(meeting)}>
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteMeeting(meeting.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {meeting.tags?.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>
                        {new Date(meeting.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {meeting.participants && meeting.participants.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Participants:</p>
                        <p className="text-sm text-foreground break-words">{meeting.participants.join(', ')}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Summary:</p>
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                        {meeting.summary}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>

      {/* Edit Meeting Dialog */}
      <Dialog open={!!editingMeeting} onOpenChange={(open) => !open && setEditingMeeting(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-[525px] mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Meeting Notes</DialogTitle>
            <DialogDescription>Update the meeting details and summary</DialogDescription>
          </DialogHeader>
          {editingMeeting && (
            <>
              <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Meeting Title *</Label>
                  <Input
                    id="edit-title"
                    value={editingMeeting.title}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date *</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingMeeting.date}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-participants">Participants</Label>
                  <Input
                    id="edit-participants"
                    value={editingMeeting.participants?.join(', ') || ''}
                    onChange={(e) => setEditingMeeting({ 
                      ...editingMeeting, 
                      participants: e.target.value.split(',').map(p => p.trim()).filter(p => p) 
                    })}
                    placeholder="e.g., John Doe, Jane Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tags">Tags</Label>
                  <Input
                    id="edit-tags"
                    value={editingMeeting.tags?.join(', ') || ''}
                    onChange={(e) => setEditingMeeting({ 
                      ...editingMeeting, 
                      tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                    })}
                    placeholder="e.g., planning, review"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-summary">Summary *</Label>
                  <Textarea
                    id="edit-summary"
                    value={editingMeeting.summary}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, summary: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setEditingMeeting(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleEditMeeting} className="flex-1">
                  Update Meeting
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}