import type React from "react"
import "@/app/globals.css"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/x-icon" />
      </head>
      <body className="light">
        {children}
        <Toaster />
      </body>
    </html>
  )
}

export const metadata = {
  title: "CodeAssist",
}
