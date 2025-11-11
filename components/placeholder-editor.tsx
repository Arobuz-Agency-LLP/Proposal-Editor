"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Save } from "lucide-react"
import { useState, useEffect } from "react"

interface PlaceholderValues {
  [key: string]: string
}

interface PlaceholderEditorProps {
  content: string
  onClose: () => void
  onApply: (values: PlaceholderValues) => void
}

export function PlaceholderEditor({ content, onClose, onApply }: PlaceholderEditorProps) {
  const [placeholders, setPlaceholders] = useState<PlaceholderValues>({})
  const [savedValues, setSavedValues] = useState<PlaceholderValues>({})

  // Extract placeholders from content
  useEffect(() => {
    const placeholderRegex = /\{\{([^}]+)\}\}/g
    const found: { [key: string]: string } = {}
    let match

    while ((match = placeholderRegex.exec(content)) !== null) {
      const key = match[1]
      if (!found[key]) {
        found[key] = savedValues[key] || ""
      }
    }

    setPlaceholders(found)
  }, [content, savedValues])

  const handleInputChange = (key: string, value: string) => {
    setPlaceholders((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = () => {
    setSavedValues(placeholders)
    onApply(placeholders)
    localStorage.setItem("placeholder_values", JSON.stringify(placeholders))
  }

  const placeholderKeys = Object.keys(placeholders)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Placeholder Values</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {placeholderKeys.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">No placeholders found in your proposal.</p>
          ) : (
            placeholderKeys.map((key) => (
              <div key={key} className="space-y-1">
                <label className="text-sm font-medium text-foreground block">{key}</label>
                <input
                  type="text"
                  value={placeholders[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  placeholder={`Enter value for {{${key}}}...`}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border p-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="flex-1 gap-2"
            disabled={placeholderKeys.length === 0}
          >
            <Save className="w-4 h-4" />
            Apply Values
          </Button>
        </div>
      </Card>
    </div>
  )
}
