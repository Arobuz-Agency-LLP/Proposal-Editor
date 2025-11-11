"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Download, Copy, Check } from "lucide-react"
import { exportToPDF } from "@/lib/export-pdf"
import { useState } from "react"

export function PreviewModal({ content, onClose }) {
  const [copied, setCopied] = useState(false)
  const [exportFormat, setExportFormat] = useState<"pdf" | "html">("pdf")

  const handleExportFromPreview = async () => {
    if (content) {
      if (exportFormat === "pdf") {
        await exportToPDF(content, "proposal-preview.pdf")
      } else {
        exportHTML()
      }
    }
  }

  const exportHTML = () => {
    const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proposal</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 40px;
      max-width: 900px;
    }
    h1, h2, h3 { margin-top: 30px; margin-bottom: 15px; }
    h1 { font-size: 32px; }
    h2 { font-size: 24px; }
    h3 { font-size: 18px; }
    p { margin-bottom: 15px; }
    ul, ol { margin-left: 20px; margin-bottom: 15px; }
    li { margin-bottom: 8px; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f5f5f5; font-weight: bold; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    img { max-width: 100%; height: auto; margin: 20px 0; }
    span[data-placeholder-key] { background-color: #e8f4f8; color: #0066cc; padding: 2px 6px; border-radius: 4px; font-weight: 500; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`

    const blob = new Blob([htmlDoc], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "proposal.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyHTML = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl my-auto">
        <div className="flex justify-between items-center sticky top-0 bg-card p-4 border-b border-border gap-2 flex-wrap">
          <h2 className="text-lg font-semibold text-foreground">Proposal Preview</h2>
          <div className="flex gap-2 flex-wrap">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as "pdf" | "html")}
              className="px-3 py-1 rounded border border-border bg-background text-foreground text-sm"
            >
              <option value="pdf">Export as PDF</option>
              <option value="html">Export as HTML</option>
            </select>
            <Button size="sm" variant="outline" onClick={handleExportFromPreview}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button size="sm" variant="outline" onClick={handleCopyHTML}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy HTML
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="p-8 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="bg-card rounded-lg border border-border p-8">
            <div className="prose dark:prose-invert max-w-none prose-p:my-2 prose-h1:mt-6 prose-h1:mb-4 prose-h2:mt-5 prose-h2:mb-3">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
