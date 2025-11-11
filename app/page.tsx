"use client"

import { ProposalEditor } from "@/components/proposal-editor"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 max-w-full">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                P
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Proposal Editor</h1>
                <p className="text-xs text-muted-foreground">Create, manage, and export professional proposals</p>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <ProposalEditor />
    </div>
  )
}
