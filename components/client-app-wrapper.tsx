"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import the App component with SSR disabled
const AppComponent = dynamic(() => import("@/components/app"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
    </div>
  ),
})

export function ClientAppWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
      }
    >
      <AppComponent />
    </Suspense>
  )
}
