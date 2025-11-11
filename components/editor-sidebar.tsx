"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Save, Eye, Download, Plus, Zap, Folder, Settings } from "lucide-react"
import { useProposalStore } from "@/lib/store"
import { useState } from "react"
import { exportToPDF } from "@/lib/export-pdf"
import { templates } from "@/lib/templates"
import { PlaceholderEditor } from "./placeholder-editor"

export function EditorSidebar({ onPreview, onShowProposals, editor }) {
  const { content, setContent, saveToLocalStorage } = useProposalStore()
  const [saved, setSaved] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showPlaceholderEditor, setShowPlaceholderEditor] = useState(false)

  const handleSave = () => {
    saveToLocalStorage()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExportPDF = async () => {
    if (content) {
      await exportToPDF(content, "proposal.pdf")
    }
  }

  const handleNew = () => {
    if (window.confirm("Clear current proposal and start new?")) {
      useProposalStore.getState().clearContent()
      if (editor) {
        editor.commands.setContent("<h1>New Proposal</h1><p>Start typing...</p>")
      }
    }
  }

  const handleLoadTemplate = (templateContent: string) => {
    if (editor) {
      editor.commands.setContent(templateContent)
      setContent(templateContent)
      setShowTemplates(false)
      setSaved(false)
    }
  }

  const handleExportJSON = () => {
    if (content) {
      const data = {
        timestamp: new Date().toISOString(),
        content: content,
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "proposal.json"
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleApplyPlaceholderValues = (values: { [key: string]: string }) => {
    let updated = content
    Object.entries(values).forEach(([key, value]) => {
      updated = updated.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value)
    })
    setContent(updated)
    if (editor) {
      editor.commands.setContent(updated)
    }
    setShowPlaceholderEditor(false)
  }

  return (
    <div className="p-6 flex flex-col gap-4 h-full overflow-y-auto">
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground">Actions</h3>
        <p className="text-xs text-muted-foreground">Manage your proposal</p>
      </div>

      <Card className="p-4 bg-muted/50">
        <div className="space-y-3">
          <Button variant="default" size="sm" className="w-full justify-start gap-2" onClick={handleNew}>
            <Plus className="w-4 h-4" />
            New Proposal
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 bg-transparent"
            onClick={handleSave}
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Proposal"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 bg-transparent"
            onClick={onShowProposals}
          >
            <Folder className="w-4 h-4" />
            My Proposals
          </Button>

          <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent" onClick={onPreview}>
            <Eye className="w-4 h-4" />
            Preview
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 bg-transparent"
            onClick={handleExportPDF}
          >
            <Download className="w-4 h-4" />
            Export as PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 bg-transparent"
            onClick={handleExportJSON}
          >
            <FileText className="w-4 h-4" />
            Export as JSON
          </Button>
        </div>
      </Card>

      <Card className="p-4 bg-muted/50">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Templates
            </h4>
            <p className="text-xs text-muted-foreground mt-1">Start with a template</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="w-full text-xs"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            {showTemplates ? "Hide" : "Show"} Templates
          </Button>

          {showTemplates && (
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleLoadTemplate(template.content)}
                  className="w-full text-left p-3 rounded-md bg-background hover:bg-accent/10 transition-colors border border-border"
                >
                  <p className="font-medium text-sm text-foreground">{template.name}</p>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 bg-muted/50">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Placeholders
            </h4>
            <p className="text-xs text-muted-foreground mt-1">Configure dynamic values</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="w-full text-xs"
            onClick={() => setShowPlaceholderEditor(true)}
          >
            Edit Placeholder Values
          </Button>
          <div className="space-y-1 text-xs font-mono mt-3">
            <p className="text-muted-foreground text-xs font-normal mb-2">Available placeholders:</p>
            <div className="bg-background p-2 rounded">{"{{client.name}}"}</div>
            <div className="bg-background p-2 rounded">{"{{project.title}}"}</div>
            <div className="bg-background p-2 rounded">{"{{budget}}"}</div>
            <div className="bg-background p-2 rounded">{"{{timeline}}"}</div>
            <div className="bg-background p-2 rounded">{"{{deliverables}}"}</div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-muted/50">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-foreground">Info</h4>
          <p className="text-xs text-muted-foreground">
            Your proposals are automatically saved to your browser's local storage every 30 seconds.
          </p>
        </div>
      </Card>

      {showPlaceholderEditor && (
        <PlaceholderEditor
          content={content}
          onClose={() => setShowPlaceholderEditor(false)}
          onApply={handleApplyPlaceholderValues}
        />
      )}
    </div>
  )
}
