"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { defaultCode } from "@/lib/default-code"

export interface Project {
  name: string
  html: string
  css: string
  js: string
  lastModified: string
}

export function useProjectStorage() {
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [projectName, setProjectName] = useState("Untitled Project")
  const [htmlCode, setHtmlCode] = useState("")
  const [cssCode, setCssCode] = useState("")
  const [jsCode, setJsCode] = useState("")
  const [savedProjects, setSavedProjects] = useState<Project[]>([])
  const [activeFile, setActiveFile] = useState("html")

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

  // Create a new project
  const createNewProject = () => {
    resetToDefault()
    toast({
      title: "New project created",
      description: "You can now start coding your new project.",
    })
  }

  // Save project with a name
  const saveProject = () => {
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
      const projectIndex = existingProjects.findIndex((p: Project) => p.name === projectName)

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

      return true
    } catch (error) {
      toast({
        title: "Error saving project",
        description: "There was an error saving your project.",
        variant: "destructive",
      })

      return false
    }
  }

  // Load a saved project
  const loadProject = (project: Project) => {
    setProjectName(project.name)
    setHtmlCode(project.html)
    setCssCode(project.css)
    setJsCode(project.js)

    toast({
      title: "Project loaded",
      description: `${project.name} has been loaded successfully.`,
    })
  }

  // Delete a saved project
  const deleteProject = (projectName: string) => {
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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return {
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
  }
}
