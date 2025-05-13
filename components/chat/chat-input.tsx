"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Send, Sparkles } from "lucide-react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isLoading: boolean
  suggestions?: string[]
}

export function ChatInput({ value, onChange, onSend, isLoading, suggestions = [] }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Handle textarea resize
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)

    // Auto-resize textarea
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`
  }

  // Handle key press in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="border-t p-2 bg-white">
      <div className="flex items-start gap-1">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask for help with your code..."
            disabled={isLoading}
            className="w-full min-h-[32px] max-h-[100px] resize-none rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Message to AI assistant"
            rows={1}
          />
        </div>
        <Button
          onClick={onSend}
          disabled={isLoading || !value.trim()}
          size="sm"
          className="h-7 w-7 p-0 self-start"
          aria-label="Send message"
        >
          {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="text-[10px] h-5 py-0 px-1 bg-white"
              onClick={() => onChange(suggestion)}
              disabled={isLoading}
            >
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
