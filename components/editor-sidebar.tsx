"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Save, Eye, Download, Plus, Zap, Folder, Settings } from "lucide-react"
import { useProposalStore } from "@/lib/store"
import { useState } from "react"
import { exportToPDF } from "@/lib/export-pdf"
import { templates } from "@/lib/templates"
import { PlaceholderEditor } from "./placeholder-editor"
import { PageNavigator } from "./page-navigator"

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
    if (!content || content.trim().length === 0) {
      alert("No content to export. Please add some content to your proposal first.")
      return
    }
    
    try {
      await exportToPDF(content, "proposal.pdf")
    } catch (error) {
      console.error("Export error:", error)
      // Error is already handled in exportToPDF function
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
    <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto">
      <div className="space-y-1 animate-fadeIn">
        <h3 className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Actions</h3>
        <p className="text-xs text-muted-foreground">Manage your proposal</p>
      </div>

      <Card className="p-5 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <div className="space-y-2.5">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full justify-start gap-2.5 hover:scale-[1.02] transition-all duration-200 hover:shadow-md font-medium" 
            onClick={handleNew}
          >
            <Plus className="w-4 h-4" />
            New Proposal
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2.5 bg-background/50 hover:bg-accent/50 hover:scale-[1.02] transition-all duration-200 hover:shadow-md"
            onClick={handleSave}
          >
            <Save className={`w-4 h-4 transition-transform ${saved ? 'scale-110' : ''}`} />
            {saved ? <span className="text-primary font-semibold">Saved!</span> : "Save Proposal"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2.5 bg-background/50 hover:bg-accent/50 hover:scale-[1.02] transition-all duration-200 hover:shadow-md"
            onClick={onShowProposals}
          >
            <Folder className="w-4 h-4" />
            My Proposals
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2.5 bg-background/50 hover:bg-accent/50 hover:scale-[1.02] transition-all duration-200 hover:shadow-md" 
            onClick={onPreview}
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2.5 bg-background/50 hover:bg-accent/50 hover:scale-[1.02] transition-all duration-200 hover:shadow-md"
            onClick={handleExportPDF}
          >
            <Download className="w-4 h-4" />
            Export as PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2.5 bg-background/50 hover:bg-accent/50 hover:scale-[1.02] transition-all duration-200 hover:shadow-md"
            onClick={handleExportJSON}
          >
            <FileText className="w-4 h-4" />
            Export as JSON
          </Button>
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-base text-foreground flex items-center gap-2.5 mb-1">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              Templates
            </h4>
            <p className="text-xs text-muted-foreground">Start with a template</p>
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
            <div className="space-y-2.5 animate-fadeIn">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleLoadTemplate(template.content)}
                  className="w-full text-left p-4 rounded-lg bg-background/80 hover:bg-accent/20 transition-all duration-200 border border-border/50 hover:border-primary/30 hover:scale-[1.02] hover:shadow-md group"
                >
                  <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{template.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-base text-foreground flex items-center gap-2.5 mb-1">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              Placeholders
            </h4>
            <p className="text-xs text-muted-foreground">Configure dynamic values</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="w-full text-xs"
            onClick={() => setShowPlaceholderEditor(true)}
          >
            Edit Placeholder Values
          </Button>
          <div className="space-y-2 text-xs font-mono mt-3">
            <p className="text-muted-foreground text-xs font-normal mb-2">Available placeholders:</p>
            <div className="bg-background/80 p-2.5 rounded-lg border border-border/50 hover:border-primary/30 transition-colors hover:bg-primary/5">{"{{client.name}}"}</div>
            <div className="bg-background/80 p-2.5 rounded-lg border border-border/50 hover:border-primary/30 transition-colors hover:bg-primary/5">{"{{project.title}}"}</div>
            <div className="bg-background/80 p-2.5 rounded-lg border border-border/50 hover:border-primary/30 transition-colors hover:bg-primary/5">{"{{budget}}"}</div>
            <div className="bg-background/80 p-2.5 rounded-lg border border-border/50 hover:border-primary/30 transition-colors hover:bg-primary/5">{"{{timeline}}"}</div>
            <div className="bg-background/80 p-2.5 rounded-lg border border-border/50 hover:border-primary/30 transition-colors hover:bg-primary/5">{"{{deliverables}}"}</div>
          </div>
        </div>
      </Card>

      <PageNavigator editor={editor} />

      <Card className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm border border-primary/20 shadow-lg">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            Auto-Save Active
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
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
