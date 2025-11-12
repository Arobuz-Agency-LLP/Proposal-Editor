"use client"

import { useState, useEffect } from "react"
import { EditorToolbar } from "./editor-toolbar"
import { EditorSidebar } from "./editor-sidebar"
import { PreviewModal } from "./preview-modal"
import { ProposalsList } from "./proposals-list"
import { TiptapEditor } from "./tiptap-editor"
import { useProposalStore } from "@/lib/store"

export function ProposalEditor() {
  const [showPreview, setShowPreview] = useState(false)
  const [showProposalsList, setShowProposalsList] = useState(false)
  const [editorInstance, setEditorInstance] = useState(null)
  const { content, loadFromStorage } = useProposalStore()

  useEffect(() => {
    loadFromStorage()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (content && content.trim()) {
        useProposalStore.getState().saveToLocalStorage()
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(interval)
  }, [content])

  return (
    <div className="flex h-[calc(100vh-80px)] gap-0 relative">
      {/* Main Editor Area - 70% */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <EditorToolbar editor={editorInstance} />
        <TiptapEditor onEditorReady={setEditorInstance} />
      </div>

      {/* Sidebar - 30% */}
      <div className="w-[30%] border-l border-border/50 bg-gradient-to-b from-card/50 to-background overflow-y-auto backdrop-blur-sm">
        <EditorSidebar
          onPreview={() => setShowPreview(true)}
          onShowProposals={() => setShowProposalsList(true)}
          editor={editorInstance}
        />
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="animate-fadeIn">
          <PreviewModal content={content} onClose={() => setShowPreview(false)} />
        </div>
      )}

      {/* Proposals List Modal */}
      {showProposalsList && (
        <div className="animate-fadeIn">
          <ProposalsList onClose={() => setShowProposalsList(false)} />
        </div>
      )}
    </div>
  )
}
