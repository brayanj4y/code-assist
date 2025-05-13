"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface Project {
  name: string
  lastModified: string
}

interface ProjectListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projects: Project[]
  onLoadProject: (project: Project) => void
  onDeleteProject: (projectName: string, e: React.MouseEvent) => void
  formatDate: (dateString: string) => string
}

export function ProjectListDialog({
  open,
  onOpenChange,
  projects,
  onLoadProject,
  onDeleteProject,
  formatDate,
}: ProjectListDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Open Project</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto pr-1">
          {projects.length > 0 ? (
            <div className="space-y-2">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded-md hover:bg-slate-50 cursor-pointer"
                  onClick={() => onLoadProject(project)}
                >
                  <div className="overflow-hidden">
                    <div className="font-medium truncate">{project.name}</div>
                    <div className="text-xs text-slate-500">Last modified: {formatDate(project.lastModified)}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => onDeleteProject(project.name, e)}
                    aria-label={`Delete ${project.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No saved projects found.</p>
              <p className="text-xs mt-1">Save a project to see it here.</p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
