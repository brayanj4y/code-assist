"use client"

import type React from "react"

import { useState } from "react"
import { FileText, Code, FileCode, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FileItem {
  id: string
  name: string
  icon: React.ElementType
}

interface FileExplorerProps {
  activeFile: string
  onFileSelect: (file: string) => void
  files?: FileItem[]
}

export function FileExplorer({ activeFile, onFileSelect, files }: FileExplorerProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const defaultFiles: FileItem[] = [
    { id: "html", name: "index.html", icon: FileText },
    { id: "css", name: "styles.css", icon: FileCode },
    { id: "js", name: "script.js", icon: Code },
  ]

  const fileList = files || defaultFiles

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden border-r">
      <div
        className="flex items-center justify-between p-2 border-b cursor-pointer hover:bg-slate-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {isExpanded ? <ChevronDown className="h-3.5 w-3.5 mr-1" /> : <ChevronRight className="h-3.5 w-3.5 mr-1" />}
          <span className="text-xs font-medium">Project Files</span>
        </div>
      </div>

      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-1 scrollbar-thin">
          {fileList.map((file) => (
            <div
              key={file.id}
              className={cn(
                "flex items-center p-1.5 rounded-md text-xs cursor-pointer",
                activeFile === file.id ? "bg-blue-100 text-blue-700" : "hover:bg-slate-100",
              )}
              onClick={() => onFileSelect(file.id)}
            >
              <file.icon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span className="truncate">{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
