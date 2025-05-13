"use client"

import { useState } from "react"
import { FileText, Code, FileCode, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileExplorerProps {
  activeFile: string
  onFileSelect: (file: string) => void
}

export default function FileExplorer({ activeFile, onFileSelect }: FileExplorerProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const files = [
    { id: "html", name: "index.html", icon: FileText },
    { id: "css", name: "styles.css", icon: FileCode },
    { id: "js", name: "script.js", icon: Code },
  ]

  return (
    <div className="h-full bg-slate-50 border-r flex flex-col overflow-hidden">
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
        <div className="flex-1 overflow-auto p-1">
          {files.map((file) => (
            <div
              key={file.id}
              className={cn(
                "flex items-center p-1.5 rounded-md text-xs cursor-pointer",
                activeFile === file.id ? "bg-blue-100 text-blue-700" : "hover:bg-slate-100",
              )}
              onClick={() => onFileSelect(file.id)}
            >
              <file.icon className="h-3.5 w-3.5 mr-1.5" />
              {file.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
