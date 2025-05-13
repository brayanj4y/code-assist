"use client"

import { useEffect, useRef } from "react"
import * as monaco from "monaco-editor"

interface EditorProps {
  language: string
  value: string
  onChange: (value: string) => void
}

export default function Editor({ language, value, onChange }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return

    // Dispose previous editor instance if it exists
    if (monacoEditorRef.current) {
      monacoEditorRef.current.dispose()
    }

    // Initialize Monaco Editor with light theme settings
    monacoEditorRef.current = monaco.editor.create(editorRef.current, {
      value,
      language,
      theme: "vs", // Always use light theme
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 12,
      lineHeight: 1.3,
      tabSize: 2,
      wordWrap: "on",
      lineNumbers: "on",
      glyphMargin: false,
      folding: true,
      lineDecorationsWidth: 5,
      lineNumbersMinChars: 3,
      padding: { top: 5, bottom: 5 },
      quickSuggestions: true,
      suggestOnTriggerCharacters: true,
      parameterHints: { enabled: true },
      formatOnType: true,
      formatOnPaste: true,
      accessibilitySupport: "on",
      fixedOverflowWidgets: true, // Fix for suggestion widgets
      contextmenu: true,
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
    })

    // Set up change event handler
    monacoEditorRef.current.onDidChangeModelContent(() => {
      const newValue = monacoEditorRef.current?.getValue() || ""
      onChange(newValue)
    })

    // Add keyboard shortcuts
    monacoEditorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Trigger save event
      const saveEvent = new CustomEvent("editor-save")
      document.dispatchEvent(saveEvent)
    })

    // Focus the editor after initialization
    setTimeout(() => {
      monacoEditorRef.current?.focus()
    }, 100)

    return () => {
      // No cleanup here - we'll handle disposal when language changes
    }
  }, [language]) // Recreate editor when language changes

  // Update editor value when prop changes
  useEffect(() => {
    if (monacoEditorRef.current && value !== monacoEditorRef.current.getValue()) {
      monacoEditorRef.current.setValue(value)

      // Ensure cursor is at the end of the content
      const model = monacoEditorRef.current.getModel()
      if (model) {
        const lastLine = model.getLineCount()
        const lastColumn = model.getLineMaxColumn(lastLine)
        monacoEditorRef.current.setPosition({ lineNumber: lastLine, column: lastColumn })
        monacoEditorRef.current.focus()
      }
    }
  }, [value])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose()
      }
    }
  }, [])

  return <div ref={editorRef} className="h-full w-full" />
}
