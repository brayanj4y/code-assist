"use client"

import type React from "react"
import { useRef } from "react"
import { useToast } from "@/hooks/use-toast"

interface FileOperationsProps {
  projectName: string
  htmlCode: string
  cssCode: string
  jsCode: string
  setHtmlCode: (code: string) => void
  setCssCode: (code: string) => void
  setJsCode: (code: string) => void
  setActiveFile: (file: string) => void
}

export function useFileOperations({
  projectName,
  htmlCode,
  cssCode,
  jsCode,
  setHtmlCode,
  setCssCode,
  setJsCode,
  setActiveFile,
}: FileOperationsProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      // Dynamically import JSZip and FileSaver only on the client side
      const JSZip = (await import("jszip")).default
      const FileSaver = await import("file-saver")

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

      // Save the zip file using the correct FileSaver method
      FileSaver.default.saveAs(content, `${projectName.replace(/\s+/g, "-").toLowerCase()}.zip`)

      toast({
        title: "Project downloaded",
        description: "Your project has been downloaded as a ZIP file.",
      })
    } catch (error) {
      console.error("Error downloading project:", error)
      toast({
        title: "Error downloading project",
        description: "There was an error creating the ZIP file.",
        variant: "destructive",
      })
    }
  }

  return {
    fileInputRef,
    triggerFileUpload,
    handleFileUpload,
    downloadProject,
  }
}
