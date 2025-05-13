"use client"

import { Button } from "@/components/ui/button"
import { Code } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CodeBlocks {
  html?: string
  css?: string
  js?: string
}

export interface ChatMessageProps {
  id: string
  role: "user" | "assistant"
  content: string
  codeBlocks?: CodeBlocks
  onApplyCode?: (codeBlocks: CodeBlocks) => void
}

export function ChatMessage({ role, content, codeBlocks, onApplyCode }: ChatMessageProps) {
  // Format message content with markdown-like syntax
  const formatMessageContent = (content: string) => {
    // Replace code blocks with [Code Block] placeholder
    const withoutCodeBlocks = content.replace(/```(html|css|javascript)\n[\s\S]*?```/g, "[Code Block]")

    // Split by newlines and map each line
    return withoutCodeBlocks.split("\n").map((line, i) => (
      <div key={i} className={line.startsWith("- ") ? "ml-2" : ""}>
        {line}
      </div>
    ))
  }

  return (
    <div
      className={cn(
        "flex flex-col max-w-[95%] rounded-lg p-2",
        role === "user" ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-slate-100 text-slate-900",
      )}
    >
      <div className="whitespace-pre-wrap text-xs">{formatMessageContent(content)}</div>

      {codeBlocks && Object.values(codeBlocks).some(Boolean) && (
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "mt-1 self-start h-6 text-xs",
            role === "user" ? "bg-white text-blue-600 hover:bg-slate-100" : "bg-white",
          )}
          onClick={() => onApplyCode?.(codeBlocks)}
        >
          <Code className="h-3 w-3 mr-1" />
          Apply Code
        </Button>
      )}
    </div>
  )
}
