"use client"

import type React from "react"

import { Code, Plus, Save, FileCode, Upload, Download, Play, MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRef } from "react"

interface HeaderProps {
  projectName: string
  isRunning: boolean
  isChatOpen: boolean
  onNewProject: () => void
  onSaveProject: () => void
  onOpenProjectList: () => void
  onRunCode: () => void
  onToggleChat: () => void
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDownloadProject: () => void
}

export function Header({
  projectName,
  isRunning,
  isChatOpen,
  onNewProject,
  onSaveProject,
  onOpenProjectList,
  onRunCode,
  onToggleChat,
  onFileUpload,
  onDownloadProject,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <header className="border-b bg-white z-10 py-1">
      <div className="container flex items-center justify-between h-8 px-2">
        <div className="flex items-center gap-1">
          <Code className="h-4 w-4" />
          <h1 className="text-sm font-semibold truncate max-w-[150px]" title={projectName}>
            {projectName}
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNewProject}>
                  <Plus className="h-3.5 w-3.5" />
                  <span className="sr-only">New Project</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New Project</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onSaveProject}>
                  <Save className="h-3.5 w-3.5" />
                  <span className="sr-only">Save Project</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save Project</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onOpenProjectList}>
                  <FileCode className="h-3.5 w-3.5" />
                  <span className="sr-only">Open Project</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open Project</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={triggerFileUpload}>
                  <Upload className="h-3.5 w-3.5" />
                  <span className="sr-only">Upload File</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".html,.css,.js,.json"
                    onChange={onFileUpload}
                    aria-label="Upload file"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload File</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDownloadProject}>
                  <Download className="h-3.5 w-3.5" />
                  <span className="sr-only">Download as ZIP</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download as ZIP</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRunCode}>
                  {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                  <span className="sr-only">Run Code</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Run Code</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isChatOpen ? "default" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={onToggleChat}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="sr-only">AI Assistant</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI Assistant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  )
}
