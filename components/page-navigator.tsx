"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronUp, ChevronDown, FileText } from "lucide-react"
import { useEffect, useState } from "react"

export function PageNavigator({ editor }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!editor) return

    const updatePageCount = () => {
      try {
        const { doc, selection } = editor.state
        let pageBreakCount = 0
        let currentPageNum = 1

        // Count page breaks in the document
        doc.descendants((node, pos) => {
          if (node.type.name === 'pageBreak') {
            pageBreakCount++
            // Check if cursor is before this page break
            if (selection.from > pos) {
              currentPageNum = pageBreakCount + 1
            }
          }
        })

        const total = pageBreakCount + 1
        setTotalPages(total)
        setCurrentPage(Math.min(currentPageNum, total))
      } catch (error) {
        console.error("Error updating page count:", error)
        setTotalPages(1)
        setCurrentPage(1)
      }
    }

    updatePageCount()

    const handleUpdate = () => {
      updatePageCount()
    }

    editor.on("update", handleUpdate)
    editor.on("selectionUpdate", handleUpdate)

    return () => {
      editor.off("update", handleUpdate)
      editor.off("selectionUpdate", handleUpdate)
    }
  }, [editor])

  const goToPage = (page: number) => {
    if (!editor || page < 1 || page > totalPages) return

    try {
      const { doc } = editor.state
      let targetPos = 0
      let breakIndex = 0

      if (page === 1) {
        // Go to start of document
        editor.commands.setTextSelection(0)
        editor.commands.focus()
        return
      }

      // Find the page break that corresponds to the target page
      // Page 2 = first page break, Page 3 = second page break, etc.
      const targetBreakIndex = page - 2

      doc.descendants((node, pos) => {
        if (node.type.name === 'pageBreak') {
          if (breakIndex === targetBreakIndex) {
            // Found the target page break, position cursor right after it
            targetPos = pos + node.nodeSize
            return false // Stop searching
          }
          breakIndex++
        }
      })

      if (targetPos > 0) {
        editor.commands.setTextSelection(targetPos)
      } else {
        // Fallback: go to end if page not found
        editor.commands.setTextSelection(doc.content.size)
      }
      editor.commands.focus()
    } catch (error) {
      console.error("Error navigating to page:", error)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm border border-primary/20 shadow-lg">
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <h4 className="font-semibold text-sm text-foreground">Pages</h4>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="flex-1 hover:scale-105 transition-all duration-200"
            title="Previous Page"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-foreground">
              {currentPage}
            </div>
            <div className="text-xs text-muted-foreground">
              of {totalPages}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex-1 hover:scale-105 transition-all duration-200"
            title="Next Page"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {totalPages > 1 && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
            Use page breaks to organize your proposal
          </div>
        )}
      </div>
    </Card>
  )
}

