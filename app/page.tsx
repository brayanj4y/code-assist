import type { Metadata } from "next"
import { ClientAppWrapper } from "@/components/client-app-wrapper"

export const metadata: Metadata = {
  title: "CodeAssist - Compact Code Editor with Gemini AI",
  description: "Write, edit, and execute code with Gemini-powered assistance",
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <ClientAppWrapper />
    </main>
  )
}
