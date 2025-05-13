"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Code, Sparkles, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface ChatAssistantProps {
  htmlCode: string
  cssCode: string
  jsCode: string
  onCodeUpdate: {
    updateHtml: (code: string) => void
    updateCss: (code: string) => void
    updateJs: (code: string) => void
  }
}

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  codeBlocks?: {
    html?: string
    css?: string
    js?: string
  }
}

export default function ChatAssistant({ htmlCode, cssCode, jsCode, onCodeUpdate }: ChatAssistantProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your Gemini-powered coding assistant. I can help you write, debug, and improve your code. What would you like to do?",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Send message to AI assistant
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    setError(null)

    try {
      // Create context with current code
      const context = `
HTML Code:
\`\`\`html
${htmlCode}
\`\`\`

CSS Code:
\`\`\`css
${cssCode}
\`\`\`

JavaScript Code:
\`\`\`javascript
${jsCode}
\`\`\`
`

      // Call our API endpoint that uses the Gemini API
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: inputValue,
          context: context,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      const text = data.text

      // Parse code blocks from response
      const codeBlocks = extractCodeBlocks(text)

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: text,
        codeBlocks,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)
      setError("Failed to generate a response. Please try again.")

      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error while generating a response. Please try again.",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      // Focus textarea after sending
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }

  // Extract code blocks from markdown text
  const extractCodeBlocks = (text: string) => {
    const htmlRegex = /```html\n([\s\S]*?)```/g
    const cssRegex = /```css\n([\s\S]*?)```/g
    const jsRegex = /```javascript\n([\s\S]*?)```/g

    const htmlMatch = htmlRegex.exec(text)
    const cssMatch = cssRegex.exec(text)
    const jsMatch = jsRegex.exec(text)

    return {
      html: htmlMatch ? htmlMatch[1] : undefined,
      css: cssMatch ? cssMatch[1] : undefined,
      js: jsMatch ? jsMatch[1] : undefined,
    }
  }

  // Apply code from assistant to editor
  const applyCode = (codeBlocks: Message["codeBlocks"]) => {
    if (!codeBlocks) return

    let appliedChanges = false
    let updateMessage = ""

    if (codeBlocks.html) {
      onCodeUpdate.updateHtml(codeBlocks.html)
      appliedChanges = true
      updateMessage += "HTML"
    }

    if (codeBlocks.css) {
      onCodeUpdate.updateCss(codeBlocks.css)
      appliedChanges = true
      updateMessage += updateMessage ? ", CSS" : "CSS"
    }

    if (codeBlocks.js) {
      onCodeUpdate.updateJs(codeBlocks.js)
      appliedChanges = true
      updateMessage += updateMessage ? ", JavaScript" : "JavaScript"
    }

    if (appliedChanges) {
      toast({
        title: "Code applied",
        description: `Updated ${updateMessage} code in the editor.`,
      })
    } else {
      toast({
        title: "No code changes",
        description: "No code blocks were found to apply.",
        variant: "destructive",
      })
    }
  }

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

  // Handle textarea resize
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)

    // Auto-resize textarea
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`
  }

  // Handle key press in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full text-xs">
      <ScrollArea className="flex-1 p-2 bg-white">
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col max-w-[95%] rounded-lg p-2",
                message.role === "user" ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-slate-100 text-slate-900",
              )}
            >
              <div className="whitespace-pre-wrap text-xs">{formatMessageContent(message.content)}</div>

              {message.codeBlocks && Object.values(message.codeBlocks).some(Boolean) && (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "mt-1 self-start h-6 text-xs",
                    message.role === "user" ? "bg-white text-blue-600 hover:bg-slate-100" : "bg-white",
                  )}
                  onClick={() => applyCode(message.codeBlocks)}
                >
                  <Code className="h-3 w-3 mr-1" />
                  Apply Code
                </Button>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {error && (
        <div className="px-2 py-1 text-xs text-red-600 bg-red-50 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}

      <div className="border-t p-2 bg-white">
        <div className="flex items-start gap-1">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={inputValue}
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
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="sm"
            className="h-7 w-7 p-0 self-start"
            aria-label="Send message"
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          </Button>
        </div>

        <div className="flex flex-wrap gap-1 mt-1">
          {["Fix my code", "Add feature", "Optimize", "Debug"].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="text-[10px] h-5 py-0 px-1 bg-white"
              onClick={() => setInputValue(suggestion)}
              disabled={isLoading}
            >
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
