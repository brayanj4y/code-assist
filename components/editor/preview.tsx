"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCcw } from "lucide-react"

interface PreviewProps {
  html: string
  css: string
  js: string
}

export function Preview({ html, css, js }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Update preview whenever code changes or manually triggered
  const updatePreview = () => {
    if (!iframeRef.current) return
    setIsLoading(true)

    try {
      // Create a blob URL with the HTML content to avoid cross-origin issues
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>
              try {
                ${js}
              } catch (error) {
                console.error('JavaScript Error:', error);
                
                // Display error in the preview
                const errorDiv = document.createElement('div');
                errorDiv.style.position = 'fixed';
                errorDiv.style.bottom = '0';
                errorDiv.style.left = '0';
                errorDiv.style.right = '0';
                errorDiv.style.padding = '8px';
                errorDiv.style.background = 'rgba(255, 0, 0, 0.7)';
                errorDiv.style.color = 'white';
                errorDiv.style.fontFamily = 'monospace';
                errorDiv.style.fontSize = '12px';
                errorDiv.style.zIndex = '9999';
                errorDiv.textContent = 'JavaScript Error: ' + error.message;
                document.body.appendChild(errorDiv);
              }
            </script>
          </body>
        </html>
      `

      // Create a blob URL for the HTML content
      const blob = new Blob([htmlContent], { type: "text/html" })
      const blobUrl = URL.createObjectURL(blob)

      // Set the iframe src to the blob URL
      iframeRef.current.src = blobUrl

      setHasError(false)
      setErrorMessage("")

      // Clean up the blob URL when the iframe loads
      iframeRef.current.onload = () => {
        URL.revokeObjectURL(blobUrl)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error updating preview:", error)
      setHasError(true)
      setErrorMessage(error instanceof Error ? error.message : "Unknown error")
      setIsLoading(false)
    }
  }

  // Update preview when code changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      updatePreview()
    }, 500) // Add a small delay to prevent too frequent updates

    return () => clearTimeout(timer)
  }, [html, css, js])

  return (
    <div className="h-full w-full bg-white relative flex flex-col overflow-hidden">
      <div className="border-b px-2 py-1 flex justify-between items-center bg-white">
        <span className="text-xs font-medium">Preview</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={updatePreview} aria-label="Refresh preview">
          <RefreshCcw className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center p-4">
              <p className="text-red-500 font-medium">Error rendering preview</p>
              <p className="text-xs text-slate-600 mt-1">{errorMessage}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={updatePreview}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          title="Preview"
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-modals"
          aria-label="Code preview"
        />
      </div>
    </div>
  )
}
