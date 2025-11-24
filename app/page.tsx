"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectInfo } from "@/components/project-info"
import { Timeline } from "@/components/timeline"
import { Budget } from "@/components/budget"
import { Status } from "@/components/status"
import { Meetings } from "@/components/meetings"
import { ThemeToggle } from "@/components/theme-toggle"
import ErrorBoundary from "@/components/error-boundary"
import { FolderKanban } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header section with project title and theme toggle */}
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

      {/* Main content area with tabbed navigation */}
      <main className="container mx-auto px-4 py-6">
        <ErrorBoundary>
          <Tabs defaultValue="info" className="w-full">
            {/* Tabbed navigation for different dashboard sections */}
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid" aria-label="Project Dashboard Navigation">
              <TabsTrigger value="info" id="info-tab" aria-controls="info-content">Info</TabsTrigger>
              <TabsTrigger value="timeline" id="timeline-tab" aria-controls="timeline-content">Timeline</TabsTrigger>
              <TabsTrigger value="budget" id="budget-tab" aria-controls="budget-content">Budget</TabsTrigger>
              <TabsTrigger value="status" id="status-tab" aria-controls="status-content">Status</TabsTrigger>
              <TabsTrigger value="meetings" id="meetings-tab" aria-controls="meetings-content">Meetings</TabsTrigger>
          </TabsList>

          {/* Tab content panels */}
          <div className="mt-6">
            {/* Project Info Tab */}
            <TabsContent value="info" className="m-0" id="info-content" role="tabpanel" aria-labelledby="info-tab">
              <ProjectInfo />
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="m-0" id="timeline-content" role="tabpanel" aria-labelledby="timeline-tab">
              <Timeline />
            </TabsContent>

            {/* Budget Tab */}
            <TabsContent value="budget" className="m-0" id="budget-content" role="tabpanel" aria-labelledby="budget-tab">
              <Budget />
            </TabsContent>

            {/* Status Tab */}
            <TabsContent value="status" className="m-0" id="status-content" role="tabpanel" aria-labelledby="status-tab">
              <Status />
            </TabsContent>

            {/* Meetings Tab */}
            <TabsContent value="meetings" className="m-0" id="meetings-content" role="tabpanel" aria-labelledby="meetings-tab">
              <Meetings />
            </TabsContent>
          </div>
        </Tabs>
      </ErrorBoundary>
      </main>
    </div>
  )
}
