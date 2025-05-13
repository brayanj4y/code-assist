"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Play, Code, MessageSquare, Download, Upload, Plus, X, FileCode } from "lucide-react"
import Editor from "@/components/editor"
import Preview from "@/components/preview"
import ChatAssistant from "@/components/chat-assistant"
import FileExplorer from "@/components/file-explorer"
import { defaultCode } from "@/lib/default-code"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import JSZip from "jszip"
import FileSaver from "file-saver"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function CodeEditor() {
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [activeFile, setActiveFile] = useState("html")
  const [htmlCode, setHtmlCode] = useState("")
  const [cssCode, setCssCode] = useState("")
  const [jsCode, setJsCode] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [projectName, setProjectName] = useState("Untitled Project")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showProjectList, setShowProjectList] = useState(false)
  const [savedProjects, setSavedProjects] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Load saved code from localStorage on initial render
  useEffect(() => {
    setMounted(true)
    const savedProject = localStorage.getItem("currentProject")

    if (savedProject) {
      try {
        const { name, html, css, js } = JSON.parse(savedProject)
        setProjectName(name)
        setHtmlCode(html)
        setCssCode(css)
        setJsCode(js)
      } catch (error) {
        console.error("Error loading saved project:", error)
        resetToDefault()
      }
    } else {
      resetToDefault()
    }

    // Load saved projects list
    try {
      const projects = JSON.parse(localStorage.getItem("savedProjects") || "[]")
      setSavedProjects(projects)
    } catch (error) {
      console.error("Error loading saved projects:", error)
      setSavedProjects([])
    }

    // Load last active file
    const lastFile = localStorage.getItem("lastActiveFile")
    if (lastFile) {
      setActiveFile(lastFile)
    }
  }, [])

  // Reset to default code
  const resetToDefault = () => {
    setProjectName("Untitled Project")
    setHtmlCode(defaultCode.html)
    setCssCode(defaultCode.css)
    setJsCode(defaultCode.js)
  }

  // Save current code to localStorage
  useEffect(() => {
    if (mounted && htmlCode && cssCode && jsCode) {
      const currentProject = {
        name: projectName,
        html: htmlCode,
        css: cssCode,
        js: jsCode,
        lastModified: new Date().toISOString(),
      }
      localStorage.setItem("currentProject", JSON.stringify(currentProject))
    }
  }, [htmlCode, cssCode, jsCode, projectName, mounted])

  // Save last active file
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("lastActiveFile", activeFile)
    }
  }, [activeFile, mounted])

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

  // Save project with a name
  const saveProject = () => {
    setShowSaveDialog(true)
  }

  // Handle save dialog confirm
  const handleSaveConfirm = () => {
    if (!projectName.trim()) {
      toast({
        title: "Invalid project name",
        description: "Please enter a valid project name.",
        variant: "destructive",
      })
      return
    }

    try {
      const project = {
        name: projectName,
        html: htmlCode,
        css: cssCode,
        js: jsCode,
        lastModified: new Date().toISOString(),
      }

      // Get existing projects or initialize empty array
      const existingProjects = JSON.parse(localStorage.getItem("savedProjects") || "[]")

      // Check if project with same name exists
      const projectIndex = existingProjects.findIndex((p: any) => p.name === projectName)

      if (projectIndex >= 0) {
        // Update existing project
        existingProjects[projectIndex] = project
      } else {
        // Add new project
        existingProjects.push(project)
      }

      localStorage.setItem("savedProjects", JSON.stringify(existingProjects))
      localStorage.setItem("currentProject", JSON.stringify(project))
      setSavedProjects(existingProjects)

      toast({
        title: "Project saved",
        description: `${projectName} has been saved successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error saving project",
        description: "There was an error saving your project.",
        variant: "destructive",
      })
    } finally {
      setShowSaveDialog(false)
    }
  }

  // Create a new project
  const createNewProject = () => {
    resetToDefault()
    toast({
      title: "New project created",
      description: "You can now start coding your new project.",
    })
  }

  // Load a saved project
  const loadProject = (project: any) => {
    setProjectName(project.name)
    setHtmlCode(project.html)
    setCssCode(project.css)
    setJsCode(project.js)
    setShowProjectList(false)

    toast({
      title: "Project loaded",
      description: `${project.name} has been loaded successfully.`,
    })
  }

  // Delete a saved project
  const deleteProject = (projectName: string, e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      const updatedProjects = savedProjects.filter((p) => p.name !== projectName)
      localStorage.setItem("savedProjects", JSON.stringify(updatedProjects))
      setSavedProjects(updatedProjects)

      toast({
        title: "Project deleted",
        description: `${projectName} has been deleted.`,
      })
    } catch (error) {
      toast({
        title: "Error deleting project",
        description: "There was an error deleting the project.",
        variant: "destructive",
      })
    }
  }

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const fileName = file.name.toLowerCase()

        // Determine file type by extension
        if (fileName.endsWith(".html")) {
          setHtmlCode(content)
          setActiveFile("html")
          toast({
            title: "HTML file loaded",
            description: `${file.name} has been loaded into the HTML editor.`,
          })
        } else if (fileName.endsWith(".css")) {
          setCssCode(content)
          setActiveFile("css")
          toast({
            title: "CSS file loaded",
            description: `${file.name} has been loaded into the CSS editor.`,
          })
        } else if (fileName.endsWith(".js")) {
          setJsCode(content)
          setActiveFile("js")
          toast({
            title: "JavaScript file loaded",
            description: `${file.name} has been loaded into the JavaScript editor.`,
          })
        } else if (fileName.endsWith(".json")) {
          // Try to parse as a project file
          const project = JSON.parse(content)
          if (project.html && project.css && project.js) {
            setProjectName(project.name || "Uploaded Project")
            setHtmlCode(project.html)
            setCssCode(project.css)
            setJsCode(project.js)

            toast({
              title: "Project loaded",
              description: `${project.name || "Project"} has been loaded successfully.`,
            })
          } else {
            throw new Error("Invalid project file format")
          }
        } else {
          throw new Error("Unsupported file type")
        }
      } catch (error) {
        toast({
          title: "Error loading file",
          description: "The file could not be loaded correctly. Make sure it's a valid file.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)

    // Reset the input value so the same file can be uploaded again
    event.target.value = ""
  }

  // Download project as ZIP
  const downloadProject = async () => {
    try {
      const zip = new JSZip()

      // Add files to the zip
      zip.file("index.html", htmlCode)
      zip.file("styles.css", cssCode)
      zip.file("script.js", jsCode)

      // Generate project info file
      const projectInfo = {
        name: projectName,
        html: htmlCode,
        css: cssCode,
        js: jsCode,
        lastModified: new Date().toISOString(),
      }
      zip.file("project.json", JSON.stringify(projectInfo, null, 2))

      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" })

      // Save the zip file
      FileSaver.saveAs(content, `${projectName.replace(/\s+/g, "-").toLowerCase()}.zip`)

      toast({
        title: "Project downloaded",
        description: "Your project has been downloaded as a ZIP file.",
      })
    } catch (error) {
      toast({
        title: "Error downloading project",
        description: "There was an error creating the ZIP file.",
        variant: "destructive",
      })
    }
  }

  // Toggle chat assistant
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Handle file selection
  const handleFileSelect = (fileId: string) => {
    setActiveFile(fileId)
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
    <div className="flex flex-col h-screen bg-white">
      {/* Compact Header */}
      <header className="border-b bg-white z-10 py-1">
        <div className="container flex items-center justify-between h-8 px-2">
          <div className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            <h1 className="text-sm font-semibold truncate max-w-[150px]" title={projectName}>
              {projectName}
            </h1>
          </div>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={createNewProject}>
                    <Plus className="h-3.5 w-3.5" />
                    <span className="sr-only">New Project</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>New Project</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={saveProject}>
                    <Save className="h-3.5 w-3.5" />
                    <span className="sr-only">Save Project</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save Project</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowProjectList(true)}>
                    <FileCode className="h-3.5 w-3.5" />
                    <span className="sr-only">Open Project</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open Project</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={triggerFileUpload}>
                    <Upload className="h-3.5 w-3.5" />
                    <span className="sr-only">Upload File</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".html,.css,.js,.json"
                      onChange={handleFileUpload}
                      aria-label="Upload file"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload File</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={downloadProject}>
                    <Download className="h-3.5 w-3.5" />
                    <span className="sr-only">Download as ZIP</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download as ZIP</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={runCode}>
                    {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                    <span className="sr-only">Run Code</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Run Code</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isChatOpen ? "default" : "ghost"}
                    size="icon"
                    className="h-7 w-7"
                    onClick={toggleChat}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="sr-only">AI Assistant</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI Assistant</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      {isMobile && (
        <div className="border-b px-2 bg-white">
          <div className="flex h-7 my-1 bg-slate-100 rounded-md p-0.5">
            <button
              className={`flex-1 text-xs px-2 h-5 rounded ${
                activeTab === "editor" ? "bg-white text-blue-600" : "text-slate-600"
              }`}
              onClick={() => setActiveTab("editor")}
            >
              Editor
            </button>
            <button
              className={`flex-1 text-xs px-2 h-5 rounded ${
                activeTab === "preview" ? "bg-white text-blue-600" : "text-slate-600"
              }`}
              onClick={() => setActiveTab("preview")}
            >
              Preview
            </button>
          </div>
        </div>
      )}

      {/* Main Content - Fixed Layout (No Resizable Panels) */}
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          <div className="h-full">
            {activeTab === "editor" ? (
              <div className="h-full flex">
                {/* Sidebar - Fixed Width */}
                <div className="w-16 flex-shrink-0 border-r">
                  <FileExplorer activeFile={activeFile} onFileSelect={handleFileSelect} />
                </div>

                {/* Editor */}
                <div className="flex-1 h-full">
                  <Editor language={getCurrentLanguage()} value={getCurrentCode()} onChange={setCurrentCode} />
                </div>
              </div>
            ) : (
              <Preview html={htmlCode} css={cssCode} js={jsCode} />
            )}
          </div>
        ) : (
          <div className="flex h-full">
            {/* File Explorer - Fixed Width */}
            <div className="w-48 flex-shrink-0 border-r">
              <FileExplorer activeFile={activeFile} onFileSelect={handleFileSelect} />
            </div>

            {/* Main Content Area - Fixed Layout */}
            <div className="flex flex-1 h-full">
              {/* Editor Panel */}
              <div className="h-full border-r" style={{ width: isChatOpen ? "40%" : "50%" }}>
                <Editor language={getCurrentLanguage()} value={getCurrentCode()} onChange={setCurrentCode} />
              </div>

              {/* Preview Panel */}
              <div className="h-full border-r" style={{ width: isChatOpen ? "30%" : "50%" }}>
                <Preview html={htmlCode} css={cssCode} js={jsCode} />
              </div>

              {/* Chat Assistant (conditionally rendered) */}
              {isChatOpen && (
                <div className="h-full" style={{ width: "30%" }}>
                  <div className="h-full flex flex-col bg-white">
                    <div className="border-b px-2 py-1 flex justify-between items-center">
                      <span className="text-xs font-medium">Gemini Assistant</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={toggleChat}>
                        <X className="h-3 w-3" />
                        <span className="sr-only">Close Assistant</span>
                      </Button>
                    </div>
                    <ChatAssistant
                      htmlCode={htmlCode}
                      cssCode={cssCode}
                      jsCode={jsCode}
                      onCodeUpdate={{
                        updateHtml: setHtmlCode,
                        updateCss: setCssCode,
                        updateJs: setJsCode,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Save Project Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle>Save Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-name" className="text-right">
                Name
              </Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="col-span-3"
                aria-label="Project name"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfirm}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project List Dialog */}
      <Dialog open={showProjectList} onOpenChange={setShowProjectList}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>Open Project</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto pr-1">
            {savedProjects.length > 0 ? (
              <div className="space-y-2">
                {savedProjects.map((project, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded-md hover:bg-slate-50 cursor-pointer"
                    onClick={() => loadProject(project)}
                  >
                    <div className="overflow-hidden">
                      <div className="font-medium truncate">{project.name}</div>
                      <div className="text-xs text-slate-500">Last modified: {formatDate(project.lastModified)}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => deleteProject(project.name, e)}
                      aria-label={`Delete ${project.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>No saved projects found.</p>
                <p className="text-xs mt-1">Save a project to see it here.</p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowProjectList(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
