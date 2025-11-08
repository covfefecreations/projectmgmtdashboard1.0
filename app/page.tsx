"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectInfo } from "@/components/project-info"
import { Timeline } from "@/components/timeline"
import { Budget } from "@/components/budget"
import { Status } from "@/components/status"
import { Meetings } from "@/components/meetings"
import { ThemeToggle } from "@/components/theme-toggle"
import { FolderKanban } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FolderKanban className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Project Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage your projects</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="info" className="m-0">
              <ProjectInfo />
            </TabsContent>

            <TabsContent value="timeline" className="m-0">
              <Timeline />
            </TabsContent>

            <TabsContent value="budget" className="m-0">
              <Budget />
            </TabsContent>

            <TabsContent value="status" className="m-0">
              <Status />
            </TabsContent>

            <TabsContent value="meetings" className="m-0">
              <Meetings />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
