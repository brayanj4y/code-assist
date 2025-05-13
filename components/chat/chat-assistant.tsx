"use client"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import { ChatHeader } from "./chat-header"
import { ChatMessage, type CodeBlocks } from "./chat-message"
import { ChatInput } from "./chat-input"

interface ChatAssistantProps {
  htmlCode: string
  cssCode: string
  jsCode: string
  onCodeUpdate: {
    updateHtml: (code: string) => void
    updateCss: (code: string) => void
    updateJs: (code: string) => void
  }
  onClose: () => void
}

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  codeBlocks?: CodeBlocks
}

export function ChatAssistant({ htmlCode, cssCode, jsCode, onCodeUpdate, onClose }: ChatAssistantProps) {
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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
  const applyCode = (codeBlocks: CodeBlocks) => {
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

  const suggestions = ["Fix my code", "Add feature", "Optimize", "Debug"]

  return (
    <div className="flex flex-col h-full text-xs">
      <ChatHeader onClose={onClose} />

      <ScrollArea className="flex-1 p-2 bg-white">
        <div className="space-y-2">
          {messages.map((message) => (
            <ChatMessage key={message.id} {...message} onApplyCode={applyCode} />
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

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={sendMessage}
        isLoading={isLoading}
        suggestions={suggestions}
      />
    </div>
  )
}
