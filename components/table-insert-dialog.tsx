"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table2, Check } from "lucide-react"
import { useState, useRef } from "react"

interface TableInsertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInsert: (rows: number, cols: number, withHeaderRow: boolean) => void
}

export function TableInsertDialog({ open, onOpenChange, onInsert }: TableInsertDialogProps) {
  const [selectedRows, setSelectedRows] = useState(3)
  const [selectedCols, setSelectedCols] = useState(3)
  const [withHeaderRow, setWithHeaderRow] = useState(true)
  const [hoveredRows, setHoveredRows] = useState(0)
  const [hoveredCols, setHoveredCols] = useState(0)
  const gridRef = useRef<HTMLDivElement>(null)
  const maxRows = 10
  const maxCols = 10

  const handleCellHover = (row: number, col: number) => {
    setHoveredRows(row + 1)
    setHoveredCols(col + 1)
  }

  const handleCellClick = (row: number, col: number) => {
    setSelectedRows(row + 1)
    setSelectedCols(col + 1)
  }

  const handleMouseLeave = () => {
    setHoveredRows(0)
    setHoveredCols(0)
  }

  const handleInsert = () => {
    onInsert(selectedRows, selectedCols, withHeaderRow)
    onOpenChange(false)
    // Reset to default
    setTimeout(() => {
      setSelectedRows(3)
      setSelectedCols(3)
      setHoveredRows(0)
      setHoveredCols(0)
      setWithHeaderRow(true)
    }, 100)
  }

  const displayRows = hoveredRows > 0 ? hoveredRows : selectedRows
  const displayCols = hoveredCols > 0 ? hoveredCols : selectedCols

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Table2 className="w-5 h-5 text-primary" />
            </div>
            Insert Table
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Grid Selector */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-foreground">Select table size</div>
            <div
              ref={gridRef}
              className="grid grid-cols-10 gap-1 p-2 bg-muted/30 rounded-lg border border-border/50"
              onMouseLeave={handleMouseLeave}
            >
              {Array.from({ length: maxRows * maxCols }).map((_, index) => {
                const row = Math.floor(index / maxCols)
                const col = index % maxCols
                const isSelected = row < selectedRows && col < selectedCols
                const isHovered = row < displayRows && col < displayCols && (hoveredRows > 0 || hoveredCols > 0)
                const isActive = isHovered || (isSelected && hoveredRows === 0 && hoveredCols === 0)

                return (
                  <div
                    key={index}
                    className={`
                      w-6 h-6 rounded border-2 transition-all duration-150 cursor-pointer
                      ${isActive
                        ? 'bg-primary border-primary shadow-md scale-110'
                        : 'bg-background border-border/50 hover:border-primary/50'
                      }
                    `}
                    onMouseEnter={() => handleCellHover(row, col)}
                    onClick={() => handleCellClick(row, col)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${row + 1} by ${col + 1} table`}
                  />
                )
              })}
            </div>

            {/* Size Display */}
            <div className="flex items-center justify-between px-2">
              <div className="text-sm text-muted-foreground">
                {displayRows} × {displayCols} table
              </div>
              {hoveredRows > 0 && hoveredCols > 0 && (
                <div className="text-xs text-primary font-medium">
                  Click to select
                </div>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">Header row</div>
                <div className="text-xs text-muted-foreground">First row will be styled as header</div>
              </div>
              <button
                onClick={() => setWithHeaderRow(!withHeaderRow)}
                className={`
                  relative w-12 h-6 rounded-full transition-all duration-200
                  ${withHeaderRow ? 'bg-primary' : 'bg-muted'}
                `}
                role="switch"
                aria-checked={withHeaderRow}
                aria-label="Toggle header row"
              >
                <div
                  className={`
                    absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md
                    transition-transform duration-200
                    ${withHeaderRow ? 'translate-x-6' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="text-sm font-medium text-foreground">Preview</div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50 flex items-center justify-center">
              <div className="inline-block">
                <table className="border-collapse border border-border">
                  <tbody>
                    {Array.from({ length: Math.min(displayRows, 4) }).map((_, rowIndex) => {
                      const isHeader = withHeaderRow && rowIndex === 0
                      const CellTag = isHeader ? 'th' : 'td'
                      return (
                        <tr key={rowIndex}>
                          {Array.from({ length: Math.min(displayCols, 6) }).map((_, colIndex) => (
                            <CellTag
                              key={colIndex}
                              className={`
                                w-8 h-6 border border-border text-center text-xs
                                ${isHeader ? 'bg-primary/10 font-semibold' : 'bg-background'}
                              `}
                            >
                              {rowIndex === 0 && colIndex === 0 ? '•' : ''}
                            </CellTag>
                          ))}
                          {displayCols > 6 && (
                            <td className="w-4 h-6 border-0 text-xs text-muted-foreground">...</td>
                          )}
                        </tr>
                      )
                    })}
                    {displayRows > 4 && (
                      <tr>
                        {Array.from({ length: Math.min(displayCols, 6) }).map((_, colIndex) => (
                          <td
                            key={colIndex}
                            className="w-8 h-2 border-0 text-center text-xs text-muted-foreground"
                          >
                            ...
                          </td>
                        ))}
                        {displayCols > 6 && (
                          <td className="w-4 h-2 border-0 text-xs text-muted-foreground">...</td>
                        )}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="hover:scale-105 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleInsert}
            className="hover:scale-105 transition-all duration-200 hover:shadow-md"
          >
            <Check className="w-4 h-4 mr-2" />
            Insert Table
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}