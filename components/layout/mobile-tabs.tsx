"use client"

interface MobileTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
  return (
    <div className="border-b px-2 bg-white">
      <div className="flex h-7 my-1 bg-slate-100 rounded-md p-0.5">
        <button
          className={`flex-1 text-xs px-2 h-5 rounded ${
            activeTab === "editor" ? "bg-white text-blue-600" : "text-slate-600"
          }`}
          onClick={() => onTabChange("editor")}
        >
          Editor
        </button>
        <button
          className={`flex-1 text-xs px-2 h-5 rounded ${
            activeTab === "preview" ? "bg-white text-blue-600" : "text-slate-600"
          }`}
          onClick={() => onTabChange("preview")}
        >
          Preview
        </button>
      </div>
    </div>
  )
}
