"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ChatHeaderProps {
  onClose: () => void
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="border-b px-2 py-1 flex justify-between items-center">
      <span className="text-xs font-medium">Gemini Assistant</span>
      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onClose}>
        <X className="h-3 w-3" />
        <span className="sr-only">Close Assistant</span>
      </Button>
    </div>
  )
}
