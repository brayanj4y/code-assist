import type { Metadata } from "next"
import { App } from "@/components/app"

export const metadata: Metadata = {
  title: "CodeAssist - Compact Code Editor with Gemini AI",
  description: "Write, edit, and execute code with Gemini-powered assistance",
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <App />
    </main>
  )
}
