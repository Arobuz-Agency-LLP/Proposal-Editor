"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Table2,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Highlighter,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Code,
  Plus,
  Trash2,
  ChevronDown,
  Rows3,
  Columns3,
  Square,
  Merge,
  Split,
  FileText,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { TableInsertDialog } from "./table-insert-dialog"

export function EditorToolbar({ editor }) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [customColor, setCustomColor] = useState("#000000")
  const [customHighlightColor, setCustomHighlightColor] = useState("#FEF3C7")
  const [cellTextColor, setCellTextColor] = useState("#000000")
  const [cellBgColor, setCellBgColor] = useState("#FFFFFF")
  const [colorInputError, setColorInputError] = useState(false)
  const [highlightInputError, setHighlightInputError] = useState(false)
  const [cellTextColorError, setCellTextColorError] = useState(false)
  const [cellBgColorError, setCellBgColorError] = useState(false)
  const [showTableMenu, setShowTableMenu] = useState(false)
  const [showCellColorPicker, setShowCellColorPicker] = useState(false)
  const [showCellBgColorPicker, setShowCellBgColorPicker] = useState(false)
  const [showBulletMenu, setShowBulletMenu] = useState(false)
  const [showQuickInsertMenu, setShowQuickInsertMenu] = useState(false)
  const [showTableInsertDialog, setShowTableInsertDialog] = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const highlightPickerRef = useRef<HTMLDivElement>(null)
  const tableMenuRef = useRef<HTMLDivElement>(null)
  const cellColorPickerRef = useRef<HTMLDivElement>(null)
  const cellBgColorPickerRef = useRef<HTMLDivElement>(null)
  const bulletMenuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false)
      }
      if (highlightPickerRef.current && !highlightPickerRef.current.contains(event.target as Node)) {
        setShowHighlightPicker(false)
      }
      if (tableMenuRef.current && !tableMenuRef.current.contains(event.target as Node)) {
        setShowTableMenu(false)
      }
      if (cellColorPickerRef.current && !cellColorPickerRef.current.contains(event.target as Node)) {
        setShowCellColorPicker(false)
      }
      if (cellBgColorPickerRef.current && !cellBgColorPickerRef.current.contains(event.target as Node)) {
        setShowCellBgColorPicker(false)
      }
      if (bulletMenuRef.current && !bulletMenuRef.current.contains(event.target as Node)) {
        setShowBulletMenu(false)
        setShowQuickInsertMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!editor) {
    return null
  }

  // Get current color from editor with error handling
  const getCurrentColor = () => {
    try {
      const attrs = editor.getAttributes('textStyle')
      return attrs?.color || null
    } catch (error) {
      console.error("Error getting current color:", error)
      return null
    }
  }

  // Get current highlight color from editor with error handling
  const getCurrentHighlight = () => {
    try {
      const attrs = editor.getAttributes('highlight')
      return attrs?.color || null
    } catch (error) {
      console.error("Error getting current highlight:", error)
      return null
    }
  }

  // Organized color palette with categories
  const colorPalette = {
    grays: [
      { color: '#000000', name: 'Black' },
      { color: '#374151', name: 'Dark Gray' },
      { color: '#6B7280', name: 'Medium Gray' },
      { color: '#9CA3AF', name: 'Light Gray' },
    ],
    warm: [
      { color: '#EF4444', name: 'Red' },
      { color: '#F97316', name: 'Orange' },
      { color: '#EAB308', name: 'Yellow' },
      { color: '#F43F5E', name: 'Rose' },
    ],
    cool: [
      { color: '#3B82F6', name: 'Blue' },
      { color: '#06B6D4', name: 'Cyan' },
      { color: '#10B981', name: 'Green' },
      { color: '#6366F1', name: 'Indigo' },
    ],
    vibrant: [
      { color: '#8B5CF6', name: 'Purple' },
      { color: '#A855F7', name: 'Violet' },
      { color: '#EC4899', name: 'Pink' },
      { color: '#22C55E', name: 'Emerald' },
    ],
  }

  const highlightPalette = {
    light: [
      { color: '#FEF3C7', name: 'Yellow' },
      { color: '#DBEAFE', name: 'Blue' },
      { color: '#D1FAE5', name: 'Green' },
      { color: '#FCE7F3', name: 'Pink' },
    ],
    medium: [
      { color: '#FEE2E2', name: 'Red' },
      { color: '#FED7AA', name: 'Orange' },
      { color: '#E0E7FF', name: 'Indigo' },
      { color: '#F3E8FF', name: 'Purple' },
    ],
    bright: [
      { color: '#FDE68A', name: 'Amber' },
      { color: '#BFDBFE', name: 'Sky' },
      { color: '#A7F3D0', name: 'Mint' },
      { color: '#FBCFE8', name: 'Fuchsia' },
    ],
  }

  // Flatten for quick access
  const colors = Object.values(colorPalette).flat().map(item => item.color)
  const highlightColors = Object.values(highlightPalette).flat().map(item => item.color)

  const handleAddTable = () => {
    // If already in a table, show table menu instead
    if (editor.isActive('table')) {
      setShowTableMenu(!showTableMenu)
      return
    }
    // Open professional table insertion dialog
    setShowTableInsertDialog(true)
  }

  const handleInsertTable = (rows: number, cols: number, withHeaderRow: boolean) => {
    try {
      // Ensure we're not in a table before inserting
      if (editor.isActive('table')) {
        editor.chain().focus().run()
        return
      }

      // Insert table with proper structure
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        try {
          const result = editor
            .chain()
            .focus()
            .insertTable({ 
              rows, 
              cols, 
              withHeaderRow 
            })
            .run()

          if (!result) {
        // Fallback: try without header row
            editor
              .chain()
              .focus()
              .insertTable({ 
                rows, 
                cols, 
                withHeaderRow: false 
              })
              .run()
          } else {
            // After insertion, ensure table has proper width constraints
            setTimeout(() => {
              try {
                const tables = document.querySelectorAll('.editor-content table')
                if (tables.length > 0) {
                  const lastTable = tables[tables.length - 1] as HTMLTableElement
                  if (lastTable && lastTable.style) {
                    lastTable.style.setProperty('width', '100%')
                    lastTable.style.setProperty('max-width', '100%')
                    lastTable.style.setProperty('table-layout', 'auto')
                    lastTable.style.setProperty('overflow', 'hidden')
                    // Ensure all cells have proper constraints
                    const cells = lastTable.querySelectorAll('th, td')
                    cells.forEach((cell) => {
                      if (cell && cell instanceof HTMLElement && cell.style) {
                        cell.style.setProperty('max-width', '100%')
                        cell.style.setProperty('box-sizing', 'border-box')
                        cell.style.setProperty('overflow', 'hidden')
                        cell.style.setProperty('word-wrap', 'break-word')
                        cell.style.setProperty('overflow-wrap', 'break-word')
                        cell.style.setProperty('word-break', 'break-word')
                        // Ensure all child elements also respect width
                        const children = cell.querySelectorAll('*')
                        children.forEach((child) => {
                          if (child instanceof HTMLElement && child.style) {
                            child.style.setProperty('max-width', '100%', 'important')
                            child.style.setProperty('box-sizing', 'border-box', 'important')
                            child.style.setProperty('word-wrap', 'break-word', 'important')
                            child.style.setProperty('overflow-wrap', 'break-word', 'important')
                            child.style.setProperty('word-break', 'break-word', 'important')
                          }
                        })
                      }
                    })
                  }
                }
              } catch (styleError) {
                console.error("Error applying table styles:", styleError)
              }
            }, 50)
          }
    } catch (error) {
      console.error("Error inserting table:", error)
          // Try a simpler approach as last resort
          try {
            editor
              .chain()
              .focus()
              .insertTable({ 
                rows: Math.min(rows, 2), 
                cols: Math.min(cols, 2), 
                withHeaderRow: false 
              })
              .run()
          } catch (fallbackError) {
            console.error("Fallback table insertion also failed:", fallbackError)
            alert("Failed to insert table. Please try again or refresh the page.")
          }
        }
      }, 10)
    } catch (error) {
      console.error("Error in handleInsertTable:", error)
    }
  }

  const handleAddImage = () => {
    setShowImageDialog(true)
    setImageUrl("")
  }

  const handleImageUrlSubmit = () => {
    const trimmedUrl = imageUrl.trim()
    if (!trimmedUrl) {
      return
    }

    // Validate URL
    try {
      new URL(trimmedUrl)
    } catch {
      // Not a valid URL, might be a data URL or relative path
      if (!trimmedUrl.startsWith('data:') && !trimmedUrl.startsWith('/') && !trimmedUrl.startsWith('./')) {
        alert("Please enter a valid image URL")
        return
      }
    }

    try {
      editor.chain().focus().setImage({ src: trimmedUrl }).run()
      setShowImageDialog(false)
      setImageUrl("")
    } catch (error) {
      console.error("Error inserting image:", error)
      alert("Failed to insert image. Please check the URL and try again.")
    }
  }

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file")
      e.target.value = "" // Reset input
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      alert("Image size must be less than 10MB")
      e.target.value = "" // Reset input
      return
    }

    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const base64 = event.target?.result as string
        if (base64) {
          editor.chain().focus().setImage({ src: base64 }).run()
          setShowImageDialog(false)
          setImageUrl("")
        }
      } catch (error) {
        console.error("Error loading image:", error)
        alert("Failed to load image. Please try again.")
      }
    }

    reader.onerror = () => {
      alert("Failed to read image file. Please try again.")
      e.target.value = "" // Reset input
    }

    reader.readAsDataURL(file)
  }

  const handleAddLink = () => {
    try {
      const { from, to } = editor.state.selection
      const selectedText = editor.state.doc.textBetween(from, to)
      setLinkText(selectedText)
      
      // Check if we're in a link
      const linkAttrs = editor.getAttributes('link')
      setLinkUrl(linkAttrs.href || "")
      
      setShowLinkDialog(true)
    } catch (error) {
      console.error("Error opening link dialog:", error)
      // Fallback: just open dialog with empty fields
      setLinkText("")
      setLinkUrl("")
      setShowLinkDialog(true)
    }
  }

  const handleLinkSubmit = () => {
    let trimmedUrl = linkUrl.trim()
    if (!trimmedUrl) {
      alert("Please enter a URL")
      return
    }

    // Normalize URL - add https:// if no protocol
    if (!trimmedUrl.startsWith('http://') && 
        !trimmedUrl.startsWith('https://') && 
        !trimmedUrl.startsWith('mailto:') && 
        !trimmedUrl.startsWith('tel:') &&
        !trimmedUrl.startsWith('#') &&
        !trimmedUrl.startsWith('/')) {
      trimmedUrl = `https://${trimmedUrl}`
    }

    try {
      const trimmedText = linkText.trim()
      if (trimmedText) {
        // Insert new link with text
        editor.chain().focus().insertContent(`<a href="${trimmedUrl}">${trimmedText}</a>`).run()
      } else {
        // Apply link to selected text or current position
        if (editor.state.selection.empty) {
          // No selection, insert link text
          editor.chain().focus().insertContent(`<a href="${trimmedUrl}">${trimmedUrl}</a>`).run()
        } else {
          // Apply link to selection
          editor.chain().focus().extendMarkRange("link").setLink({ href: trimmedUrl }).run()
        }
      }
      setShowLinkDialog(false)
      setLinkUrl("")
      setLinkText("")
    } catch (error) {
      console.error("Error setting link:", error)
      alert("Failed to set link. Please try again.")
    }
  }

  const handleRemoveLink = () => {
    try {
      if (editor.isActive("link")) {
        editor.chain().focus().unsetLink().run()
      }
      setShowLinkDialog(false)
      setLinkUrl("")
      setLinkText("")
    } catch (error) {
      console.error("Error removing link:", error)
    }
  }

  const handleAddPlaceholder = () => {
    const placeholder = window.prompt("Enter placeholder key (e.g., client.name, budget, timeline):")
    if (placeholder && placeholder.trim()) {
      const trimmedPlaceholder = placeholder.trim()
      try {
      editor
        .chain()
        .focus()
          .insertContent(`<span data-placeholder-key="${trimmedPlaceholder}">{{${trimmedPlaceholder}}}</span> `)
        .run()
      } catch (error) {
        console.error("Error inserting placeholder:", error)
        alert("Failed to insert placeholder. Please try again.")
      }
    }
  }

  // Validate hex color
  const isValidHex = (hex: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
  }

  const handleCustomColor = () => {
    const trimmedColor = customColor.trim()
    if (!trimmedColor) {
      setColorInputError(true)
      setTimeout(() => setColorInputError(false), 2000)
      return
    }

    // Normalize color (add # if missing)
    const normalizedColor = trimmedColor.startsWith('#') ? trimmedColor : `#${trimmedColor}`
    
    if (isValidHex(normalizedColor)) {
      try {
        editor.chain().focus().setColor(normalizedColor).run()
        setCustomColor(normalizedColor)
        setShowColorPicker(false)
        setColorInputError(false)
      } catch (error) {
        console.error("Error setting color:", error)
        setColorInputError(true)
        setTimeout(() => setColorInputError(false), 2000)
      }
    } else {
      setColorInputError(true)
      setTimeout(() => setColorInputError(false), 2000)
    }
  }

  const handleCustomHighlightColor = () => {
    const trimmedColor = customHighlightColor.trim()
    if (!trimmedColor) {
      setHighlightInputError(true)
      setTimeout(() => setHighlightInputError(false), 2000)
      return
    }

    // Normalize color (add # if missing)
    const normalizedColor = trimmedColor.startsWith('#') ? trimmedColor : `#${trimmedColor}`
    
    if (isValidHex(normalizedColor)) {
      try {
        editor.chain().focus().toggleHighlight({ color: normalizedColor }).run()
        setCustomHighlightColor(normalizedColor)
        setShowHighlightPicker(false)
        setHighlightInputError(false)
      } catch (error) {
        console.error("Error setting highlight color:", error)
        setHighlightInputError(true)
        setTimeout(() => setHighlightInputError(false), 2000)
      }
    } else {
      setHighlightInputError(true)
      setTimeout(() => setHighlightInputError(false), 2000)
    }
  }

  const handleColorInputChange = (value: string) => {
    setCustomColor(value)
    // Normalize for validation
    const normalized = value.startsWith('#') ? value : `#${value}`
    if (colorInputError && isValidHex(normalized)) {
      setColorInputError(false)
    }
  }

  const handleHighlightInputChange = (value: string) => {
    setCustomHighlightColor(value)
    // Normalize for validation
    const normalized = value.startsWith('#') ? value : `#${value}`
    if (highlightInputError && isValidHex(normalized)) {
      setHighlightInputError(false)
    }
  }

  // Table operations - comprehensive functions
  const isInTable = editor.isActive("table")
  const canAddRowAfter = editor.can().addRowAfter()
  const canAddRowBefore = editor.can().addRowBefore()
  const canAddColumnAfter = editor.can().addColumnAfter()
  const canAddColumnBefore = editor.can().addColumnBefore()
  const canDeleteRow = editor.can().deleteRow()
  const canDeleteColumn = editor.can().deleteColumn()
  const canDeleteTable = editor.can().deleteTable()
  const canMergeCells = editor.can().mergeCells()
  const canSplitCell = editor.can().splitCell()

  // Get current cell attributes
  const getCurrentCellAttrs = () => {
    const attrs = editor.getAttributes('tableCell') || editor.getAttributes('tableHeader')
    return {
      backgroundColor: attrs.backgroundColor || null,
      color: attrs.color || null,
    }
  }

  const currentCellAttrs = isInTable ? getCurrentCellAttrs() : { backgroundColor: null, color: null }

  // Helper to ensure cursor is in a valid table cell
  const ensureInTableCell = () => {
    try {
      const { state } = editor
      const { selection } = state
      const { $anchor } = selection
      
      // Check if we're in a table cell
      let depth = $anchor.depth
      let foundCell = false
      
      while (depth >= 0) {
        const node = $anchor.node(depth)
        if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
          foundCell = true
          break
        }
        depth--
      }
      
      if (!foundCell) {
        // Try to find and move to a table cell
        const { doc } = state
        let cellPos = null
        
        doc.descendants((node, pos) => {
          if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
            cellPos = pos + 1 // Position after the cell opening tag
            return false // Stop searching
          }
        })
        
        if (cellPos !== null) {
          editor.chain().setTextSelection(cellPos).focus().run()
          return true
        }
        return false
      }
      
      return true
    } catch (error) {
      console.error('Error ensuring in table cell:', error)
      return false
    }
  }

  // Safe table operation wrapper
  const safeTableOperation = (operation: () => void, operationName: string) => {
    try {
      if (!isInTable) {
        console.warn(`Cannot ${operationName}: not in a table`)
        return
      }
      
      // Validate table structure before operations
      try {
        const { state } = editor
        const { selection } = state
        const { $anchor } = selection
        
        // Check if we can safely access table structure
        let tableNode = null
        let depth = $anchor.depth
        
        while (depth >= 0 && !tableNode) {
          const node = $anchor.node(depth)
          if (node.type.name === 'table') {
            tableNode = node
            break
          }
          depth--
        }
        
        if (!tableNode) {
          console.warn(`Cannot ${operationName}: table structure not found`)
          return
        }
      } catch (structureError) {
        console.error(`Error validating table structure:`, structureError)
        return
      }
      
      // Ensure cursor is in a valid cell
      if (!ensureInTableCell()) {
        console.warn(`Cannot ${operationName}: could not find valid table cell`)
        return
      }
      
      // Ensure focus
      editor.chain().focus().run()
      
      // Execute operation with retry logic
      try {
        operation()
        setShowTableMenu(false)
      } catch (error) {
        console.error(`Error during ${operationName}:`, error)
        
        // Retry after ensuring we're in a cell
        if (ensureInTableCell()) {
          try {
            operation()
            setShowTableMenu(false)
          } catch (retryError) {
            console.error(`Retry failed for ${operationName}:`, retryError)
          }
        }
      }
    } catch (error) {
      console.error(`Error in safeTableOperation for ${operationName}:`, error)
    }
  }

  // Table row operations
  const handleAddRowAfter = () => {
    safeTableOperation(() => {
      if (editor.can().addRowAfter()) {
        editor.chain().focus().addRowAfter().run()
      }
    }, 'add row after')
  }

  const handleAddRowBefore = () => {
    safeTableOperation(() => {
      if (editor.can().addRowBefore()) {
        editor.chain().focus().addRowBefore().run()
      }
    }, 'add row before')
  }

  const handleDeleteRow = () => {
    safeTableOperation(() => {
      if (editor.can().deleteRow()) {
        editor.chain().focus().deleteRow().run()
      }
    }, 'delete row')
  }

  // Table column operations
  const handleAddColumnAfter = () => {
    safeTableOperation(() => {
      if (editor.can().addColumnAfter()) {
        editor.chain().focus().addColumnAfter().run()
      }
    }, 'add column after')
  }

  const handleAddColumnBefore = () => {
    safeTableOperation(() => {
      if (editor.can().addColumnBefore()) {
        editor.chain().focus().addColumnBefore().run()
      }
    }, 'add column before')
  }

  const handleDeleteColumn = () => {
    safeTableOperation(() => {
      if (editor.can().deleteColumn()) {
        editor.chain().focus().deleteColumn().run()
      }
    }, 'delete column')
  }

  // Table operations
  const handleDeleteTable = () => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      safeTableOperation(() => {
        if (editor.can().deleteTable()) {
          editor.chain().focus().deleteTable().run()
        }
      }, 'delete table')
    }
  }

  // Cell merge operations
  const handleMergeCells = () => {
    safeTableOperation(() => {
      if (editor.can().mergeCells()) {
        editor.chain().focus().mergeCells().run()
      }
    }, 'merge cells')
  }

  const handleSplitCell = () => {
    safeTableOperation(() => {
      if (editor.can().splitCell()) {
        editor.chain().focus().splitCell().run()
      }
    }, 'split cell')
  }

  // Cell color operations with error handling
  const handleCellTextColor = (color: string) => {
    try {
      if (!isInTable) {
        console.warn('Cannot set cell color: not in a table')
        return
      }
      
      editor.chain().focus().setCellAttribute('color', color).run()
      setShowCellColorPicker(false)
    } catch (error) {
      console.error('Error setting cell text color:', error)
      // Fallback: try to set color on the current selection
      try {
        editor.chain().focus().setColor(color).run()
        setShowCellColorPicker(false)
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
      }
    }
  }

  const handleCellBgColor = (color: string) => {
    try {
      if (!isInTable) {
        console.warn('Cannot set cell background: not in a table')
        return
      }
      
      editor.chain().focus().setCellAttribute('backgroundColor', color).run()
      setShowCellBgColorPicker(false)
    } catch (error) {
      console.error('Error setting cell background color:', error)
      // Fallback: try to set highlight
      try {
        editor.chain().focus().toggleHighlight({ color }).run()
        setShowCellBgColorPicker(false)
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
      }
    }
  }

  const handleRemoveCellTextColor = () => {
    try {
      if (!isInTable) return
      
      editor.chain().focus().unsetCellAttribute('color').run()
      setShowCellColorPicker(false)
    } catch (error) {
      console.error('Error removing cell text color:', error)
    }
  }

  const handleRemoveCellBgColor = () => {
    try {
      if (!isInTable) return
      
      editor.chain().focus().unsetCellAttribute('backgroundColor').run()
      setShowCellBgColorPicker(false)
    } catch (error) {
      console.error('Error removing cell background color:', error)
    }
  }

  const handleCustomCellTextColor = () => {
    const trimmedColor = cellTextColor.trim()
    if (!trimmedColor) {
      setCellTextColorError(true)
      setTimeout(() => setCellTextColorError(false), 2000)
      return
    }

    // Normalize color (add # if missing)
    const normalizedColor = trimmedColor.startsWith('#') ? trimmedColor : `#${trimmedColor}`
    
    if (isValidHex(normalizedColor)) {
      try {
        handleCellTextColor(normalizedColor)
        setCellTextColor(normalizedColor)
        setCellTextColorError(false)
      } catch (error) {
        console.error("Error setting cell text color:", error)
        setCellTextColorError(true)
        setTimeout(() => setCellTextColorError(false), 2000)
      }
    } else {
      setCellTextColorError(true)
      setTimeout(() => setCellTextColorError(false), 2000)
    }
  }

  const handleCustomCellBgColor = () => {
    const trimmedColor = cellBgColor.trim()
    if (!trimmedColor) {
      setCellBgColorError(true)
      setTimeout(() => setCellBgColorError(false), 2000)
      return
    }

    // Normalize color (add # if missing)
    const normalizedColor = trimmedColor.startsWith('#') ? trimmedColor : `#${trimmedColor}`
    
    if (isValidHex(normalizedColor)) {
      try {
        handleCellBgColor(normalizedColor)
        setCellBgColor(normalizedColor)
        setCellBgColorError(false)
      } catch (error) {
        console.error("Error setting cell background color:", error)
        setCellBgColorError(true)
        setTimeout(() => setCellBgColorError(false), 2000)
      }
    } else {
      setCellBgColorError(true)
      setTimeout(() => setCellBgColorError(false), 2000)
    }
  }

  // Bullet points and list operations
  const handleInsertBulletList = () => {
    editor.chain().focus().toggleBulletList().run()
    setShowBulletMenu(false)
  }

  const handleInsertOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run()
    setShowBulletMenu(false)
  }

  const handleSinkList = () => {
    if (editor.can().sinkListItem('listItem')) {
      editor.chain().focus().sinkListItem('listItem').run()
      setShowBulletMenu(false)
    }
  }

  const handleLiftList = () => {
    if (editor.can().liftListItem('listItem')) {
      editor.chain().focus().liftListItem('listItem').run()
      setShowBulletMenu(false)
    }
  }

  const handleInsertBulletPoints = () => {
    const bulletPoints = [
      "First bullet point",
      "Second bullet point",
      "Third bullet point"
    ]
    const content = bulletPoints.map(point => `<li>${point}</li>`).join('')
    editor.chain().focus().insertContent(`<ul>${content}</ul>`).run()
    setShowBulletMenu(false)
    setShowQuickInsertMenu(false)
  }

  const handleInsertNumberedList = () => {
    const numberedItems = [
      "First item",
      "Second item",
      "Third item"
    ]
    const content = numberedItems.map(item => `<li>${item}</li>`).join('')
    editor.chain().focus().insertContent(`<ol>${content}</ol>`).run()
    setShowBulletMenu(false)
    setShowQuickInsertMenu(false)
  }

  const currentColor = getCurrentColor()
  const currentHighlight = getCurrentHighlight()

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur-xl shadow-sm p-4 flex gap-2 flex-wrap items-center overflow-x-auto overflow-y-visible relative">
        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Cmd+Z)"
          className="hover:scale-105 transition-transform duration-200 hover:shadow-md"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Cmd+Shift+Z)"
          className="hover:scale-105 transition-transform duration-200 hover:shadow-md"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="border-r border-border h-6" />

      {/* Text Formatting */}
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={editor.isActive("bold") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Cmd+B)"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("italic") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Cmd+I)"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("underline") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Cmd+U)"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <Underline className="w-4 h-4" />
        </Button>
      </div>

      <div className="border-r border-border h-6" />

      {/* Headings */}
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("heading", { level: 3 }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <Heading3 className="w-4 h-4" />
        </Button>
      </div>

      <div className="border-r border-border h-6" />

      {/* Lists & Bullet Points */}
      <div className="flex gap-1">
        {/* Main List Button with Menu */}
        <div className="relative" ref={bulletMenuRef}>
        <Button
          size="sm"
            variant={editor.isActive("bulletList") || editor.isActive("orderedList") ? "default" : "outline"}
            onClick={() => {
              if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
                setShowBulletMenu(!showBulletMenu)
              } else {
                handleInsertBulletList()
              }
            }}
            title="Bullet Points & Lists"
            className="gap-1"
        >
          <List className="w-4 h-4" />
            {(editor.isActive("bulletList") || editor.isActive("orderedList")) && (
              <ChevronDown className="w-3 h-3" />
            )}
          </Button>
          
          {showBulletMenu && (editor.isActive("bulletList") || editor.isActive("orderedList")) && (
            <div 
              className="absolute top-full left-0 mt-2 z-[100] bg-card border border-border/50 rounded-xl p-4 shadow-2xl w-64 min-w-[256px] backdrop-blur-sm"
              style={{
                animation: 'fadeInSlideDown 0.2s ease-out',
              }}
              role="menu"
              aria-label="Bullet points menu"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                <div className="text-sm font-semibold text-foreground">List Options</div>
              </div>

              {/* Quick Actions */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={editor.isActive("bulletList") ? "default" : "outline"}
                    onClick={handleInsertBulletList}
                    className="justify-start gap-2 text-xs"
                    title="Toggle Bullet List"
                  >
                    <List className="w-3.5 h-3.5" />
                    Bullet List
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("orderedList") ? "default" : "outline"}
                    onClick={handleInsertOrderedList}
                    className="justify-start gap-2 text-xs"
                    title="Toggle Numbered List"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                    Numbered
                  </Button>
                </div>
              </div>

              {/* Nested List Controls */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider">Nesting</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSinkList}
                    disabled={!editor.can().sinkListItem('listItem')}
                    className="justify-start gap-2 text-xs"
                    title="Indent (Create Nested List)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Indent
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLiftList}
                    disabled={!editor.can().liftListItem('listItem')}
                    className="justify-start gap-2 text-xs"
                    title="Outdent (Remove Nesting)"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    Outdent
                  </Button>
                </div>
              </div>

              {/* Quick Insert Templates */}
              <div className="pt-3 border-t border-border/50">
                <div className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider">Quick Insert</div>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleInsertBulletPoints}
                    className="w-full justify-start gap-2 text-xs"
                    title="Insert Bullet Points Template"
                  >
                    <List className="w-3.5 h-3.5" />
                    Insert 3 Bullet Points
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleInsertNumberedList}
                    className="w-full justify-start gap-2 text-xs"
                    title="Insert Numbered List Template"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                    Insert 3 Numbered Items
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Standalone Ordered List Button (always visible for quick access) */}
        <Button
          size="sm"
          variant={editor.isActive("orderedList") ? "default" : "outline"}
          onClick={handleInsertOrderedList}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        
        {/* Quick Insert Button (when not in a list) */}
        {!(editor.isActive("bulletList") || editor.isActive("orderedList")) && (
          <div className="relative">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowQuickInsertMenu(!showQuickInsertMenu)}
              title="Quick Insert Bullet Points"
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </Button>
            
            {showQuickInsertMenu && !(editor.isActive("bulletList") || editor.isActive("orderedList")) && (
              <div 
                className="absolute top-full left-0 mt-2 z-[100] bg-card border border-border/50 rounded-xl p-4 shadow-2xl w-56 min-w-[224px] backdrop-blur-sm"
                style={{
                  animation: 'fadeInSlideDown 0.2s ease-out',
                }}
                role="menu"
                aria-label="Quick insert bullet points"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                  <div className="text-sm font-semibold text-foreground">Quick Insert</div>
                </div>
                
                <div className="space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleInsertBulletPoints}
                    className="w-full justify-start gap-2 text-xs"
                    title="Insert 3 Bullet Points"
                  >
                    <List className="w-3.5 h-3.5" />
                    Insert 3 Bullet Points
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleInsertNumberedList}
                    className="w-full justify-start gap-2 text-xs"
                    title="Insert 3 Numbered Items"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                    Insert 3 Numbered Items
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-r border-border h-6" />

      {/* Text Alignment */}
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'left' }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Align Left"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'center' }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Align Center"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'right' }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Align Right"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <AlignRight className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'justify' }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          title="Justify"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <AlignJustify className="w-4 h-4" />
        </Button>
      </div>

      <div className="border-r border-border h-6" />

      {/* Colors */}
      <div className="flex gap-1">
        <div className="relative z-50" ref={colorPickerRef}>
          <Button
            size="sm"
            variant={showColorPicker || currentColor ? "default" : "outline"}
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Text Color"
            className="relative"
          >
            <Palette className="w-4 h-4" />
            {currentColor && (
              <span
                className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full border border-background"
                style={{ backgroundColor: currentColor }}
              />
            )}
          </Button>
          {showColorPicker && (
            <div 
              className="absolute top-full left-0 mt-2 z-[100] bg-card border border-border/50 rounded-xl p-5 shadow-2xl w-80 min-w-[320px] backdrop-blur-sm"
              style={{
                animation: 'fadeInSlideDown 0.2s ease-out',
              }}
              role="dialog"
              aria-label="Text color picker"
              aria-modal="false"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowColorPicker(false)
                }
              }}
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                <div className="text-sm font-semibold text-foreground">Text Color</div>
              </div>
              
              {/* Default Color */}
              <div className="mb-5">
                <button
                  className={`w-full h-10 rounded-lg border-2 transition-all duration-200 bg-background flex items-center justify-center gap-2 text-foreground hover:scale-[1.02] hover:shadow-md ${
                    !currentColor 
                      ? 'border-primary ring-2 ring-primary/30 shadow-sm bg-primary/5' 
                      : 'border-border/50 hover:border-primary/50 hover:ring-1 hover:ring-primary/20'
                  }`}
                  onClick={() => {
                    editor.chain().focus().unsetColor().run()
                    setShowColorPicker(false)
                  }}
                  title="Default Color"
                  aria-label="Reset to default color"
                >
                  <span className="text-sm font-semibold">Reset to Default</span>
                </button>
              </div>

              {/* Color Categories */}
              <div className="space-y-4 mb-5 max-h-[280px] overflow-y-auto pr-1">
                {Object.entries(colorPalette).map(([category, colors]) => (
                  <div key={category}>
                    <div className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                    <div className="grid grid-cols-4 gap-2.5">
                      {colors.map(({ color, name }) => (
                  <button
                    key={color}
                          className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2 hover:ring-offset-1 group relative ${
                            currentColor === color 
                              ? 'border-primary ring-2 ring-primary/40 ring-offset-1 shadow-md scale-105' 
                              : 'border-border/50 hover:border-primary/60 hover:ring-primary/20'
                          }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run()
                      setShowColorPicker(false)
                    }}
                          title={`${name} (${color})`}
                          aria-label={`Select ${name} color ${color}`}
                        >
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {name}
                          </span>
                        </button>
                ))}
              </div>
            </div>
                ))}
              </div>
              
              {/* Custom Color Input */}
              <div className="pt-4 border-t border-border/50">
                <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Custom Color</div>
                <div className="flex gap-2.5 items-center">
                  <div className="relative group">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => handleColorInputChange(e.target.value)}
                      className="w-12 h-12 rounded-lg border-2 border-border/50 cursor-pointer hover:border-primary/50 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                      title="Custom Color Picker"
                      aria-label="Custom color picker"
                    />
                    <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-border/20 pointer-events-none group-hover:ring-primary/30 transition-colors"></div>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={customColor}
                      onChange={(e) => handleColorInputChange(e.target.value)}
                      placeholder="#000000"
                      className={`h-12 text-sm font-mono border-2 rounded-lg transition-all ${
                        colorInputError 
                          ? 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20' 
                          : 'border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20'
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCustomColor()
                        }
                      }}
                      aria-label="Hex color code input"
                      aria-invalid={colorInputError}
                    />
                    {colorInputError && (
                      <p className="text-xs text-destructive mt-1">Invalid hex color</p>
          )}
        </div>
          <Button
            size="sm"
                    onClick={handleCustomColor}
                    className="h-12 px-5 font-medium shadow-sm hover:shadow-md transition-all"
                    aria-label="Apply custom color"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="relative z-50" ref={highlightPickerRef}>
          <Button
            size="sm"
            variant={showHighlightPicker || currentHighlight ? "default" : "outline"}
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            title="Highlight"
            className="relative"
          >
            <Highlighter className="w-4 h-4" />
            {currentHighlight && (
              <span
                className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full border border-background"
                style={{ backgroundColor: currentHighlight }}
              />
            )}
          </Button>
          {showHighlightPicker && (
            <div 
              className="absolute top-full left-0 mt-2 z-[100] bg-card border border-border/50 rounded-xl p-5 shadow-2xl w-80 min-w-[320px] backdrop-blur-sm"
              style={{
                animation: 'fadeInSlideDown 0.2s ease-out',
              }}
              role="dialog"
              aria-label="Highlight color picker"
              aria-modal="false"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowHighlightPicker(false)
                }
              }}
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                <div className="text-sm font-semibold text-foreground">Highlight Color</div>
              </div>
              
              {/* Remove Highlight */}
              <div className="mb-5">
                <button
                  className="w-full h-10 rounded-lg border-2 border-border/50 transition-all duration-200 bg-background flex items-center justify-center gap-2 text-foreground hover:scale-[1.02] hover:shadow-md hover:border-primary/50 hover:ring-1 hover:ring-primary/20"
                  onClick={() => {
                    editor.chain().focus().unsetHighlight().run()
                    setShowHighlightPicker(false)
                  }}
                  title="Remove Highlight"
                  aria-label="Remove highlight"
                >
                  <span className="text-sm font-semibold">Remove Highlight</span>
                </button>
              </div>

              {/* Highlight Categories */}
              <div className="space-y-4 mb-5 max-h-[280px] overflow-y-auto pr-1">
                {Object.entries(highlightPalette).map(([category, colors]) => (
                  <div key={category}>
                    <div className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider">
                      {category.charAt(0).toUpperCase() + category.slice(1)} Highlights
                    </div>
                    <div className="grid grid-cols-4 gap-2.5">
                      {colors.map(({ color, name }) => (
                  <button
                    key={color}
                          className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2 hover:ring-offset-1 group relative ${
                            currentHighlight === color 
                              ? 'border-primary ring-2 ring-primary/40 ring-offset-1 shadow-md scale-105' 
                              : 'border-border/50 hover:border-primary/60 hover:ring-primary/20'
                          }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color }).run()
                      setShowHighlightPicker(false)
                    }}
                          title={`${name} highlight (${color})`}
                          aria-label={`Select ${name} highlight color ${color}`}
                        >
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {name}
                          </span>
                        </button>
                ))}
              </div>
            </div>
                ))}
              </div>
              
              {/* Custom Highlight Input */}
              <div className="pt-4 border-t border-border/50">
                <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Custom Highlight</div>
                <div className="flex gap-2.5 items-center">
                  <div className="relative group">
                    <input
                      type="color"
                      value={customHighlightColor}
                      onChange={(e) => handleHighlightInputChange(e.target.value)}
                      className="w-12 h-12 rounded-lg border-2 border-border/50 cursor-pointer hover:border-primary/50 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                      title="Custom Highlight Color Picker"
                      aria-label="Custom highlight color picker"
                    />
                    <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-border/20 pointer-events-none group-hover:ring-primary/30 transition-colors"></div>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={customHighlightColor}
                      onChange={(e) => handleHighlightInputChange(e.target.value)}
                      placeholder="#FEF3C7"
                      className={`h-12 text-sm font-mono border-2 rounded-lg transition-all ${
                        highlightInputError 
                          ? 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20' 
                          : 'border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20'
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCustomHighlightColor()
                        }
                      }}
                      aria-label="Hex highlight color code input"
                      aria-invalid={highlightInputError}
                    />
                    {highlightInputError && (
                      <p className="text-xs text-destructive mt-1">Invalid hex color</p>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handleCustomHighlightColor}
                    className="h-12 px-5 font-medium shadow-sm hover:shadow-md transition-all"
                    aria-label="Apply custom highlight color"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-r border-border h-6" />

      {/* Additional Formatting */}
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={editor.isActive("blockquote") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("codeBlock") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <Code className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setPageBreak().run()}
          title="Page Break (Cmd+Enter)"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <FileText className="w-4 h-4" />
        </Button>
      </div>

      <div className="border-r border-border h-6" />

      {/* Media & Links */}
      <div className="flex gap-1">
        <Button 
          size="sm" 
          variant={editor.isActive("link") ? "default" : "outline"} 
          onClick={handleAddLink} 
          title="Add/Edit Link"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleAddImage} 
          title="Add Image"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        {/* Table Menu */}
        <div className="relative" ref={tableMenuRef}>
          <Button 
            size="sm" 
            variant={isInTable ? "default" : "outline"} 
            onClick={handleAddTable}
            title={isInTable ? "Table Operations" : "Insert Table"}
            className="gap-1 hover:scale-105 transition-all duration-200 hover:shadow-md"
          >
          <Table2 className="w-4 h-4" />
            {isInTable && <ChevronDown className="w-3 h-3" />}
        </Button>
          
          {showTableMenu && isInTable && (
            <div 
              className="absolute top-full left-0 mt-2 z-[100] bg-card border border-border/50 rounded-xl p-4 shadow-2xl w-72 min-w-[288px] backdrop-blur-sm"
              style={{
                animation: 'fadeInSlideDown 0.2s ease-out',
              }}
              role="menu"
              aria-label="Table operations menu"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                <div className="text-sm font-semibold text-foreground">Table Operations</div>
              </div>

              {/* Row Operations */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider flex items-center gap-2">
                  <Rows3 className="w-3 h-3" />
                  Rows
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddRowBefore}
                    disabled={!canAddRowBefore}
                    className="justify-start gap-2 text-xs"
                    title="Add Row Before"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Before
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddRowAfter}
                    disabled={!canAddRowAfter}
                    className="justify-start gap-2 text-xs"
                    title="Add Row After"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add After
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDeleteRow}
                    disabled={!canDeleteRow}
                    className="justify-start gap-2 text-xs col-span-2 text-destructive hover:text-destructive"
                    title="Delete Row"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Row
                  </Button>
                </div>
              </div>

              {/* Column Operations */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider flex items-center gap-2">
                  <Columns3 className="w-3 h-3" />
                  Columns
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddColumnBefore}
                    disabled={!canAddColumnBefore}
                    className="justify-start gap-2 text-xs"
                    title="Add Column Before"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Before
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddColumnAfter}
                    disabled={!canAddColumnAfter}
                    className="justify-start gap-2 text-xs"
                    title="Add Column After"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add After
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDeleteColumn}
                    disabled={!canDeleteColumn}
                    className="justify-start gap-2 text-xs col-span-2 text-destructive hover:text-destructive"
                    title="Delete Column"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Column
                  </Button>
                </div>
              </div>

              {/* Cell Operations */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider flex items-center gap-2">
                  <Square className="w-3 h-3" />
                  Cells
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleMergeCells}
                    disabled={!canMergeCells}
                    className="justify-start gap-2 text-xs"
                    title="Merge Cells"
                  >
                    <Merge className="w-3.5 h-3.5" />
                    Merge
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSplitCell}
                    disabled={!canSplitCell}
                    className="justify-start gap-2 text-xs"
                    title="Split Cell"
                  >
                    <Split className="w-3.5 h-3.5" />
                    Split
                  </Button>
                </div>
              </div>

              {/* Cell Colors */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider">Cell Colors</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative" ref={cellColorPickerRef}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCellColorPicker(!showCellColorPicker)}
                      className="w-full justify-start gap-2 text-xs"
                      title="Cell Text Color"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      Text Color
                    </Button>
                    {showCellColorPicker && (
                      <div 
                        className="absolute top-full left-0 mt-1 z-[110] bg-card border border-border/50 rounded-lg p-3 shadow-xl w-64"
                        style={{
                          animation: 'fadeInSlideDown 0.15s ease-out',
                        }}
                      >
                        <div className="text-xs font-medium mb-2 text-muted-foreground">Cell Text Color</div>
                        <div className="grid grid-cols-4 gap-2 mb-2">
                          <button
                            className="w-8 h-8 rounded-lg border-2 border-border/50 hover:scale-110 transition-all bg-background flex items-center justify-center text-xs"
                            onClick={handleRemoveCellTextColor}
                            title="Remove Color"
                          >
                            ×
                          </button>
                          {colors.slice(0, 15).map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                                currentCellAttrs.color === color 
                                  ? 'border-primary ring-2 ring-primary/40' 
                                  : 'border-border/50 hover:border-primary/60'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => handleCellTextColor(color)}
                              title={color}
                            />
                          ))}
                        </div>
                        <div className="flex gap-1.5 items-center pt-2 border-t border-border/50">
                          <input
                            type="color"
                            value={cellTextColor}
                            onChange={(e) => setCellTextColor(e.target.value)}
                            className="w-8 h-8 rounded border border-border cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={cellTextColor}
                            onChange={(e) => setCellTextColor(e.target.value)}
                            placeholder="#000000"
                            className="flex-1 h-8 text-xs font-mono"
                          />
                          <Button size="sm" onClick={handleCustomCellTextColor} className="h-8 px-2 text-xs">
                            Apply
                          </Button>
                        </div>
                        {cellTextColorError && (
                          <p className="text-xs text-destructive mt-1">Invalid color</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="relative" ref={cellBgColorPickerRef}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCellBgColorPicker(!showCellBgColorPicker)}
                      className="w-full justify-start gap-2 text-xs"
                      title="Cell Background Color"
                    >
                      <Square className="w-3.5 h-3.5" />
                      Background
                    </Button>
                    {showCellBgColorPicker && (
                      <div 
                        className="absolute top-full right-0 mt-1 z-[110] bg-card border border-border/50 rounded-lg p-3 shadow-xl w-64"
                        style={{
                          animation: 'fadeInSlideDown 0.15s ease-out',
                        }}
                      >
                        <div className="text-xs font-medium mb-2 text-muted-foreground">Cell Background</div>
                        <div className="grid grid-cols-4 gap-2 mb-2">
                          <button
                            className="w-8 h-8 rounded-lg border-2 border-border/50 hover:scale-110 transition-all bg-background flex items-center justify-center text-xs"
                            onClick={handleRemoveCellBgColor}
                            title="Remove Background"
                          >
                            ×
                          </button>
                          {highlightColors.map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                                currentCellAttrs.backgroundColor === color 
                                  ? 'border-primary ring-2 ring-primary/40' 
                                  : 'border-border/50 hover:border-primary/60'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => handleCellBgColor(color)}
                              title={color}
                            />
                          ))}
                        </div>
                        <div className="flex gap-1.5 items-center pt-2 border-t border-border/50">
                          <input
                            type="color"
                            value={cellBgColor}
                            onChange={(e) => setCellBgColor(e.target.value)}
                            className="w-8 h-8 rounded border border-border cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={cellBgColor}
                            onChange={(e) => setCellBgColor(e.target.value)}
                            placeholder="#FFFFFF"
                            className="flex-1 h-8 text-xs font-mono"
                          />
                          <Button size="sm" onClick={handleCustomCellBgColor} className="h-8 px-2 text-xs">
                            Apply
                          </Button>
                        </div>
                        {cellBgColorError && (
                          <p className="text-xs text-destructive mt-1">Invalid color</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Delete Table */}
              <div className="pt-3 border-t border-border/50">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDeleteTable}
                  disabled={!canDeleteTable}
                  className="w-full justify-start gap-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Delete Table"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Table
                </Button>
              </div>
            </div>
          )}
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleAddPlaceholder} 
          title="Add Placeholder"
          className="hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <Code2 className="w-4 h-4" />
        </Button>
      </div>
    </div>

    {/* Table Insert Dialog */}
    <TableInsertDialog
      open={showTableInsertDialog}
      onOpenChange={setShowTableInsertDialog}
      onInsert={handleInsertTable}
    />

    {/* Link Dialog */}
    <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
      <DialogContent onClose={() => setShowLinkDialog(false)}>
        <DialogHeader>
          <DialogTitle>Add/Edit Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">URL</label>
            <Input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleLinkSubmit()
                } else if (e.key === "Escape") {
                  setShowLinkDialog(false)
                }
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Link Text (optional)</label>
            <Input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleLinkSubmit()
                } else if (e.key === "Escape") {
                  setShowLinkDialog(false)
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          {editor.isActive("link") && (
            <Button variant="outline" onClick={handleRemoveLink}>
              Remove Link
            </Button>
          )}
          <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleLinkSubmit} disabled={!linkUrl.trim()}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Image Dialog */}
    <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
      <DialogContent onClose={() => setShowImageDialog(false)}>
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Image URL</label>
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleImageUrlSubmit()
                } else if (e.key === "Escape") {
                  setShowImageDialog(false)
                }
              }}
            />
          </div>
          <div className="relative">
            <div className="text-sm font-medium mb-2">Or upload from file</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowImageDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleImageUrlSubmit} disabled={!imageUrl.trim()}>
            Add Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
