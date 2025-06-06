"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface CodeEditorProps {
  language: string
  value: string
  onChange: (value: string) => void
}

export default function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [monaco, setMonaco] = useState<any>(null)

  // Initialize Monaco editor
  useEffect(() => {
    let isMounted = true

    async function loadMonaco() {
      try {
        // Dynamically import monaco-editor
        const monaco = await import("monaco-editor")
        if (!isMounted) return

        setMonaco(monaco)

        // Only initialize if container exists and editor doesn't
        if (!containerRef.current || editorRef.current) return

        setIsLoading(true)
        setIsEditorReady(false)

        // Initialize Monaco Editor with optimized settings
        editorRef.current = monaco.editor.create(containerRef.current, {
          value,
          language,
          theme: "vs",
          automaticLayout: false, // We'll handle layout manually to avoid ResizeObserver errors
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 12,
          lineHeight: 1.5,
          tabSize: 2,
          wordWrap: "on",
          lineNumbers: "on",
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 5,
          lineNumbersMinChars: 3,
          padding: { top: 8, bottom: 8 },
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          parameterHints: { enabled: true },
          formatOnType: true,
          formatOnPaste: true,
          accessibilitySupport: "on",
          fixedOverflowWidgets: true,
          contextmenu: true,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            alwaysConsumeMouseWheel: false,
            useShadows: false, // Disable shadows for better performance
          },
          overviewRulerBorder: false,
          renderLineHighlight: "all",
          renderWhitespace: "none",
          renderControlCharacters: false,
          renderIndentGuides: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          domReadOnly: false, // Ensure DOM is not read-only
          readOnly: false, // Ensure editor is not read-only
        })

        // Set up change event handler
        editorRef.current.onDidChangeModelContent(() => {
          if (editorRef.current) {
            const newValue = editorRef.current.getValue()
            onChange(newValue)
          }
        })

        // Add keyboard shortcuts
        editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
          // Trigger save event
          const saveEvent = new CustomEvent("editor-save")
          document.dispatchEvent(saveEvent)
        })

        // Manually trigger layout once
        editorRef.current.layout()

        // Focus the editor after initialization
        editorRef.current.focus()
        setIsLoading(false)
        setIsEditorReady(true)
      } catch (error) {
        console.error("Error initializing editor:", error)
        setIsLoading(false)
      }
    }

    loadMonaco()

    return () => {
      isMounted = false
      // Cleanup function to dispose editor
      if (editorRef.current) {
        editorRef.current.dispose()
        editorRef.current = null
      }
    }
  }, [language]) // Recreate editor when language changes

  // Update editor value when prop changes (but only if it's different)
  useEffect(() => {
    if (!editorRef.current || !isEditorReady) return

    const currentValue = editorRef.current.getValue()
    if (value !== currentValue) {
      // Preserve cursor position and selection when updating value
      const position = editorRef.current.getPosition()
      const selection = editorRef.current.getSelection()
      const scrollTop = editorRef.current.getScrollTop()
      const scrollLeft = editorRef.current.getScrollLeft()

      editorRef.current.setValue(value)

      // Restore cursor position and selection if they existed
      if (position) {
        editorRef.current.setPosition(position)
      }
      if (selection) {
        editorRef.current.setSelection(selection)
      }

      // Restore scroll position
      editorRef.current.setScrollTop(scrollTop)
      editorRef.current.setScrollLeft(scrollLeft)
    }
  }, [value, isEditorReady])

  // Handle window resize to ensure editor layout is updated
  useEffect(() => {
    if (!editorRef.current || !isEditorReady) return

    // Throttled resize handler to prevent too many layout calls
    let resizeTimeout: NodeJS.Timeout | null = null
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
      resizeTimeout = setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.layout()
        }
      }, 100)
    }

    window.addEventListener("resize", handleResize)

    // Initial layout
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
    }
  }, [isEditorReady])

  // Handle container resize using ResizeObserver with error handling
  useEffect(() => {
    if (!containerRef.current || !editorRef.current || !isEditorReady) return

    let animationFrameId: number | null = null
    let lastWidth = containerRef.current.clientWidth
    let lastHeight = containerRef.current.clientHeight

    // Use ResizeObserver with error handling and throttling
    try {
      const resizeObserver = new ResizeObserver((entries) => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }

        animationFrameId = requestAnimationFrame(() => {
          if (!containerRef.current || !editorRef.current) return

          const newWidth = containerRef.current.clientWidth
          const newHeight = containerRef.current.clientHeight

          // Only update layout if size actually changed
          if (newWidth !== lastWidth || newHeight !== lastHeight) {
            lastWidth = newWidth
            lastHeight = newHeight
            editorRef.current.layout()
          }
        })
      })

      resizeObserver.observe(containerRef.current)

      return () => {
        resizeObserver.disconnect()
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
      }
    } catch (error) {
      console.error("ResizeObserver error:", error)
      // Fallback to periodic layout updates if ResizeObserver fails
      const intervalId = setInterval(() => {
        if (editorRef.current) {
          editorRef.current.layout()
        }
      }, 1000)

      return () => clearInterval(intervalId)
    }
  }, [isEditorReady])

  return (
    <div className="relative h-full w-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        </div>
      )}
      <div
        ref={containerRef}
        className="h-full w-full"
        style={{
          visibility: isLoading ? "hidden" : "visible",
          overflow: "hidden", // Prevent any overflow issues
        }}
      />
    </div>
  )
}
