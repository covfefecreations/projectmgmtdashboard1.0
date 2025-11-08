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
import { Plus, Calendar, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Meeting {
  id: string
  title: string
  date: string
  summary: string
}

export function Meetings() {
  const { toast } = useToast()
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Project Kickoff Meeting",
      date: "2025-01-15",
      summary:
        "Discussed project scope, timeline, and team responsibilities. Established communication channels and weekly check-in schedule.",
    },
    {
      id: "2",
      title: "Design Review",
      date: "2025-02-10",
      summary:
        "Reviewed initial design concepts and wireframes. Stakeholders approved the modern, minimal aesthetic. Requested minor adjustments to navigation.",
    },
    {
      id: "3",
      title: "Sprint Planning - Development",
      date: "2025-02-25",
      summary:
        "Planned development sprint 1 focusing on homepage and core components. Assigned tasks to frontend team and set milestone for March 10.",
    },
  ])

  const [open, setOpen] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    summary: "",
  })

  const handleAddMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.summary) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setMeetings([
      ...meetings,
      {
        id: Date.now().toString(),
        ...newMeeting,
      },
    ])

    setNewMeeting({ title: "", date: "", summary: "" })
    setOpen(false)

    toast({
      title: "Meeting added",
      description: "Your meeting notes have been saved successfully.",
    })
  }

  const handleEmailNotes = () => {
    const subject = "Project Meeting Notes Summary"
    const body = meetings.map((m) => `${m.title} - ${new Date(m.date).toLocaleDateString()}\n${m.summary}\n\n`).join("")

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    toast({
      title: "Email client opened",
      description: "Your default email client has been opened with meeting notes.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Meeting Notes</CardTitle>
            <CardDescription>Record and track project meetings</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEmailNotes} className="flex-1 sm:flex-none bg-transparent">
              <Mail className="mr-2 h-4 w-4" />
              Email All
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 sm:flex-none">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Meeting
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add Meeting Notes</DialogTitle>
                  <DialogDescription>Record details from your project meeting</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-title">Meeting Title</Label>
                    <Input
                      id="meeting-title"
                      value={newMeeting.title}
                      onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                      placeholder="e.g., Weekly Status Update"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-date">Date</Label>
                    <Input
                      id="meeting-date"
                      type="date"
                      value={newMeeting.date}
                      onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-summary">Summary</Label>
                    <Textarea
                      id="meeting-summary"
                      value={newMeeting.summary}
                      onChange={(e) => setNewMeeting({ ...newMeeting, summary: e.target.value })}
                      placeholder="Key discussion points and action items..."
                      rows={5}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMeeting}>Save Meeting</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {meetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">No meetings yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">Start by adding your first meeting notes</p>
            </div>
          ) : (
            meetings.map((meeting) => (
              <Card key={meeting.id} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg font-semibold text-foreground">{meeting.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(meeting.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{meeting.summary}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
