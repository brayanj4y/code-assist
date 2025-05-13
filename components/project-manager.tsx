"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { FileText, Trash2, Plus, Search, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "@/lib/date-utils"

interface ProjectManagerProps {
  onClose: () => void
  onLoadProject: (project: any) => void
  onNewProject: () => void
}

interface Project {
  name: string
  html: string
  css: string
  js: string
  lastModified: string
}

export default function ProjectManager({ onClose, onLoadProject, onNewProject }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(true)

  // Load projects from localStorage
  useEffect(() => {
    try {
      const savedProjects = JSON.parse(localStorage.getItem("codeProjects") || "[]")
      setProjects(savedProjects)
    } catch (error) {
      console.error("Error loading projects:", error)
      setProjects([])
    }
  }, [])

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Delete a project
  const deleteProject = (projectName: string) => {
    try {
      const updatedProjects = projects.filter((p) => p.name !== projectName)
      setProjects(updatedProjects)
      localStorage.setItem("codeProjects", JSON.stringify(updatedProjects))
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  // Handle dialog close
  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Project Manager</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" className="w-full" onClick={onNewProject}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.name}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{project.name}</CardTitle>
                        <CardDescription>
                          Last modified {formatDistanceToNow(new Date(project.lastModified))} ago
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteProject(project.name)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        onLoadProject(project)
                        handleClose()
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Open Project
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {projects.length === 0 ? "You haven't created any projects yet." : "No projects match your search."}
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
