"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useToast } from "@/hooks/use-toast"
import { useProjectStorage } from "@/hooks/use-project-storage"
import { useFileOperations } from "@/hooks/use-file-operations"

import { Header } from "@/components/layout/header"
import { MobileTabs } from "@/components/layout/mobile-tabs"
import { FileExplorer } from "@/components/editor/file-explorer"
import { CodeEditor } from "@/components/editor/code-editor"
import { Preview } from "@/components/editor/preview"
import { ChatAssistant } from "@/components/chat/chat-assistant"
import { SaveProjectDialog } from "@/components/project/save-project-dialog"
import { ProjectListDialog } from "@/components/project/project-list-dialog"

export function App() {
  const {
    projectName,
    setProjectName,
    htmlCode,
    setHtmlCode,
    cssCode,
    setCssCode,
    jsCode,
    setJsCode,
    activeFile,
    setActiveFile,
    savedProjects,
    createNewProject,
    saveProject,
    loadProject,
    deleteProject,
    formatDate,
    mounted,
  } = useProjectStorage()

  const { fileInputRef, triggerFileUpload, handleFileUpload, downloadProject } = useFileOperations({
    projectName,
    htmlCode,
    cssCode,
    jsCode,
    setHtmlCode,
    setCssCode,
    setJsCode,
    setActiveFile,
  })

  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("editor")
  const [isRunning, setIsRunning] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showProjectList, setShowProjectList] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [editorKey, setEditorKey] = useState(0) // Key to force editor remount when needed

  // Force editor remount when switching files
  useEffect(() => {
    setEditorKey((prev) => prev + 1)
  }, [activeFile])

  // Run code and update preview
  const runCode = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 500)

    // Focus on preview if on mobile
    if (isMobile) {
      setActiveTab("preview")
    }

    toast({
      title: "Code executed",
      description: "Your code has been executed in the preview panel.",
      duration: 2000,
    })
  }

  // Handle save dialog confirm
  const handleSaveConfirm = () => {
    const success = saveProject()
    if (success) {
      setShowSaveDialog(false)
    }
  }

  // Handle project deletion with event stopping
  const handleDeleteProject = (projectName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteProject(projectName)
  }

  // Get current code based on active file
  const getCurrentCode = () => {
    switch (activeFile) {
      case "html":
        return htmlCode
      case "css":
        return cssCode
      case "js":
        return jsCode
      default:
        return ""
    }
  }

  // Set current code based on active file
  const setCurrentCode = (code: string) => {
    switch (activeFile) {
      case "html":
        setHtmlCode(code)
        break
      case "css":
        setCssCode(code)
        break
      case "js":
        setJsCode(code)
        break
    }
  }

  // Get language based on active file
  const getCurrentLanguage = () => {
    switch (activeFile) {
      case "html":
        return "html"
      case "css":
        return "css"
      case "js":
        return "javascript"
      default:
        return "html"
    }
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Header */}
      <Header
        projectName={projectName}
        isRunning={isRunning}
        isChatOpen={isChatOpen}
        onNewProject={createNewProject}
        onSaveProject={() => setShowSaveDialog(true)}
        onOpenProjectList={() => setShowProjectList(true)}
        onRunCode={runCode}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onFileUpload={handleFileUpload}
        onDownloadProject={downloadProject}
      />

      {/* Mobile Tab Switcher */}
      {isMobile && <MobileTabs activeTab={activeTab} onTabChange={setActiveTab} />}

      {/* Main Content - Fixed Layout */}
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          <div className="h-full">
            {activeTab === "editor" ? (
              <div className="h-full flex">
                {/* Sidebar - Fixed Width */}
                <div className="w-16 flex-shrink-0">
                  <FileExplorer activeFile={activeFile} onFileSelect={setActiveFile} />
                </div>

                {/* Editor */}
                <div className="flex-1 h-full overflow-hidden">
                  <CodeEditor
                    key={`mobile-editor-${editorKey}`}
                    language={getCurrentLanguage()}
                    value={getCurrentCode()}
                    onChange={setCurrentCode}
                  />
                </div>
              </div>
            ) : (
              <Preview html={htmlCode} css={cssCode} js={jsCode} />
            )}
          </div>
        ) : (
          <div className="flex h-full overflow-hidden">
            {/* File Explorer - Fixed Width */}
            <div className="w-48 flex-shrink-0">
              <FileExplorer activeFile={activeFile} onFileSelect={setActiveFile} />
            </div>

            {/* Main Content Area - Fixed Layout */}
            <div className="flex flex-1 h-full overflow-hidden">
              {/* Editor Panel */}
              <div
                className="h-full overflow-hidden"
                style={{
                  width: isChatOpen ? "40%" : "50%",
                  minWidth: "300px", // Ensure minimum width for editor
                }}
              >
                <CodeEditor
                  key={`desktop-editor-${editorKey}`}
                  language={getCurrentLanguage()}
                  value={getCurrentCode()}
                  onChange={setCurrentCode}
                />
              </div>

              {/* Preview Panel */}
              <div
                className="h-full border-l border-r overflow-hidden"
                style={{
                  width: isChatOpen ? "30%" : "50%",
                  minWidth: isChatOpen ? "200px" : "300px", // Ensure minimum width for preview
                }}
              >
                <Preview html={htmlCode} css={cssCode} js={jsCode} />
              </div>

              {/* Chat Assistant (conditionally rendered) */}
              {isChatOpen && (
                <div className="h-full overflow-hidden" style={{ width: "30%", minWidth: "250px" }}>
                  <ChatAssistant
                    htmlCode={htmlCode}
                    cssCode={cssCode}
                    jsCode={jsCode}
                    onCodeUpdate={{
                      updateHtml: setHtmlCode,
                      updateCss: setCssCode,
                      updateJs: setJsCode,
                    }}
                    onClose={() => setIsChatOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".html,.css,.js,.json"
        onChange={handleFileUpload}
        aria-label="Upload file"
      />

      {/* Save Project Dialog */}
      <SaveProjectDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onSave={handleSaveConfirm}
      />

      {/* Project List Dialog */}
      <ProjectListDialog
        open={showProjectList}
        onOpenChange={setShowProjectList}
        projects={savedProjects}
        onLoadProject={loadProject}
        onDeleteProject={handleDeleteProject}
        formatDate={formatDate}
      />
    </div>
  )
}
